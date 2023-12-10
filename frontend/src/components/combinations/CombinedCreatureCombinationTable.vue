<template>
  <q-table
    ref="tableRef"
    v-model:pagination="pagination"
    v-model:selected="selectedRows"
    :columns="Object.values(shownTableColumns)"
    :grid="gridMode"
    :hide-header="gridMode"
    :loading="loading"
    :rows="tableRows"
    :rows-per-page-options="[100, 50, 20, 10, 5, 1]"
    :separator="separator"
    class="sticky-header-table"
    dense
    flat
    row-key="_id"
    selection="multiple"
    style="height: 1000px; font-family: monospace; font-weight: bold"
    table-header-class="cursive-font"
    @request="(props: QTableProps) => onTableRequest(props)"
  >
    <template v-slot:top>
      <div class="q-pr-sm">
        <q-btn :icon="gridMode ? 'list' : 'grid_on'" class="cursive-font" dense flat @click="gridMode = !gridMode" />
      </div>
      <q-btn-dropdown class="cursive-font" flat label="Sort / Filter">
        <q-item>
          <q-item-section avatar>
            <q-checkbox :model-value="allColumnsAreShown" @update:model-value="toggleShowAllColumns" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="cursive-font"> Show All</q-item-label>
          </q-item-section>
        </q-item>

        <q-item-section>
          <q-input
            v-model="filterFilterString"
            clear-icon="close"
            clearable
            dense
            label="Find Filter"
            outlined
            rounded
            @clear="filterFiltersList('')"
            @update:model-value="value => filterFiltersList(value)"
          />
        </q-item-section>
        <div v-if="Object.values(shownColumnFilters).length > 0">
          <div v-for="(column, label) in tableColumns" :key="label">
            <q-item v-if="shownColumnFilters[label]">
              <q-checkbox :model-value="column.shown" @click="toggleColumn(column.label)" />
              <span class="cursive-font">
                <q-btn
                  :text-color="getAscendingSortColor(column)"
                  dense
                  flat
                  icon="arrow_upward"
                  round
                  size="sm"
                  @click="onAscendingSort(column)"
                />
                <q-btn
                  :text-color="getDescendingSortColor(column)"
                  dense
                  flat
                  icon="arrow_downward"
                  round
                  size="sm"
                  @click="onDescendingSort(column)"
                />

                <q-btn-dropdown
                  :label="column.label"
                  align="center"
                  dense
                  dropdown-icon="none"
                  flat
                  icon="search"
                  no-icon-animation
                  rounded
                >
                  <q-item>
                    <q-item-section
                      v-if="Object.values(columnFilters).find(f => f?.label === column.label && f?.type === 'string')"
                      class="row fit items-center"
                    >
                      <q-input
                        dense
                        flat
                        label="Filter"
                        model-value=""
                        rounded
                        @update:model-value="value => setStringFilter(value, column.label)"
                      />
                      <q-btn dense flat label="Apply" @click="applyTextFilters" />
                    </q-item-section>
                    <q-item-section v-else-if="column.label === 'Abilities'">
                      <q-select
                        v-model="selectedAbilities"
                        :options="abilities"
                        dense
                        flat
                        label="Ability Filter"
                        multiple
                        options-selected-class="text-blue"
                        rounded
                        @update:model-value="setAbilitiesFilter"
                      />
                    </q-item-section>
                    <suspense v-else>
                      <q-item-section class="row fit items-center">
                        <numeric-filter
                          :ref="(nf: NumericFilterInterface) => addNumericFilter(nf, column.label)"
                          :label="column.label"
                          :max="columnFilters[column.label]?.max"
                          :min="columnFilters[column.label]?.min"
                        />
                        <q-btn dense flat label="Apply" @click="applyNumericFilters" />
                      </q-item-section>
                    </suspense>
                  </q-item>
                </q-btn-dropdown>
              </span>
            </q-item>
          </div>
        </div>
      </q-btn-dropdown>
      <q-btn
        v-if="filtersAreActive"
        class="cursive-font"
        color="red"
        dense
        flat
        icon="clear"
        label="Clear Filters"
        @click="clearAllFilters"
      />
      <div v-if="filtersAreActive" class="cursive-font" style="margin-left: 5%">
        Active Filters:
        <q-chip
          v-for="filter in activeFilters"
          :key="filter.label"
          :label="getFilterLabel(filter)"
          class="mono-font"
          clickable
          color="info"
          icon="close"
          @click="() => clearFilter(filter.label)"
        />
      </div>

      <q-space />
    </template>
    <template #item="props">
      <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
        <q-card bordered flat>
          <q-card-section class="text-left cursive-font text-h6">
            <q-checkbox v-model="props.selected" :label="props.row.name" dense />
            Combination {{ props.rowIndex + 1 }}
          </q-card-section>
          <q-separator />
          <q-card-section>
            <table>
              <tr v-for="tableColumn in Object.values(tableColumns)" :key="tableColumn.name">
                <td v-if="columnIsShown(tableColumn.name)" class="cursive-font q-pa-sm">
                  {{ tableColumn.name }}
                </td>
                <td
                  v-if="tableColumn.name in shownTableColumns && tableColumn.name === 'Abilities'"
                  style="height: 100px !important"
                >
                  <p v-for="ability in props.row[tableColumn.name]" :key="ability" class="no-margin">
                    {{ ability.ability }}: {{ ability.source }}
                  </p>
                </td>
                <td v-else-if="tableColumn.name in shownTableColumns">
                  {{ props.row[tableColumn.name] === -1 ? ' (N/A)' : props.row[tableColumn.name] }}
                </td>
              </tr>
            </table>
          </q-card-section>
        </q-card>
      </div>
    </template>

    <template #body-cell-Abilities="props">
      <td style="width: 1000px">
        <span
          v-text="
            props.row.Abilities.map(
              (a: Ability) => `${a?.ability === undefined ? '' : a.ability}: ${a?.source === undefined ? '' : a.source}`
            ).join(', ')
          "
        />
      </td>
    </template>
  </q-table>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useCombinations } from 'src/composables/useCombinations'
