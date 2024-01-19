<template>
  <q-btn-dropdown
    class="cursive-font"
    flat
    icon="filter_list"
  >
    <ShowAllColumnsToggle />
    <q-item-section>
      <FilterSearchInput />
    </q-item-section>
    <div
      v-for="column in columns"
      :key="column.label"
    >
      <q-item>
        <q-checkbox
          :model-value="column.shown"
          @click="toggleColumn(column.label)"
        />
        <ColumnSortingControls :column="column" />
        <TextualFilter
          v-if="column.type === 'string'"
          :column="column"
        />
        <AbilitiesFilter
          v-if="column.label === 'Abilities'"
          :column="column"
        />
        <NumericFilter
          v-if="column.type === 'number'"
          :column="column"
        />
      </q-item>
    </div>
  </q-btn-dropdown>
</template>
<script lang="ts" setup>
import CombinationAttributeName from '../../types/CombinationAttributeName';
import {computed, ref} from 'vue';
import CombinationTableColumn from '../../types/CombinationTableColumn';
import ShowAllColumnsToggle from './ShowAllColumnsToggle.vue';
import FilterSearchInput from './FilterSearchInput.vue';
import ColumnSortingControls from './ColumnSortingControls.vue';
import TextualFilter from './TextualFilter.vue';
import AbilitiesFilter from './AbilitiesFilter.vue';
import NumericFilter from './NumericFilter.vue';
import {useCombinationTableControlsStore} from '../../stores/combinationTableControlsStore';

const tableControls = useCombinationTableControlsStore();

const showAllColumns = ref<boolean>(true);

const columns = computed(() => {
  return tableControls.getTableColumns;
});

const toggleColumn = (columnName: CombinationAttributeName) => {
  let column = tableControls.getTableColumns?.find(column => column.label === columnName);
  if (!column) {
    return;
  }
  column.shown = !column.shown;
  showAllColumns.value = allColumnsAreShown.value;
  tableControls.updateColumn(column);
};

const allColumnsAreShown = computed(() => {
  return tableControls.getTableColumns.every((column: CombinationTableColumn) => column.shown);
});
</script>
