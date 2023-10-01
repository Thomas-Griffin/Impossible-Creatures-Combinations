<template>
  <q-table
      ref="tableRef"
      v-model:pagination="pagination"
      v-model:selected="selectedRows"
      :columns="selectedColumns"
      :grid="gridMode"
      :hide-header="gridMode"
      :loading="loading"
      :rows="filteredRows"
      :rows-per-page-options="[100, 50, 20, 10, 5, 1]"
      :separator="separator"
      class="sticky-header-table"
      dense
      flat
      row-key="_id"
      selection="multiple"
      style="height: 1000px; font-family: monospace; font-weight: bold;"
      table-header-class="cursive-font"
      @request="onRequest"
  >
    <template v-slot:top>
      <div class="q-pr-sm">
        <q-btn :icon="gridMode?'list':'grid_on'" class="cursive-font" dense flat
               @click="gridMode = !gridMode"/>
      </div>
      <q-btn-dropdown
          class="cursive-font"
          flat
          label="Columns"
      >
        <q-item clickable @click="toggleShowAllColumns">
          <q-item-section avatar>
            <q-checkbox :model-value="showAllColumns && allColumnsAreShown"
                        @update:model-value="value => toggleShowAllColumns(value)"/>
          </q-item-section>
          <q-item-section>
            <q-item-label class="cursive-font">Show All</q-item-label>
          </q-item-section>
        </q-item>

        <q-item-section>
          <q-input clear-icon="close" clearable dense
                   label="Find Filter"
                   @update:model-value="value => filterFiltersList(value)"/>
        </q-item-section>

        <q-item v-for="col in filtersDisplayedInList" :key="col.name">
          <q-checkbox :model-value="col.show" @click="toggleColumn(col.name)"/>
          <span class="cursive-font">
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

            <q-btn-dropdown :label="col.label" align="center" dense dropdown-icon="none" flat icon="search"
                            no-icon-animation
                            rounded>

              <q-item>
                <q-item-section v-if="filters.find(f => f?.label === col.label && f?.type === 'string')"
                                class="row fit items-center">
                  <q-input dense flat label="Filter" rounded
                           @update:model-value="value => setStringFilter(value, col.label)"/>
                  <q-btn dense flat label="Apply" @click="applyTextFilters"/>
                </q-item-section>
                <q-item-section
                    v-else-if="col.label === 'Abilities'">
                  <q-select v-model="selectedAbilities" :options="abilities" dense flat label="Ability Filter"
                            multiple
                            options-selected-class="text-blue"
                            rounded
                            @update:model-value="setAbilitiesFilter"/>
                </q-item-section>
                <suspense v-else>
                  <q-item-section class="row fit items-center">
                    <numeric-filter :ref="nf => addNumericFilter(nf, col.label)" :label="col.label"
                                    :max="filters.find(f => f?.label === col.label && f?.type === 'number')?.max"
                                    :min="filters.find(f => f?.label === col.label && f?.type === 'number')?.min"/>
                    <q-btn dense flat label="Apply" @click="applyNumericFilters"/>
                  </q-item-section>
                </suspense>
              </q-item>
            </q-btn-dropdown>
            </span>
        </q-item>

      </q-btn-dropdown>
      <q-space/>
      <div v-if="filtersAreActive" class="cursive-font">
        Active Filters:
        <q-chip v-for="filter in activeFilters" :key="filter.label"
                :label="filter?.filter?.min && filter?.filter?.max ? `${filter.label}: Min: ${filter?.filter?.min}, Max: ${filter?.filter?.max}`: filter.type === 'array'? `${filter?.label}: ${filter?.filter?.join(', ')}` :`${filter?.label}: ${filter?.filter}`"
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

    </template>
    <template v-slot:item="props">
      <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
        <q-card bordered flat>
          <q-card-section class="text-left cursive-font text-h6">
            <q-checkbox v-model="props.selected" :label="props.row.name" dense/>
            Combination {{ props.rowIndex + 1 }}
          </q-card-section>
          <q-separator/>
          <q-card-section>
            <table>
              <tr v-for="col in columns" :key="col.name">
                <td v-if="col.show" class="cursive-font q-pa-sm">{{ col.name }}</td>
                <td v-if="col.show && col.name === 'Abilities'" style="height: 100px!important; ">
                  <p v-for="ability in props.row[col.name]" :key="ability" class="no-margin">
                    {{ ability.ability }}: {{ ability.source }}
                  </p>
                </td>
                <td v-else-if="col.show">{{ props.row[col.name] === -1 ? ' (N/A)' : props.row[col.name] }}</td>
              </tr>
            </table>
          </q-card-section>
        </q-card>
      </div>
    </template>

    <template v-slot:body-cell-Abilities="props">
      <td style="width: 1000px">
        <span
            v-text="props.row.Abilities.map(a => `${a?.ability === undefined?'':a.ability}: ${a?.source === undefined?'':a.source}`).join(', ')"></span>
      </td>
    </template>

    <template v-slot:top-right="scope">
      <q-btn
          v-if="scope.pagesNumber > 2"
          :disable="scope.isFirstPage"
          class="pagination-controls"
          color="grey-8"
          dense
          flat
          icon="first_page"
          round
          @click="scope.firstPage"
      />

      <q-btn
          :disable="scope.isFirstPage"
          class="pagination-controls"
          color="grey-8"
          dense
          flat
          icon="chevron_left"
          round
          @click="scope.prevPage"
      />

      <q-btn
          :disable="scope.isLastPage"
          class="pagination-controls"
          color="grey-8"
          dense
          flat
          icon="chevron_right"
          round
          @click="scope.nextPage"
      />

      <q-btn
          v-if="scope.pagesNumber > 2"
          :disable="scope.isLastPage"
          class="pagination-controls"
          color="grey-8"
          dense
          flat
          icon="last_page"
          round
          @click="scope.lastPage"
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
import {computed, onMounted, ref, watch} from 'vue';
import {useCombinations} from 'src/composables/useCombinations';
import NumericFilter from 'components/combinations/NumericFilter.vue';
import {useModStore} from 'stores/modStore';

