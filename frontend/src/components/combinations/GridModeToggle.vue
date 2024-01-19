<template>
  <q-toggle
    :icon="getIcon()"
    :label="getLabel()"
    :model-value="gridModeActive"
    class="standard-font"
    dense
    flat
    @click="toggleGridMode"
  />
</template>
<script lang="ts" setup>
import {useCombinationTableControlsStore} from '../../stores/combinationTableControlsStore';
import {ref} from 'vue';

const tableControls = useCombinationTableControlsStore();
const gridModeActive = ref(tableControls.getGridModeActive);
const toggleGridMode = () => {
  tableControls.setGridModeActive(!tableControls.getGridModeActive);
  gridModeActive.value = tableControls.getGridModeActive;
};

const getLabel = (): string => {
  return tableControls.getGridModeActive ? 'Grid' : 'List';
};

const getIcon = (): string => {
  return tableControls.getGridModeActive ? 'grid_on' : 'list';
};
</script>
