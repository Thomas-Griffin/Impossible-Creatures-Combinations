<template>
    <div class="flex justify-content-center align-items-center">
        <Button icon="pi pi-plus" label="Add Chart" @click="newChart()" />
    </div>
    <div v-for="chart in charts" :key="chart.id" class="flex justify-content-center align-items-center">
        <Button :key="chart.id" :value="chart.id" icon="pi pi-trash" label="Delete" @click="removeChart(chart.id)" />
        <VisualisationGraph :id="chart.id" />
    </div>
</template>
<script lang="ts" setup>
import {ref} from 'vue'
import CombinationVisualisation from '../../types/CombinationVisualisation'

const charts = ref<CombinationVisualisation[]>([])

const newChart = () => {
    const chart: Partial<CombinationVisualisation> = {
        id: `chart-${charts.value.length}`,
    }
    charts.value.push(chart as CombinationVisualisation)
}

const removeChart = (chartId: string) => {
    const index = charts.value.findIndex(chart => chart.id === chartId)
    if (index > -1) {
        charts.value.splice(index, 1)
    }
}
</script>
