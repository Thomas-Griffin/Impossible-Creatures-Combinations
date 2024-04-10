<template>
  <DataTable
      v-model:filters="filters"
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
      paginator
      removable-sort
      reorderable-columns
      resizable-columns
      row-hover
      scrollable
      show-gridlines
      v-model:selection="selectedCombinations"
      table-style="height: calc(100vh - 200px)"
      sortMode="multiple"
      @update:rows="(value:number) => pagination.perPage = value"
  >
    <template #header>
      <MultiSelect
          id="columns-select"
          :modelValue="selectedColumns"
          :options="columns"
          optionLabel="label"
          placeholder="Select Columns"
          filter-placeholder="Search Columns"
          style="max-width: 10%;"
          @update:modelValue="onColumnToggle"
          filter
          :selected-items-label="'Columns'"
      >
        <template #value>
          <span>Columns</span>
        </template>
      </MultiSelect>

      <span class="m-4" v-if="selectedCombinations.length > 1">
        {{selectedCombinations.length}} combinations selected
      </span>
      <span class="m-4" v-else-if="selectedCombinations.length === 1">
        {{selectedCombinations.length}} combination selected
      </span>

    </template>

    <template #loading>
      <Card class="flex justify-content-center align-items-center">
        <template #header>
          <ProgressSpinner class="mt-4" style="width: 50px; height: 50px" strokeWidth="8" fill="var(--surface-ground)"
                           animationDuration=".5s"/>
        </template>
        <template #content>
          Loading combination data. Please wait.
        </template>
      </Card>
    </template>

    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
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
import type {DataTableFilterMeta} from "primevue/datatable";
import type CombinationTableColumn from "~/types/CombinationTableColumn";
import {useCombinations} from "~/composables/useCombinations";

const {getCombinations, getTotalCombinations} = useCombinations()
const modStore = useModStore();

const loading = ref<boolean>(false);
const columns = ref<CombinationTableColumn[]>([])

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