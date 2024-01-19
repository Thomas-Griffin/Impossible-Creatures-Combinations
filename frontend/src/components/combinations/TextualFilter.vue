<template>
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
      <q-item-section class="row fit items-center">
        <q-input
          v-model="filterString"
          debounce="500"
          dense
          flat
          label="Filter"
          rounded
          @update:model-value="updateColumnFilter"
        />
      </q-item-section>
    </q-item>
  </q-btn-dropdown>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import CombinationTableColumn from '../../types/CombinationTableColumn';
import {useCombinationTableControlsStore} from '../../stores/combinationTableControlsStore';

const tableControls = useCombinationTableControlsStore();

const filterString = ref<string>('');

const props = defineProps({
  column: {
    type: Object as () => CombinationTableColumn,
    required: true
  }
});
const updateColumnFilter = () => {
  const column = tableControls.getTableColumns?.find(column => column.name === props.column.name);
  if (!column) {
    return;
  }
  tableControls.setTableColumns(
    tableControls.getTableColumns?.map((column: CombinationTableColumn) => {
      if (column.name === props.column.name) {
        return {...column, filter: {text: filterString.value}} as CombinationTableColumn;
      }
      return column;
    })
  );
};
</script>
