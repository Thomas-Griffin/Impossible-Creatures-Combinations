<template>
  <ToggleButton
    v-model="darkMode"
    :off-icon="'pi pi-sun'"
    :on-icon="'pi pi-moon'"
    off-label=""
    on-label=""
    rounded
    @update:model-value="toggleDarkMode"
  />
</template>

<script lang="ts" setup>
import { useDisplayStore } from "~/store/displayStore";

import { usePrimeVue } from "primevue/config";

const PrimeVue = usePrimeVue();
const displayStore = useDisplayStore();

const darkMode = ref(displayStore.getDarkMode);

const toggleDarkMode = () => {
  if (displayStore.getDarkMode) {
    displayStore.setDarkMode(false);
    PrimeVue.changeTheme(
      "aura-dark-noir",
      "aura-light-noir",
      "theme-link",
      () => {},
    );
  } else if (!displayStore.getDarkMode) {
    displayStore.setDarkMode(true);
    PrimeVue.changeTheme(
      "aura-light-noir",
      "aura-dark-noir",
      "theme-link",
      () => {},
    );
  }
  darkMode.value = displayStore.getDarkMode;
};
</script>

<style scoped></style>
