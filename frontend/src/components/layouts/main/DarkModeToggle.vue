<template>
  <q-toggle
    :model-value="darkModeEnabled"
    checked-icon="dark_mode"
    unchecked-icon="light_mode"
    @update:model-value="toggleDarkMode"
  />
</template>
<script lang="ts" setup>
import {getCssVar, setCssVar, useQuasar} from 'quasar';
import {computed} from 'vue';

const qVueGlobals = useQuasar();
const darkModeEnabled = computed<boolean>(() => qVueGlobals.dark.isActive);

const toggleDarkMode = () => {
  qVueGlobals.dark.toggle();
  const primaryColor: string | null = qVueGlobals.dark.isActive ? getCssVar('dark') : getCssVar('secondary');
  if (primaryColor) {
    setCssVar('primary', primaryColor);
  }
  const backgroundImage = qVueGlobals.dark.isActive ? getCssVar('background-dark') : getCssVar('background-light');
  if (backgroundImage) {
    setCssVar('background-image', backgroundImage);
  }
};
</script>
