<template>
  <DataTable
      ref="table"
      v-model:filters="filters"
      v-model:selection="selectedCombinations"
      :globalFilterFields="['global']"
      :loading="loading"
      :rows="pagination.perPage"
      :rowsPerPageOptions="pagination.rowsPerPageOptions"
      :scroll-height="'calc(100vh - 200px)'"
      :total-records="pagination.totalRecords"
      :value="combinations"
      columnResizeMode="expand"
      current-page-report-template="Showing {first} to {last} of {totalRecords} combinations"
      dataKey="_id"
      filter-display="menu"
      lazy
      paginator
      removable-sort
      reorderable-columns
      resizable-columns
      row-hover
      scrollable
      show-gridlines
      sortMode="multiple"
      table-style="height: calc(100vh - 200px)"
      @page="(event:any) => pagination.page = event.page + 1"
      @sort="onSort"
      @update:rows="(value:number) => pagination.perPage = value"
  >
    <template #header>
      <MultiSelect
          id="columns-select"
          :modelValue="selectedColumns"
          :options="columns"
          :selected-items-label="'Columns'"
          filter
          filter-placeholder="Search Columns"
          optionLabel="label"
          placeholder="Select Columns"
          style="max-width: 10%;"
          @update:modelValue="onColumnToggle"
      >
        <template #value>
          <span>Columns</span>
        </template>
      </MultiSelect>

      <span v-if="selectedCombinations.length > 1" class="m-4">
        {{ selectedCombinations.length }} combinations selected
      </span>
      <span v-else-if="selectedCombinations.length === 1" class="m-4">
        {{ selectedCombinations.length }} combination selected
      </span>

      <Button v-if="selectedCombinations.length > 0" icon="pi pi-external-link" label="Export" @click="exportCSV"/>
    </template>

    <template #loading>
      <Card class="flex justify-content-center align-items-center">
        <template #header>
          <ProgressSpinner animationDuration=".5s" class="mt-4" fill="var(--surface-ground)" strokeWidth="8"
                           style="width: 50px; height: 50px"/>
        </template>
        <template #content>
          Loading combination data. Please wait.
        </template>
      </Card>
    </template>

    <Column headerStyle="width: 3rem" selectionMode="multiple"></Column>
    <Column v-for="column in selectedColumns"
            :key="column.name"
            :field="column.name"
            :header="column.label"
            :sortable="true"/>
  </DataTable>
</template>

<script lang="ts" setup>
import {useModStore} from '~/store/modStore';
import type {ModColumn} from "~/types/ModColumn";
import type Combination from "~/types/Combination";
import type GetCombinationsRequestBody from "~/types/getCombinationsRequestBody";
import type {CombinationAttributeName} from "~/types/CombinationAttributeName";
import {FilterMatchMode} from "primevue/api";
import type {DataTableExportCSVOptions, DataTableFilterMeta, DataTableSortEvent} from "primevue/datatable";
import type CombinationTableColumn from "~/types/CombinationTableColumn";
import {useCombinations} from "~/composables/useCombinations";
import type Ability from "~/types/Ability";

const {getCombinations, getTotalCombinations} = useCombinations()
const modStore = useModStore();

const loading = ref<boolean>(false);
const columns = ref<CombinationTableColumn[]>([])
const table = ref()

const initialiseColumns = () => {
  columns.value = modStore.getMod.columns?.map((column: ModColumn) => ({
    name: column.label,
    label: column.label,
    type: column.type,
    isSorted: {
      ascending: false,
      descending: false,
    },
    shown: true,
    min: column.min ?? 0,
    max: column.max ?? Number.MAX_SAFE_INTEGER,
    filter: undefined,
  })) || [];
  selectedColumns.value = columns.value;
};

const filters = ref<DataTableFilterMeta>({
  'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
  'Animal 1': {value: null, matchMode: FilterMatchMode.CONTAINS},
  'Animal 2': {value: null, matchMode: FilterMatchMode.CONTAINS},
  'Abilities.ability': {value: null, matchMode: FilterMatchMode.CONTAINS},
})

const selectedColumns = ref<CombinationTableColumn[]>(columns.value)

const combinations = ref<Combination[]>([])
const selectedCombinations = ref<Combination[]>([])

const pagination = ref({
  page: 1,
  perPage: 50,
  rowsPerPageOptions: [1, 10, 50, 100],
  totalRecords: 0
});

const sorting = ref<{ column: CombinationAttributeName, order: 'ascending' | 'descending' }>({
  column: 'Animal 1',
  order: 'ascending'
});

onMounted(async () => {
  initialiseColumns();
  await tableRequest();
});

const tableRequest = async () => {
  if (loading.value) return;
  loading.value = true;
  let combinationsRequestBody: GetCombinationsRequestBody = {
    mod: modStore.getMod,
    sorting: sorting.value,
    filters: [],
    perPage: pagination.value.perPage,
    page: pagination.value.page
  }
  pagination.value.totalRecords = await getTotalCombinations(combinationsRequestBody);
  combinations.value = await getCombinations(combinationsRequestBody);
  loading.value = false;
}

const onColumnToggle = (modColumns: CombinationTableColumn[]) => {
  selectedColumns.value = modColumns;
};

const onSort = (event: DataTableSortEvent) => {
  if (!event.multiSortMeta || event.multiSortMeta.length === 0) return;
  sorting.value = {
    column: event.multiSortMeta[0].field as CombinationAttributeName,
    order: event.multiSortMeta[0].order === 1 ? 'ascending' : 'descending'
  }
}

const transformDataForExport = (combinations: Combination[]) => {
  return combinations.map(combination => {
    let newCombination = {...combination} as any;
    if (Array.isArray(newCombination.Abilities)) {
      newCombination.Abilities = newCombination.Abilities.map((ability: Ability) => ability.ability).join(', ');
    }
    return newCombination;
  });
};

const exportCSV = () => {
  table.value.exportCSV({selectionOnly: true} as DataTableExportCSVOptions, transformDataForExport(selectedCombinations.value));
};

watch(() => modStore.getMod, async () => {
  initialiseColumns();
  await tableRequest();
});

watch([
  () => pagination.value.perPage,
  () => pagination.value.page,
  () => sorting.value,
  () => filters.value,
], async () => {
  await tableRequest()
});


</script>