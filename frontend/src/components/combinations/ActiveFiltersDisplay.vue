<template>
  <div class="row">
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
    <div
      v-if="filtersAreActive"
      class="cursive-font"
    >
      Active Filters:
      <q-chip
        v-for="filter in activeFilters"
        :key="filter.label"
        :label="getFilterLabel(filter)"
        class="standard-font"
        clickable
        color="accent"
        icon="close"
        @click="() => clearFilter(filter.label)"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import {computed} from 'vue';
import CombinationTableColumn from '../../types/CombinationTableColumn';

import {useCombinationTableControlsStore} from '../../stores/combinationTableControlsStore';

const tableControls = useCombinationTableControlsStore();
const clearAllFilters = () => {
  tableControls.getTableColumns.forEach((column: CombinationTableColumn) => clearFilter(column.label));
};

const clearFilter = (columnName: string) => {
  const column = tableControls.getTableColumns?.find(column => column.label === columnName);
  if (!column) {
    return;
  }
  column.filter = undefined;
  tableControls.setTableColumns(
    tableControls.getTableColumns?.map((column: CombinationTableColumn) => {
      if (column.label === columnName) {
        return {...column, filter: undefined} as CombinationTableColumn;
      }
      return column;
    })
  );
};

const filtersAreActive = computed((): boolean => {
  return tableControls.getTableColumns?.some((column: CombinationTableColumn) => {
    return column.filter !== undefined;
  });
});

const activeFilters = computed((): CombinationTableColumn[] => {
  return tableControls.getTableColumns?.filter((column: CombinationTableColumn) => {
    return column.filter !== undefined;
  });
});

const getFilterLabel = (column: CombinationTableColumn): string => {
  if (column.filter === undefined) {
    return '';
  }
  if (column.type === 'number' && column.filter.min !== undefined && column.filter.max !== undefined) {
    return `${column.label}: Min: ${column.filter.min} Max: ${column.filter.max}`;
  }
  if (column.type === 'string' && column.filter.text !== undefined) {
    return `${column.label}: ${column.filter.text} `;
  }
  if (column.type === 'array' && column.filter?.labels && column?.filter.labels?.length > 0) {
    return `${column.label}: ${column.filter.labels?.join(', ')}`;
  }
  return '';
};
</script>