import NumericFilter from 'components/combinations/NumericFilter.vue'
import { useModStore } from 'src/stores/modStore'
import { QTable, QTableProps } from 'quasar'
import CombinationTableFilter from 'src/types/CombinationTableFilter'
import CombinationTableColumn from 'src/types/CombinationTableColumn'
import { NumericFilterDataStructure } from 'src/types/NumericFilterDataStructure'
import FilterDataStructure from 'src/types/FilterDataStructure'
import ColumnDataStructure from 'src/types/ColumnDataStructure'
import QTablePagination from 'src/types/QTablePagination'
import Ability from 'src/types/Ability'
import Combination from 'src/types/Combination'
import NumericFilterInterface from 'src/types/NumericFilter'
import { GetTotalCombinationsRequestBody } from '../../types/getTotalCombinationsRequestBody'

const modStore = useModStore()

const { getCombinations, getTotalCombinations, getMinMax, getAbilities } = useCombinations()

const tableRef = ref<QTable | null>()
const tableRows = ref([])
const tableColumns = ref<ColumnDataStructure>({})

const shownTableColumns = computed(() => {
  let shownColumns: ColumnDataStructure = {}
  Object.values(tableColumns.value).forEach(column => {
    if (column.shown) {
      shownColumns[column.name] = column
    }
  })
  return shownColumns
})

const columnFilters = ref<FilterDataStructure>({})
const activeFilters = ref<FilterDataStructure>({})

const shownColumnFilters = computed(() => {
  let shownFilters: FilterDataStructure = {}
  Object.values(columnFilters.value).forEach(filter => {
    if (filter.shown) {
      shownFilters[filter.label] = filter
    }
  })
  return shownFilters
})

const numericColumnFilters = ref<NumericFilterDataStructure>({})

const selectedRows = ref<Array<Combination>>([])
const abilities = ref<Array<Ability>>([])
const selectedAbilities = ref<Array<Ability>>([])

const filterFilterString = ref<string | number | null>('')

const showAllColumns = ref<boolean>(true)
const loading = ref<boolean>(true)
const showGrid = ref<boolean>(true)
const gridMode = ref<boolean>(true)

const pagination = ref<QTablePagination>({
  page: 1,
  rowsPerPage: 100,
  rowsNumber: 0
})

