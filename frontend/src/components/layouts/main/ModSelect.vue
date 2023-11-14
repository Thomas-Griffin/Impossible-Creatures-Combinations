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

<script lang="ts" setup>
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useMods } from 'src/composables/useMods';
import { useModStore } from 'src/stores/modStore';
import { Mod } from 'src/types/Mod';

const { getMods, getModDisplayName, getModFromDisplayString } = useMods();
const mods = ref<Mod[]>([]);
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
  }
);

const onModChange = (modName: string) => {
  modStore.setMod(getModFromDisplayString(modName));
  selectedMod.value = getModDisplayName(modStore.getMod);
};

const modsDisplayNames = computed(() => {
  return mods.value.map((mod: Mod) => `${mod?.name} ${mod?.version}`);
});
</script>
