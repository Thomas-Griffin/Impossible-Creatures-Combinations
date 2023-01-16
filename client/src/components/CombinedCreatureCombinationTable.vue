<template>
  <div class="full-height full-width">
    <q-table
      v-if="loaded"
      :columns="selectedColumns"
      :loading="!loaded"
      :pagination="pagination"
      :rows="filteredRows"
      :rows-per-page-options="[0, 10, 20, 50, 100]"
      :virtual-scroll-item-size="24"
      :virtual-scroll-sticky-size-start="48"
      class="sticky-header-table"
      column-sort-order="da"
      dense
      flat
      separator="cell"
      style="height: 1000px; font-family: monospace; font-weight: bold"
      table-header-class="cursive-font"
      virtual-scroll
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
                <numeric-filter v-else :ref="nf => addNumericFilter(nf, col.label)" :label="col.label"
                                :max="filters.find(f => f?.label === col.label && f?.type === 'number')?.max"
                                :min="filters.find(f => f?.label === col.label && f?.type === 'number')?.min"/>
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
      <template v-if="loaded" v-slot:top>
        <q-select :model-value="mod" :options="mods" class="cursive-font" label="Mod" label-color="grey"
                  @update:model-value="setMod"/>
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
import {computed, reactive, ref} from 'vue';
// import {useQuasar} from 'quasar';
import NumericFilter from 'components/NumericFilter.vue';

// const $q = useQuasar()


let rows = []
const filteredRows = ref([])
const columns = ref([])
const selectedColumns = ref([])
const showAllColumns = ref(true)
const loaded = ref(false)
const modsList = ['Vanilla', 'Tellurian']
const mods = ref(modsList)
const mod = ref('Tellurian')
const filters = ref([])
const numericFilters = reactive({})

const onModChange = (val) => {
  loaded.value = false
  import(`src/mods/${val}/transformed/combinations.json`).then(module => {
    rows = module.default
    filteredRows.value = module.default
    let keyNames = [...new Set(rows.map(item => Object.keys(item)).flat())]
    columns.value = keyNames.map(key => ({
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
    selectedColumns.value = columns.value
    filters.value =
      columns.value.map(column => ({
        label: column.label,
        type: typeof rows[0][column.field] === 'string' ? 'string' : 'number',
        min: arrayMin([...rows.map(row => row[column.field])]),
        max: arrayMax([...rows.map(row => row[column.field])]),
        filter: null
      }))
  })
  loaded.value = true
}

const setMod = (val) => {
  mods.value = modsList.filter(mod => mod !== val)
  mod.value = val
  onModChange(mod.value)
}

const pagination = ref({
  rowsPerPage: 0
})

function arrayMin(arr) {
  return arr.reduce(function (p, v) {
    return (p < v ? p : v);
  });
}

function arrayMax(arr) {
  return arr.reduce(function (p, v) {
    return (p > v ? p : v);
  });
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
  if (col.isSorted.ascending) {
    return 'green'
  } else {
    return 'white'
  }
}

const getDescendingSortColor = (col) => {
  if (col.isSorted.descending) {
    return 'green'
  } else {
    return 'white'
  }
}

const clearFilter = (columnLabel) => {
  filters[columnLabel].filter = null
}

const applyFilter = (columnLabel) => {
  console.log(JSON.stringify(numericFilters))
  if (filters.value.find(f => f.label === columnLabel)?.type === 'number') {
    let filter = numericFilters[columnLabel]?.getValues()
    console.log(JSON.stringify(filter))
    filters.value.find(f => f.label === columnLabel).filter = filter
    filteredRows.value = filteredRows.value.filter(row => row[columnLabel] >= filter.lower && row[columnLabel] <= filter.upper)
  } else {
    let filter = filters.value.find(f => f.label === columnLabel).filter
    filters.value.filter(f => f.label === columnLabel)[0].filter = filter
    filteredRows.value = filteredRows.value.filter(row => row[columnLabel].toLowerCase().includes(filter.toLowerCase()))
  }
  filters.value.find(f => f?.label === columnLabel).filter = filter
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

setMod('Tellurian')

</script>