const columnIsShown = (columnName: string) => {
  return tableColumns.value[columnName].shown
}

const allColumnsAreShown = computed(() => {
  return Object.values(tableColumns.value).every(column => column.shown)
})

onMounted(async () => {
  columnFilters.value = {}
  pagination.value.page = 1
  tableColumns.value = getColumns()
  abilities.value = await getAbilities(modStore.getMod)
  if (tableRef.value) {
    tableRef.value.requestServerInteraction()
  }
})

const onTableRequest = async (tableProps: QTableProps) => {
  loading.value = true
  for (let numericFiltersKey in Object.keys(numericColumnFilters.value)) {
    let numericFilter = numericColumnFilters.value[numericFiltersKey]
    if (numericFilter?.getValues().min !== undefined && numericFilter?.getValues().max !== undefined) {
      columnFilters.value[numericFiltersKey].min = numericFilter.getValues().min ?? null
      columnFilters.value[numericFiltersKey].max = numericFilter.getValues().max ?? null
    }
  }
  let tableColumnSorting = undefined
  let sortedColumn = Object.values(tableColumns.value).find(
    column => column?.isSorted.ascending || column?.isSorted.descending
  )
  if (sortedColumn) {
    tableColumnSorting = {
      column: sortedColumn.name,
      order: sortedColumn.isSorted.ascending ? 'ascending' : 'descending'
    }
  }
  let totalCombinationsRequestBody: GetTotalCombinationsRequestBody = {
    mod: modStore.getMod,
    sorting: tableColumnSorting ?? { column: 'Animal 1', order: 'ascending' },
    filters: activeFilters.value
  }
  tableRows.value = await getCombinations(
    tableProps.pagination?.page ?? 1,
    tableProps.pagination?.rowsPerPage ?? 100,
    totalCombinationsRequestBody
  )
  let totalCombinations = await getTotalCombinations(totalCombinationsRequestBody)
  if (tableProps.pagination?.rowsNumber) {
    tableProps.pagination.rowsNumber = totalCombinations
  }
  pagination.value.rowsNumber = totalCombinations
  columnFilters.value = await getFilters()

  if (tableProps?.pagination?.page && tableProps?.pagination?.rowsPerPage) {
    pagination.value.page = tableProps.pagination.page
    pagination.value.rowsPerPage = tableProps.pagination.rowsPerPage
  }
  loading.value = false
}

watch(
  () => modStore.mod,
  async () => {
    if (tableRef.value) {
      tableRef.value.requestServerInteraction()
    }
  }
)

const resetSort = () => {
  Object.values(tableColumns.value).forEach(col => {
    col.isSorted.ascending = false
    col.isSorted.descending = false
  })
}

const onDescendingSort = async (tableColumn: CombinationTableColumn) => {
  resetSort()
  tableColumn.isSorted.descending = true
  tableColumn.isSorted.ascending = false
  if (tableRef.value) {
    tableRef.value.requestServerInteraction()
  }
}

const onAscendingSort = async (tableColumn: CombinationTableColumn) => {
  resetSort()
  tableColumn.isSorted.descending = false
  tableColumn.isSorted.ascending = true
  if (tableRef.value) {
    tableRef.value.requestServerInteraction()
  }
}

const toggleColumn = (columnName: string) => {
  tableColumns.value[columnName].shown = !tableColumns.value[columnName].shown
}

const toggleShowAllColumns = () => {
  if (allColumnsAreShown.value) {
    showAllColumns.value = !showAllColumns.value
    if (showAllColumns.value) {
      Object.values(tableColumns.value).forEach(column => {
        column.shown = true
      })
    } else {
      Object.values(tableColumns.value).forEach(column => {
        column.shown = false
      })
    }
  } else {
    showAllColumns.value = true
    Object.values(tableColumns.value).forEach(column => {
      column.shown = true
    })
  }
}

const getAscendingSortColor = (column: CombinationTableColumn) => {
  return column.isSorted.ascending ? 'green' : 'primary'
}

const getDescendingSortColor = (column: CombinationTableColumn) => {
  return column.isSorted.descending ? 'green' : 'primary'
}

const clearFilter = async (columnLabel: string) => {
  columnFilters.value[columnLabel].value = {
    text: '',
    labels: [],
    min: undefined,
    max: undefined
  }
  await applyNumericFilters()
}

