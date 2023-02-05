<template>
  <div class="full-height full-width">
    <q-table
      ref="tableRef"
      :columns="selectedColumns"
      :loading="loading"
      :pagination="pagination"
      :row-key="row => rowKey(row)"
      :rows="filteredRows"
      :rows-per-page-options="[0, 10, 20, 50, 100]"
      :separator="separator"
      class="sticky-header-table"
      column-sort-order="da"
      dense
      flat
      style="height: 1000px; font-family: monospace; font-weight: bold"
      table-header-class="cursive-font"
      @request="onRequest"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            <span v-if="col.show" class="cursive-font">
            <q-btn-dropdown :label="col.label" align="center" dense flat rounded>
              <q-item>
                <q-input v-if="filters.find(f => f?.label === col.label && f?.type === 'string')"
                         dense flat label="Filter" rounded
                         @update:model-value="value => setStringFilter(value, col.label)"/>
                <suspense v-else>
                <numeric-filter :ref="nf => addNumericFilter(nf, col.label)" :label="col.label"
                                :max="filters.find(f => f?.label === col.label && f?.type === 'number')?.max"
                                :min="filters.find(f => f?.label === col.label && f?.type === 'number')?.min"/>
                </suspense>
              </q-item>
              <div class="row fit justify-center" style="margin-bottom: 2%">
                <q-space/>
                <q-btn dense flat label="Apply" @click="applyFilter(col.label)"/>
                <q-space/>
                <q-btn dense flat label="Reset" @click="clearFilter(col.label)"/>
                <q-space/>
              </div>
            </q-btn-dropdown>
              <q-btn
                :text-color="getAscendingSortColor(col)"
                color="black"
                dense
                flat
                icon="arrow_upward"
                round
                size="sm"
                @click="onAscendingSort(col, props)"
              />
              <q-btn
                :text-color="getDescendingSortColor(col)"
                color="black"
                dense
                flat
                icon="arrow_downward"
                round
                size="sm"
                @click="onDescendingSort(col, props)"
              />
            </span>
          </q-th>
        </q-tr>
      </template>
      <template v-slot:top>
        <q-select :model-value="selectedMod" :options="modsDisplayNames"
                  class="cursive-font" dense flat
                  label="Mod" label-color="grey" rounded
                  @update:model-value="value => {selectedMod.value = value; onModChange(value)}"/>
        <q-btn-dropdown
          class="cursive-font"
          flat
          label="Columns"
        >
          <q-item clickable @click="toggleShowAllColumns">
            <q-item-section avatar>
              <q-checkbox :model-value="showAllColumns" @click="toggleShowAllColumns"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Show All</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-for="col in columns" :key="col.name" clickable @click="toggleColumn(col.name)">
            <q-item-section avatar>
              <q-checkbox :model-value="col.show" @click="toggleColumn(col.name)"/>
            </q-item-section>
            <q-item-section>{{ col.label }}</q-item-section>
          </q-item>
        </q-btn-dropdown>
        <q-space/>
        <div v-if="filtersAreActive" class="cursive-font">
          Active Filters:
          <q-chip v-for="filter in activeFilters" :key="filter.label"
                  :label="filter?.filter?.lower ? `${filter.label}: Min: ${filter?.filter?.lower}, Max: ${filter?.filter?.upper}`: `${filter?.label}: ${filter?.filter}`"
                  color="grey" icon="close" text-color="white"
                  @click="clearFilter(filter.label)"/>
        </div>
        <q-btn v-if="filtersAreActive"
               class="cursive-font"
               color="red"
               dense
               flat
               icon="clear"
               label="Clear Filters"
               @click="clearAllFilters"/>
        <q-space/>
        <q-space/>
        <q-toggle
          :model-value="showGrid"
          class="cursive-font"
          color="grey"
          dense
          label="Grid"
          @update:model-value="value => showGrid = value"
        />
      </template>
    </q-table>
  </div>
</template>

<style lang="sass">

.sticky-header-table
  height: 310px

  thead tr:first-child th
    background-color: #8a8a8a

  thead tr th
    position: sticky
    z-index: 1

  thead tr:first-child th
    top: 0


  &.q-table--loading thead tr:last-child th

    top: 48px


</style>

<script setup>
import {computed, onBeforeMount, reactive, ref} from 'vue';
import {useMods} from '../composables/useMods';
import {useCombinations} from '../composables/useCombinations';
import NumericFilter from 'components/NumericFilter.vue';

const {getMods, getModFromDisplayString, getModDisplayName} = useMods();

const {setMod, setModError, combinationsError, getCombinations, getTotalCombinations, getMinMax} = useCombinations();

let rows = []
const tableRef = ref();
const filteredRows = ref([])
const selectedColumns = ref([])
const showAllColumns = ref(true)
const loading = ref(true)
const numericFilters = reactive({})
const showGrid = ref(false)
const selectedMod = ref(null)
const columns = ref([])
const filters = ref([])
let mods = ref([])

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 0,
})


