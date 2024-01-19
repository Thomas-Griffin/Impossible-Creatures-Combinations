<template>
  <q-table
    ref="tableRef"
    :columns="shownTableColumns"
    :fullscreen="fullscreen"
    :grid="tableControls.gridModeActive"
    :hide-header="tableControls.gridModeActive"
    :loading="loading"
    :pagination="pagination"
    :rows="rows"
    :separator="separator"
    class="sticky-header-table standard-font text-weight-bolder"
    dense
    flat
    hide-bottom
    row-key="_id"
    table-header-class="cursive-font"
    @request="onTableRequest"
  >
    <template #loading>
      <q-inner-loading :showing="loading">
        <q-spinner-gears size="100px" />
      </q-inner-loading>
    </template>
    <template #top>
      <div class="row flex inline full-width justify-center">
        <ActiveFiltersDisplay />
      </div>
    </template>
    <template #item="props: QTableGridModeItemProps">
      <GridModeTableRow :content="props" />
    </template>
    <template #body-cell-Abilities="props">
      <AbilitiesDisplay :abilities="props.row.Abilities" />
    </template>
    <template #body-cell-researchLevel="props">
      <div v-if="props.row['Research Level'] === 1">
        <img
          alt="Research Level 1"
          src="/icons/research-level-1.svg"
        />
      </div>
      <div v-else-if="props.row['Research Level'] === 2">
        <img
          alt="Research Level 2"
          src="/icons/research-level-2.svg"
        />
      </div>
      <div v-else-if="props.row['Research Level'] === 3">
        <img
          alt="Research Level 3"
          src="/icons/research-level-3.svg"
        />
      </div>
      <div v-else-if="props.row['Research Level'] === 4">
        <img
          alt="Research Level 4"
          src="/icons/research-level-4.svg"
        />
      </div>
      <div v-else-if="props.row['Research Level'] === 5">
        <img
          alt="Research Level 5"
          src="/icons/research-level-5.svg"
        />
      </div>
    </template>
    <template #bottom-row>
      <q-page-sticky
        v-if="fullscreen"
        :offset="[10, 10]"
        position="bottom-right"
      >
        <table-display-controls />
      </q-page-sticky>
    </template>
  </q-table>
</template>

<script lang="ts" setup>
import {computed, onBeforeMount, onMounted, ref, watch} from 'vue';
import {useCombinations} from 'src/composables/useCombinations';
import {useModStore} from 'src/stores/modStore';
import {useCombinationTableControlsStore} from 'src/stores/combinationTableControlsStore';
import {QTable} from 'quasar';
import CombinationTableColumn from 'src/types/CombinationTableColumn';
import Combination from 'src/types/Combination';
import {GetCombinationsRequestBody} from '../../types/getCombinationsRequestBody';
import GridModeTableRow from './GridModeTableRow.vue';
import AbilitiesDisplay from './AbilitiesDisplay.vue';
import QTableGridModeItemProps from '../../types/QTableGridModeItemProps';
import CombinationAttributeName from '../../types/CombinationAttributeName';
import ActiveFiltersDisplay from './ActiveFiltersDisplay.vue';
import TableDisplayControls from './TableDisplayControls.vue';

const modStore = useModStore();
const tableControls = useCombinationTableControlsStore();

const {getCombinations, getTotalCombinations} = useCombinations();

const tableRef = ref<QTable>();
const loading = ref<boolean>(true);

onBeforeMount(async () => {
  await tableControls.getInitialTableColumns();
});

onMounted(async () => {
  tableControls.setTableRef(tableRef.value as QTable);
  tableRef?.value?.requestServerInteraction();
});

const rows = computed(() => {
  return tableControls.getTableRows;
});

const shownTableColumns = computed(() => {
  return tableControls.getTableColumns?.filter(column => column.shown);
});

const pagination = computed(() => {
  return tableControls.getPagination;
});

const fullscreen = computed(() => {
  return tableControls.getFullscreen;
});

const onTableRequest = async () => {
  loading.value = true;
  const sorting = prepareSorting();
  let combinationsRequestBody: GetCombinationsRequestBody = {
    mod: modStore.getMod,
    sorting: sorting,
    filters: filters.value || [],
    perPage: tableControls.getPagination.rowsPerPage ?? 100,
    page: tableControls.getPagination.page ?? 1
  };

  const combinations: Combination[] = await getCombinations(combinationsRequestBody);
  tableControls.setTableRows(combinations);
  await updateTotalCombinations(combinationsRequestBody);

  loading.value = false;
};

const filters = computed(() => {
  return tableControls.getTableColumns?.filter((column: CombinationTableColumn) => column?.filter !== undefined);
});

const prepareSorting = (): {
  column: CombinationAttributeName;
  order: 'ascending' | 'descending';
} => {
  let tableColumnSorting = {
    column: 'Animal 1' as CombinationAttributeName,
    order: 'ascending' as 'ascending' | 'descending'
  };
  let sortedColumn = tableControls.getTableColumns?.find(column => column?.isSorted.ascending || column?.isSorted.descending);
  if (sortedColumn) {
    tableColumnSorting = {
      column: sortedColumn.name,
      order: sortedColumn.isSorted.ascending ? 'ascending' : 'descending'
    };
  }
  return tableColumnSorting;
};

const updateTotalCombinations = async (totalCombinationsRequestBody: GetCombinationsRequestBody) => {
  const totalCombinations = await getTotalCombinations(totalCombinationsRequestBody);
  tableControls.setTotalCombinations(totalCombinations);
  tableControls.setPagination({
    ...tableControls.getPagination,
    rowsNumber: totalCombinations
  });
};

watch(
  () => modStore.mod,
  async () => {
    tableRef?.value?.requestServerInteraction();
  }
);

const separator = computed((): 'horizontal' | 'vertical' | 'cell' | 'none' | undefined => {
  return tableControls.showGrid ? 'cell' : 'none';
});
</script>

<style lang="sass">
.q-table th
  white-space: normal !important

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

  .q-table__top
    padding: 0 !important
    justify-content: center
</style>
