<template>
    <Dropdown
        v-if="modStore?.getMods?.length > 0"
        v-model="selectedMod"
        :options="modsDisplayNames"
        placeholder="Select a mod"
        @update:model-value="(value: string) => onModChange(value)"
    />
</template>

<script lang="ts" setup>
import Dropdown from 'primevue/dropdown'
import useModStore from '~store/modStore'
import Mod from '~types/Mod'

const modStore = useModStore()

onBeforeMount(async () => {
    onModChange(getModDisplayName(modStore.getMod))
})

const getModFromDisplayString = (modName: string): Mod | undefined =>
    modStore.mods.find((mod: Mod) => `${mod.name} ${mod?.version}` === modName)

const getModDisplayName = (mod: Mod) => {
    return `${mod.name} ${mod.version}`
}

const selectedMod = ref(getModDisplayName(modStore.getMod))

const onModChange = (modName: string) => {
    let mod = getModFromDisplayString(modName)
    if (mod) {
        modStore.setMod(mod)
        selectedMod.value = getModDisplayName(modStore.getMod)
    }
}

const modsDisplayNames = computed(() => {
    return modStore.mods.map((mod: Mod) => `${mod?.name} ${mod?.version}`)
})
</script>
