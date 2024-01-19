<template>
  <q-btn-dropdown
    class="cursive-font"
    flat
    icon="settings"
  >
    <q-list padding>
      <q-item>
        <FullScreenToggle />
      </q-item>
      <q-item>
        <GridModeToggle />
      </q-item>
      <q-item>
        <q-checkbox
          v-model="showGrid"
          class="cursive-font"
          label="Show Grid"
          @click="toggleShowGrid"
        />
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>
<script lang="ts" setup>
import GridModeToggle from './GridModeToggle.vue';

import {useCombinationTableControlsStore} from '../../stores/combinationTableControlsStore';
import {ref} from 'vue';
import FullScreenToggle from './FullScreenToggle.vue';

const tableControls = useCombinationTableControlsStore();
const showGrid = ref(tableControls.getShowGrid);
const toggleShowGrid = () => {
  tableControls.setShowGrid(!tableControls.getShowGrid);
  showGrid.value = tableControls.getShowGrid;
};
</script>
