<template>
    <CombinationsTable />
</template>

<script lang="ts" setup>
import CombinationsTable from '../components/CombinationsTable.vue'

useHead({
    title: 'IC Combinations',
    meta: [
        {
            name: 'description',
            content: 'A database of IC combinations',
        },
    ],
})
</script>