const applyTextFilters = async () => {
  if (tableRef.value) {
    tableRef.value.requestServerInteraction()
  }
}

const applyNumericFilters = async () => {
  if (tableRef.value) {
    tableRef.value.requestServerInteraction()
  }
}

const clearAllFilters = async () => {
  Object.values(columnFilters.value).forEach(filter => {
    filter.value.text = ''
    filter.value.labels = []
    filter.value.min = undefined
    filter.value.max = undefined
  })
  await applyNumericFilters()
}

const setStringFilter = (value: string | number | null, columnLabel: string) => {
  if (typeof value !== 'string') {
    return
  }
  columnFilters.value[columnLabel].value.text = value
}

const addNumericFilter = (numericFilter: NumericFilterInterface, column: string) => {
  numericColumnFilters.value[column] = numericFilter
  return column
}

const filtersAreActive = computed((): boolean => {
  return Object.entries(activeFilters.value).length !== 0
})

const separator = computed((): 'horizontal' | 'vertical' | 'cell' | 'none' | undefined => {
  return showGrid.value ? 'cell' : 'none'
})

const getColumns = (): { [key: string]: CombinationTableColumn } => {
  let columns: { [key: string]: CombinationTableColumn } = {}
  modStore.getMod.columns.forEach((column: { label: string; type: string }) => {
    columns[column.label] = {
      name: column.label,
      format: val => (val === -1 || val === undefined ? 'N/A' : `${val}`),
      label: column.label,
      field: column.label,
      type: column.type,
      sortable: false,
      isSorted: {
        ascending: false,
        descending: false
      },
      align: 'center',
      shown: true
    }
  })
  return columns
}

const getFilters = async (): Promise<{ [key: string]: CombinationTableFilter }> => {
  let filters: { [key: string]: CombinationTableFilter } = {}
  if (Object.entries(columnFilters.value).length > 0 || Object.entries(numericColumnFilters.value).length > 0) {
    return columnFilters.value
  } else {
    let filterObjects = Object.values(tableColumns.value).map(async column => {
      let minmax = await getMinMax(modStore.getMod, column.label)
      let type
      type = column?.type === 'string' ? 'string' : column.type === 'array' ? 'array' : 'number'
      return {
        label: column?.label,
        type: type,
        min: minmax.min ? minmax.min : 0,
        max: minmax.max ? minmax.max : Number.MAX_SAFE_INTEGER,
        value: {
          text: '',
          labels: []
        },
        shown: true
      }
    })
    let resolvedFilters = await Promise.all(filterObjects)
    resolvedFilters.forEach(filter => {
      filters[filter.label] = filter
    })
    return filters
  }
}

const setAbilitiesFilter = () => {
  columnFilters.value['Abilities'].value.labels = selectedAbilities.value.map(ability => ability.ability)
  tableRef.value?.requestServerInteraction()
}

const filterFiltersList = (value: string | number | null) => {
  if (typeof value !== 'string') {
    return
  }

  Object.keys(columnFilters.value).forEach(key => {
    columnFilters.value[key].shown = false
  })

  filterFilterString.value = value
  if (filterFilterString.value === '') {
    Object.keys(columnFilters.value).forEach(key => {
      columnFilters.value[key].shown = true
    })
    return
  }
  Object.keys(columnFilters.value).forEach(key => {
    if (key.toLowerCase().includes(value.toLowerCase())) {
      columnFilters.value[key].shown = true
    }
  })
}
const getFilterLabel = (filter: CombinationTableFilter) => {
  return filter?.min && filter?.max
    ? `${filter.label}: Min: ${filter?.min}, Max: ${filter?.max}`
    : filter.type === 'array'
      ? `${filter?.label}: ${filter?.value.labels?.join(', ')}`
      : `${filter?.label}: ${filter?.value.text}`
}
</script>

<style lang="sass">
.sticky-header-table
  height: calc(100vh - 50px) !important

  thead tr:first-child th
    background-color: var(--q-primary)

  thead tr th
    position: sticky
    z-index: 1

  thead tr:first-child th
    top: 0

  &.q-table--loading thead tr:last-child th
    top: 48px
</style>
