<template>
  <q-item>
    <q-item side>
      <q-checkbox
        :model-value="allColumnsAreShown"
        @update:model-value="toggleShowAllColumns"
      />
    </q-item>
    <q-item-label class="cursive-font"> Show All</q-item-label>
  </q-item>
</template>
<script lang="ts" setup>
import {useCombinationTableControlsStore} from '../../stores/combinationTableControlsStore';

const tableControls = useCombinationTableControlsStore();

const allColumnsAreShown = () => {
  return tableControls.getTableColumns?.every(column => column.shown);
};

const toggleShowAllColumns = () => {
  tableControls.setTableColumns(
    tableControls.getTableColumns?.map(column => {
      column.shown = !allColumnsAreShown();
      return column;
    })
  );
};
</script>
