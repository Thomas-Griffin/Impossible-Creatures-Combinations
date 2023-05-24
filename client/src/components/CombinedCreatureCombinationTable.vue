<template>
  <q-table
    ref="tableRef"
    v-model:pagination="pagination"
    :columns="selectedColumns"
    :loading="loading"
    :row-key="row => rowKey(row)"
    :rows="filteredRows"
    :rows-per-page-options="[100, 50, 20, 10]"
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
            <q-btn-dropdown :label="col.label" align="center" dense dropdown-icon="search" flat no-icon-animation
                            rounded>
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
                <q-btn dense flat label="Apply" @click="applyFilters"/>
                <q-space/>
                <q-btn dense flat label="Reset" @click="() => clearFilter(col.label)"/>
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
                @click="onAscendingSort(col)"
              />
              <q-btn
                :text-color="getDescendingSortColor(col)"
                color="black"
                dense
                flat
                icon="arrow_downward"
                round
                size="sm"
                @click="onDescendingSort(col)"
              />
            </span>
        </q-th>
      </q-tr>
    </template>
    <template v-slot:top>
      <q-select :model-value="selectedMod" :options="modsDisplayNames"
                class="cursive-font" dense flat
                label="Mod" label-color="grey" rounded
                @update:model-value="value => {onModChange(value)}"/>
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
                :label="filter?.filter?.min && filter?.filter?.max ? `${filter.label}: Min: ${filter?.filter?.min}, Max: ${filter?.filter?.max}`: `${filter?.label}: ${filter?.filter}`"
                clickable color="grey" icon="close"
                text-color="white"
                @click="() => clearFilter(filter.label)"/>
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
</template>

<style lang="sass">

.sticky-header-table
  height: calc(100vh - 50px) !important

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
import {computed, onBeforeMount, ref} from 'vue';
import {useMods} from '../composables/useMods';
import {useCombinations} from '../composables/useCombinations';
import NumericFilter from 'components/NumericFilter.vue';

const {getMods, getModFromDisplayString, getModDisplayName} = useMods();
const {getCombinations, combinationsError, getTotalCombinations, getMinMax} = useCombinations();

const tableRef = ref();
const filteredRows = ref([])
const selectedColumns = ref([])
const showAllColumns = ref(true)
const loading = ref(true)
const numericFilters = ref({})
const showGrid = ref(false)
const selectedMod = ref(null)
const columns = ref([])
const filters = ref([])
const mods = ref([])
const pagination = ref({page: 1, rowsPerPage: 100})

onBeforeMount(async () => {
  mods.value = await getMods()
  let initialModString = getModDisplayName(mods.value[0])
  selectedMod.value = initialModString
  await onModChange(initialModString)
})

const onModChange = async (modString) => {
  selectedMod.value = modString
  let mod = getModFromDisplayString(modString)
  if (combinationsError.value === null) {
    columns.value = getColumns(mod)
    selectedColumns.value = columns.value
    await tableRef.value.requestServerInteraction()
  }
}

async function onRequest(props) {
  loading.value = true

  for (let numericFiltersKey in numericFilters.value) {
    let numericFilter = numericFilters.value[numericFiltersKey]
    if (numericFilter?.getValues().min !== null && numericFilter?.getValues().max !== null && numericFilter?.getValues().min !== undefined && numericFilter?.getValues().max !== undefined) {
      filters.value.find(filter => filter.label === numericFiltersKey).filter = numericFilter?.getValues() ?? null
    }
  }

  let sorting = {column: columns.value[0].name, order: 'ascending'}
  let sortedColumn = columns.value.find(col => col.isSorted.ascending || col.isSorted.descending)
  if (sortedColumn) {
    sorting = {column: sortedColumn.name, order: sortedColumn.isSorted.ascending ? 'ascending' : 'descending'}
  }
  let postBody = {
    mod: getModFromDisplayString(selectedMod.value),
    sorting: sorting,
    filters: filters.value !== null ? filters.value : [],
  }

  filteredRows.value = await getCombinations(props.pagination.page, props.pagination.rowsPerPage, postBody)
  let totalCombinations = await getTotalCombinations(postBody)
  props.pagination.rowsNumber = totalCombinations
  pagination.value.rowsNumber = totalCombinations
  filters.value = await getFilters()

  const {page, rowsPerPage} = props.pagination
  pagination.value.page = page
  pagination.value.rowsPerPage = rowsPerPage

  loading.value = false
}

const resetSort = () => {
  columns.value.forEach(col => {
    col.isSorted.ascending = false
    col.isSorted.descending = false
  })
}

const onDescendingSort = async (col) => {
  resetSort()
  col.isSorted.descending = true
  col.isSorted.ascending = false
  await tableRef.value.requestServerInteraction()
}

const onAscendingSort = async (col) => {
  resetSort()
  col.isSorted.descending = false
  col.isSorted.ascending = true
  await tableRef.value.requestServerInteraction()
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

const clearFilter = async (columnLabel) => {
  filters.value.filter(filter => filter.label === columnLabel)[0].filter = null
  await applyFilters()
}

const applyFilters = async () => {
  await tableRef.value.requestServerInteraction()
}

const clearAllFilters = async () => {
  filters.value.forEach(filter => filter.filter = null)
  await applyFilters()
}

const setStringFilter = (value, columnLabel) => {
  filters.value.find(filter => filter.label === columnLabel).filter = value
}

const addNumericFilter = (numericFilter, column) => {
  numericFilters.value[column] = numericFilter
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
    name: key.label,
    format: val => val === -1 || val === undefined ? 'N/A' : `${val}`,
    label: key.label,
    field: key.label,
    type: key.type,
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
  if (filters.value.length > 0 || numericFilters.value.length > 0) {
    return filters.value
  } else {
    let result = columns.value.map(async column => {
      let minmax = await getMinMax(column.label);
      return {
        label: column.label,
        type: column.type === 'string' ? 'string' : 'number',
        min: minmax.min ? minmax.min : 0,
        max: minmax.max ? minmax.max : Number.MAX_SAFE_INTEGER,
        filter: null
      }
    })
    return await Promise.all(result)
  }
}

</script>