const modStore = useModStore()

const isMobile = computed(() => {
  return window.innerWidth < 700
})

const {getCombinations, getTotalCombinations, getMinMax, getAbilities} = useCombinations();

const tableRef = ref();
const filteredRows = ref([])
const selectedColumns = ref([])
const showAllColumns = ref(true)
const loading = ref(true)
const numericFilters = ref({})
const showGrid = ref(false)
const columns = ref([])
const filters = ref([])
const pagination = ref({page: 1, rowsPerPage: isMobile.value ? 1 : 100})
const gridMode = ref(true)
const selectedRows = ref([])
const abilities = ref([])
const selectedAbilities = ref([])
let filtersDisplayedInList = ref([])


const allColumnsAreShown = computed(() => {
  return columns.value.filter(col => col?.show).length === columns.value.length
})


onMounted(async () => {
  filters.value = []
  pagination.value.page = 1
  columns.value = getColumns()
  filtersDisplayedInList.value = columns.value
  abilities.value = await getAbilities(modStore.getMod)
  selectedColumns.value = columns.value
  await tableRef.value.requestServerInteraction()
})


async function onRequest(props) {
  loading.value = true

  for (let numericFiltersKey in numericFilters.value) {
    let numericFilter = numericFilters.value[numericFiltersKey]
    if (numericFilter?.getValues().min !== null && numericFilter?.getValues().max !== null && numericFilter?.getValues().min !== undefined && numericFilter?.getValues().max !== undefined) {
      filters.value.find(filter => filter?.label === numericFiltersKey).filter = numericFilter?.getValues() ?? null
    }
  }
  let sorting = {column: columns.value[0].name, order: 'ascending'}
  let sortedColumn = columns.value.find(col => col?.isSorted.ascending || col?.isSorted.descending)
  if (sortedColumn) {
    sorting = {column: sortedColumn.name, order: sortedColumn.isSorted.ascending ? 'ascending' : 'descending'}
  }
  let postBody = {
    mod: modStore.getMod,
    sorting: sorting,
    filters: filters.value !== null ? filters.value : [],
  }
  filteredRows.value = await getCombinations(props.pagination.page, props.pagination.rowsPerPage, postBody)
  let totalCombinations = await getTotalCombinations(postBody)
  props.pagination.rowsNumber = totalCombinations
  pagination.value.rowsNumber = totalCombinations
  filters.value = await getFilters(modStore.getMod)

  const {page, rowsPerPage} = props.pagination
  pagination.value.page = page
  pagination.value.rowsPerPage = rowsPerPage

  loading.value = false
}

watch(() => modStore.mod, async () => {
  await tableRef.value.requestServerInteraction();
})


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
  columns.value.find(col => col.name === colName).show = !columns.value.find(col => col.name === colName)?.show
  selectedColumns.value = columns.value.filter(col => col?.show)
}

const toggleShowAllColumns = (value) => {
  showAllColumns.value = value
  columns.value.forEach(col => col.show = showAllColumns.value)
  selectedColumns.value = columns.value.filter(col => col?.show)
}

const getAscendingSortColor = (col) => {
  return col.isSorted.ascending ? 'green' : 'white';
}

const getDescendingSortColor = (col) => {
  return col.isSorted.descending ? 'green' : 'white';
}

const clearFilter = async (columnLabel) => {
  filters.value.filter(filter => filter?.label === columnLabel)[0].filter = null
  await applyNumericFilters()
}


const applyTextFilters = async () => {
  filters.value.forEach(filter => {
    if (filter?.filterText !== null && filter?.filterText !== undefined && filter?.filterText !== '') {
      filter.filter = filter?.filterText
    }
  })
  await tableRef.value.requestServerInteraction()
}

const applyNumericFilters = async () => {
  await tableRef.value.requestServerInteraction()
}

const clearAllFilters = async () => {
  filters.value.forEach(filter => filter.filter = null)
  await applyNumericFilters()
}

const setStringFilter = (value, columnLabel) => {
  filters.value.find(filter => filter?.label === columnLabel).filterText = value
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

const separator = computed(() => {
  return showGrid.value ? 'cell' : 'none'
})


const getColumns = () => {
  return modStore.getMod.columns.map(key => ({
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
      let minmax = await getMinMax(modStore.getMod, column.label);
      let type;
      type = column?.type === 'string' ? 'string' : column.type === 'array' ? 'array' : 'number';
      return {
        label: column?.label,
        type: type,
        min: minmax.min ? minmax.min : 0,
        max: minmax.max ? minmax.max : Number.MAX_SAFE_INTEGER,
        filter: null
      }
    })
    return await Promise.all(result)
  }
}

const setAbilitiesFilter = () => {
  filters.value.find(filter => filter?.label === 'Abilities').filter = selectedAbilities.value
  tableRef.value.requestServerInteraction()
}

const filterFiltersList = (value) => {
  filtersDisplayedInList.value = columns.value
  filtersDisplayedInList.value = filtersDisplayedInList.value.filter(filter => filter?.label.toLowerCase().includes(value.toLowerCase()))
}


</script>



