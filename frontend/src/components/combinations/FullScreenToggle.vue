<template>
  <q-btn
    :icon="getIcon()"
    :label="getLabel()"
    :model-value="fullscreen"
    class="standard-font"
    dense
    flat
    @click="toggleFullscreen"
  />
</template>
<script lang="ts" setup>
import {useCombinationTableControlsStore} from '../../stores/combinationTableControlsStore';
import {ref} from 'vue';

const tableControls = useCombinationTableControlsStore();
const fullscreen = ref(tableControls.getFullscreen);
const toggleFullscreen = () => {
  tableControls.setFullscreen(!tableControls.getFullscreen);
  fullscreen.value = tableControls.getFullscreen;
};

const getLabel = (): string => {
  return tableControls.getFullscreen ? 'Exit Fullscreen' : 'Fullscreen';
};

const getIcon = (): string => {
  return tableControls.getFullscreen ? 'fullscreen_exit' : 'fullscreen';
};
</script>
