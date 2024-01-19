<template>
  <q-btn
    :text-color="ascendingSortColor"
    dense
    flat
    icon="arrow_upward"
    round
    size="sm"
    @click="onAscendingSort"
  />
  <q-btn
    :text-color="descendingSortColor"
    dense
    flat
    icon="arrow_downward"
    round
    size="sm"
    @click="onDescendingSort"
  />
</template>
<script lang="ts" setup>
import CombinationTableColumn from '../../types/CombinationTableColumn';
import {useCombinationTableControlsStore} from '../../stores/combinationTableControlsStore';
import {computed, onMounted, ref} from 'vue';

const tableControls = useCombinationTableControlsStore();
const tableRef = ref();
const columnRef = ref<CombinationTableColumn>();

onMounted(() => {
  tableRef.value = tableControls.getTableRef;
  columnRef.value = tableControls.getTableColumns.find(column => column.name === props.column.name);
});

const props = defineProps({
  column: {
    type: Object as () => CombinationTableColumn,
    required: true
  }
});

const onDescendingSort = async () => {
  resetSort();
  if (!columnRef.value) {
    return;
  }
  columnRef.value.isSorted.descending = true;
  columnRef.value.isSorted.ascending = false;
  tableControls.updateColumn(columnRef.value);
  tableRef.value?.requestServerInteraction();
};

const onAscendingSort = async () => {
  resetSort();
  if (!columnRef.value) {
    return;
  }
  columnRef.value.isSorted.ascending = true;
  columnRef.value.isSorted.descending = false;
  tableControls.updateColumn(columnRef.value);
  tableRef.value?.requestServerInteraction();
};

const resetSort = () => {
  tableControls.getTableColumns.forEach((col: CombinationTableColumn) => {
    col.isSorted.ascending = false;
    col.isSorted.descending = false;
    tableControls.updateColumn(col);
  });
};

const ascendingSortColor = computed(() => {
  return !columnRef.value ? 'primary' : columnRef.value.isSorted.ascending ? 'green' : 'primary';
});

const descendingSortColor = computed(() => {
  return !columnRef.value ? 'primary' : columnRef.value.isSorted.descending ? 'green' : 'primary';
});
</script>
