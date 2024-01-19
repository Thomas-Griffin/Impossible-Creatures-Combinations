<template>
  <q-input
    v-model="searchString"
    clear-icon="close"
    clearable
    dense
    label="Find Filter"
    outlined
    rounded
    @clear="clearSearchString"
    @update:model-value="searchFilters"
  />
</template>
<script lang="ts" setup>
import {ref} from 'vue';
import CombinationAttributeName from '../../types/CombinationAttributeName';
import CombinationTableColumn from '../../types/CombinationTableColumn';
import {useCombinationTableControlsStore} from '../../stores/combinationTableControlsStore';

const searchString = ref<string>('');
const tableControls = useCombinationTableControlsStore();

const searchFilters = (value: string | number | null) => {
  if (typeof value !== 'string') {
    return;
  }
  setColumnFiltersVisibility(() => false);
  searchString.value = value;
  if (searchString.value === '') {
    setColumnFiltersVisibility(() => true);
  } else {
    setColumnFiltersVisibility(key => key.toLowerCase().includes(value.toLowerCase()));
  }
};
const setColumnFiltersVisibility = (condition: (key: CombinationAttributeName) => boolean) => {
  if (!tableControls.getTableColumns) {
    return;
  }
  tableControls.getTableColumns?.forEach((column: CombinationTableColumn) => {
    column.shown = condition(column.label);
  });
};
const clearSearchString = () => {
  searchString.value = '';
};
</script>
