<template>
  <DataTable
      v-model:filters="filters"
      :loading="loading"
      :rows="pagination.perPage"
      :rowsPerPageOptions="pagination.rowsPerPageOptions"
      :value="combinations"
      columnResizeMode="fit"
      filter-display="menu"
      paginator
      removable-sort
      reorderable-columns
      resizable-columns
      scroll-height="70vh"
      scrollable
      sortMode="multiple"
      @update:rows="(value:number) => pagination.perPage = value"
  >
    <template #header>
      <MultiSelect
          :modelValue="selectedColumns"
          :options="columns"
          optionLabel="label"
          placeholder="Select Columns"
          style="max-width: 100%;"
          @update:modelValue="onColumnToggle"
      />
    </template>

    <Column
        v-for="col of selectedColumns"
        :key="col.label"
        :field="col.label"
        :header="col.label"
        :sortable="true"
    >
    </Column>
  </DataTable>
</template>

<script lang="ts" setup>
import {useModStore} from '~/store/modStore';
import type {ModColumn} from "~/types/ModColumn";
import {useCombinations} from "~/composables/useCombinations";
import type Combination from "~/types/Combination";
import type GetCombinationsRequestBody from "~/types/getCombinationsRequestBody";
import type {CombinationAttributeName} from "~/types/CombinationAttributeName";
import type CombinationTableColumn from "~/types/CombinationTableColumn";

const {getCombinations} = useCombinations();
const modStore = useModStore();

const loading = ref<boolean>(false);
const columns = ref<ModColumn[]>([])
const filters = ref<CombinationTableColumn[]>([])
const selectedColumns = ref<ModColumn[]>([])
const combinations = ref<Combination[]>([])

const pagination = ref({
  page: 1,
  perPage: 10,
  rowsPerPageOptions: [1, 10, 50, 100]
});

const sorting = ref<{ column: CombinationAttributeName, order: 'ascending' | 'descending' }>({
  column: 'Animal 1',
  order: 'ascending'
});

onBeforeMount(async () => {
  await modStore.init();
  columns.value = modStore.getMod.columns || [];
  selectedColumns.value = columns.value
  await tableRequest();
});

const tableRequest = async () => {
  console.log('tableRequest')
  loading.value = true;
  let combinationsRequestBody: GetCombinationsRequestBody = {
    mod: modStore.getMod,
    sorting: sorting.value,
    filters: filters.value,
    perPage: pagination.value.perPage,
    page: pagination.value.page
  }
  combinations.value = await getCombinations(combinationsRequestBody);
  loading.value = false;
}

const onColumnToggle = (modColumns: ModColumn[]) => {
  selectedColumns.value = modColumns;
};

watch([modStore.getMod, filters, pagination, sorting], async () => {
  console.log('watch')
  await tableRequest();
}, {deep: true});

</script>