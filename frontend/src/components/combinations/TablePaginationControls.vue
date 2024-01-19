<template>
  <q-item class="row inline justify-center">
    <q-select
      :model-value="pagination.rowsPerPage"
      :options="tableControls.getRowsPerPageOptions"
      borderless
      flat
      label="Per Page"
      options-selected-class="text-blue"
      rounded
      style="min-width: 100px"
      @update:model-value="value => updateRowsPerPage(value)"
    />
    <q-pagination
      v-model="pagination.page"
      :max="pagination.rowsNumber / pagination.rowsPerPage"
      class="standard-font items-center content-center"
      color="accent"
      flat
      input
      @update:model-value="value => updatePage(value)"
    />
    <q-item class="standard-font items-center">
      {{ currentRowRange }} of
      {{ totalCombinations }}
    </q-item>
    <q-item
      v-if="selectedCombinations.length > 0"
      class="standard-font items-center"
      >Selected:
      {{ selectedCombinations.length }}
    </q-item>
  </q-item>
</template>

<script lang="ts" setup>
import {useCombinationTableControlsStore} from '../../stores/combinationTableControlsStore';
import QTablePagination from '../../types/QTablePagination';
import Combination from '../../types/Combination';
import {computed} from 'vue';

const tableControls = useCombinationTableControlsStore();

const pagination = computed<QTablePagination>(() => tableControls.getPagination);
const tableRows = computed<Combination[]>(() => tableControls.getTableRows);
const totalCombinations = computed<number>(() => tableControls.getTotalCombinations);
const selectedCombinations = computed<Combination[]>(() => tableControls.getSelectedCombinations);

const currentRowRange = computed<string>(() => {
  return (pagination.value.page - 1) * pagination.value.rowsPerPage + 1 + ' - ' + tableRows.value.length * pagination.value.page;
});

const updatePage = (page: number) => {
  pagination.value.page = page;
  tableControls.setPagination(pagination.value);
  tableControls.getTableRef.requestServerInteraction();
};

const updateRowsPerPage = (rowsPerPage: number) => {
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.page = 1;
  tableControls.setPagination(pagination.value);
  tableControls.getTableRef?.requestServerInteraction();
};
</script>