onBeforeMount(async () => {
  mods.value = await getMods()
  let initialModString = getModDisplayName(mods.value[0])
  selectedMod.value = initialModString
  await onModChange(initialModString)
  if (!combinationsError.value && !setModError.value) {
    console.log('no errors')
  }
})
const onModChange = async (modString) => {
  let mod = getModFromDisplayString(modString)
  await setMod(mod)
  if (combinationsError.value === null && setModError.value === null) {
    columns.value = getColumns(mod)
    console.log('columns.value', columns.value)
    selectedColumns.value = columns.value
    await tableRef.value.requestServerInteraction()
  } else {
    console.log('error setting mod')
  }
}

async function onRequest(props) {
  const {page, rowsPerPage, sortBy, descending} = props.pagination
  loading.value = true

  let totalCombinations = await getTotalCombinations()
  pagination.value.rowsNumber = totalCombinations

  const fetchCount = rowsPerPage === 0 ? totalCombinations : rowsPerPage
  filteredRows.value = await getCombinations(page, fetchCount)

  filters.value = await getFilters()

  console.log('filters.value', filters.value)

  console.log('filteredRows.value', filteredRows.value)
  pagination.value.page = page
  pagination.value.rowsPerPage = rowsPerPage
  pagination.value.sortBy = sortBy
  pagination.value.descending = descending

  loading.value = false
}

const resetSort = () => {
  columns.value.forEach(col => {
    col.isSorted.ascending = false
    col.isSorted.descending = false
  })
}

const onDescendingSort = (col, props) => {
  resetSort()
  col.isSorted.descending = true
  col.isSorted.ascending = false
  props.sort(col.name, 'da')
}

const onAscendingSort = (col, props) => {
  resetSort()
  col.isSorted.descending = false
  col.isSorted.ascending = true
  props.sort(col.name, 'as')
}

const toggleColumn = (colName) => {
  columns.value.find(col => col.name === colName).show = !columns.value.find(col => col.name === colName).show
  selectedColumns.value = columns.value.filter(col => col.show)
}

const toggleShowAllColumns = () => {
  showAllColumns.value = !showAllColumns.value
  columns.value.forEach(col => col.show = showAllColumns.value)
  selectedColumns.value = columns.value.filter(col => col.show)
}

const getAscendingSortColor = (col) => {
  return col.isSorted.ascending ? 'green' : 'white';
}

const getDescendingSortColor = (col) => {
  return col.isSorted.descending ? 'green' : 'white';
}

const clearFilter = (columnLabel) => {
  filters[columnLabel].filter = null
}

const applyFilter = (columnLabel) => {
  if (filters.value.find(f => f.label === columnLabel)?.type === 'number') {
    let filter = numericFilters[columnLabel]?.getValues()
    filters.value.find(f => f.label === columnLabel).filter = filter
    filteredRows.value = filteredRows.value.filter(row => row[columnLabel] >= filter.lower && row[columnLabel] <= filter.upper)
    filters.value.find(f => f?.label === columnLabel).filter = filter
  } else {
    let filter = filters.value.find(f => f.label === columnLabel).filter
    filters.value.filter(f => f.label === columnLabel)[0].filter = filter
    filteredRows.value = filteredRows.value.filter(row => row[columnLabel].toLowerCase().includes(filter.toLowerCase()))
    filters.value.find(f => f?.label === columnLabel).filter = filter
  }
}

const clearAllFilters = () => {
  filters.value.forEach(f => f.filter = null)
  filteredRows.value = rows
}

const setStringFilter = (value, columnLabel) => {
  filters.value.find(f => f.label === columnLabel).filter = value
}

const addNumericFilter = (numericFilter, column) => {
  numericFilters[column] = numericFilter
}

const filtersAreActive = computed(() => {
  return activeFilters.value.length !== 0
})

const activeFilters = computed(() => {
  return filters.value?.filter(f => f?.filter !== null)
})

const modsDisplayNames = computed(() => {
  return mods.value.map(mod => `${mod.name} ${mod.version}`)
})

const separator = computed(() => {
  return showGrid.value ? 'cell' : 'none'
})

const rowKey = (row) => {
  return JSON.stringify(row)
}

const getColumns = (mod) => {
  return mod.columns.map(key => ({
    name: key,
    format: val => val === -1 || val === undefined ? 'N/A' : `${val}`,
    label: key,
    field: key,
    sortable: false,
    isSorted: {
      ascending: false,
      descending: false
    },
    show: true,
    align: 'center'
  }))
}

const getFilters = async () => {
  if (filters.value.length > 0) {
    return filters.value
  }
  let result = [];
  for (const column of columns.value) {
    let minmax = await getMinMax(column.field);
    result.push({
      label: column.label,
      type: typeof filteredRows.value[0][column.field] === 'string' ? 'string' : 'number',
      min: minmax.min,
      max: minmax.max,
      filter: null
    });
  }
  return result;
}

</script>



