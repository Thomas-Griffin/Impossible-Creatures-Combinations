<template>
    <VisualisationSelect />
</template>

<script lang="ts" setup>
import VisualisationSelect from '../components/VisualisationSelect.vue'

useHead({
    title: 'IC Visualisations',
    meta: [
        {
            name: 'description',
            content: 'Visualisations of IC combinations',
        },
    ],
})
</script>
