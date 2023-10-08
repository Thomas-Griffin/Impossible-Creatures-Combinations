<template>
  <q-select
    :model-value="selectedMod"
    :options="modsDisplayNames"
    class="cursive-font"
    dense
    flat
    label="Mod"
    label-color="grey"
    options-selected-class="text-blue"
    rounded
    style="width: 250px"
    @update:model-value="
      (value) => {
        onModChange(value);
      }
    "
  />
</template>

<script setup>
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useMods } from 'src/composables/useMods';
import { useModStore } from 'stores/modStore';

const { getMods, getModDisplayName, getModFromDisplayString } = useMods();
const mods = ref([]);
const modStore = useModStore();
const selectedMod = ref('');

onBeforeMount(async () => {
  mods.value = await getMods();
  selectedMod.value = getModDisplayName(modStore.getMod);
});

watch(
  () => modStore.getMod,
  (newValue) => {
    selectedMod.value = getModDisplayName(newValue);
  },
);

const onModChange = (value) => {
  modStore.setMod(getModFromDisplayString(value));
  selectedMod.value = getModDisplayName(modStore.getMod);
};

const modsDisplayNames = computed(() => {
  return mods.value.map((mod) => `${mod?.name} ${mod?.version}`);
});
</script>
