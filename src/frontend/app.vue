<template>
    <link
        id="theme-link"
        href="https://cdn.jsdelivr.net/npm/primevue/resources/themes/aura-dark-noir/theme.css"
        rel="stylesheet"
        type="text/css"
    />
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script lang="ts" setup>
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import useModStore from '~store/modStore'

const modStore = useModStore()

onBeforeMount(async () => {
    await modStore.fetchMods()
})
</script>
