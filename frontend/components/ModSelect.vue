<template>
  <Dropdown
      v-model="selectedMod"
      :options="modsDisplayNames"
      placeholder="Select a Mod"
      @update:model-value="(value: string ) => onModChange(value)"
  />
</template>

<script lang="ts" setup>
import Dropdown from 'primevue/dropdown';
import {useModStore} from '~/store/modStore';
import type Mod from '../types/Mod';

const modStore = useModStore();

const {data} = await useAsyncData(
    'mods',
    () => $fetch(`${process.env.API_URL ?? 'http://localhost:3000'}/mods`)
)
const mods = ref<Mod[]>(data.value as Mod[] || []);
modStore.setMod(mods.value[0]);

onBeforeMount(() => {
  onModChange(getModDisplayName(modStore.getMod))
});

const getModFromDisplayString = (modName: string): Mod | undefined => mods.value.find((mod: Mod) => `${mod.name} ${mod?.version}` === modName);

const getModDisplayName = (mod: Mod) => {
  return `${mod.name} ${mod.version}`
}


const selectedMod = ref(getModDisplayName(modStore.getMod));

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
