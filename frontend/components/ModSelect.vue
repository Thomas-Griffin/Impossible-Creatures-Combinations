<template>
  <Dropdown
      v-model="selectedMod"
      :options="modsDisplayNames"
      placeholder="Select a Mod"
      @onChange="onModChange"
  />
</template>

<script lang="ts" setup>
import {computed, onBeforeMount, ref, watch} from 'vue';
import Dropdown from 'primevue/dropdown';
import {useMods} from '~/composables/useMods';
import {useModStore} from '~/store/modStore';
import type Mod from '../types/Mod';

const {getMods, getModDisplayName, getModFromDisplayString} = useMods();
const mods = ref<Mod[]>([]);
const modStore = useModStore();
const selectedMod = ref('');

onBeforeMount(async () => {
  await modStore.init();
  mods.value = await getMods();
  selectedMod.value = getModDisplayName(modStore.getMod);
});

watch(
    () => modStore.getMod,
    newValue => {
      selectedMod.value = getModDisplayName(newValue);
    }
);

const onModChange = (modName: string) => {
  let mod = getModFromDisplayString(modName)
  if (mod) {
    modStore.setMod(mod);
    selectedMod.value = getModDisplayName(modStore.getMod);
  }
};

const modsDisplayNames = computed(() => {
  return mods.value.map((mod: Mod) => `${mod?.name} ${mod?.version}`);
});
</script>
