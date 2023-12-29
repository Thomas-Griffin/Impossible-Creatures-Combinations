<template>
  <q-btn :icon="isBarChart ? 'bar_chart' : 'stacked_line_chart'" flat @click="onChartTypeChange" />
  <q-btn :icon="sorted ? 'format_list_numbered' : 'sort_by_alpha'" :model-value="sorted" flat @click="toggleSorted" />
  <div :id="chartName"></div>
</template>
<script lang="ts" setup>
import { computed, ComputedRef, onMounted, ref, watch } from 'vue'
import { useVisualisations } from 'src/composables/useVisualisations'
import { useQuasar } from 'quasar'
import { useModStore } from 'src/stores/modStore'
import { Config, Data, Layout } from 'plotly.js'
import Plotly, { PlotType } from 'plotly.js-dist-min'
import ResearchLevel from '../../types/ResearchLevel'

const modStore = useModStore()
const chartName = ref('ResearchLevelsPerStockGraph')

const $q = useQuasar()
const { getResearchLevelsPerStock } = useVisualisations()
const animalData = ref<Data[]>([])
const sorted = ref(true)

onMounted(async () => {
  await Plotly.newPlot(chartName.value, animalData.value, layout.value, config.value)
})

const isBarChart = ref(true)
const chartType: ComputedRef<PlotType> = computed(() =>
  isBarChart.value ? ('bar' as PlotType) : ('histogram' as PlotType)
)

const onChartTypeChange = async () => {
  isBarChart.value = !isBarChart.value
  await getData()
  await Plotly.react(chartName.value, animalData.value, layout.value, config.value)
}
const toggleSorted = async () => {
  sorted.value = !sorted.value
  await getData()
  await Plotly.react(chartName.value, animalData.value, layout.value, config.value)
}

const getData = async () => {
  const researchLevelsPerStock: ResearchLevelsPerStockResponse[] =
    (await getResearchLevelsPerStock({
      mod: modStore.getMod
    })) || []
  animalData.value = [
    formatChartData(researchLevelsPerStock, 'Research Level 1', sorted.value),
    formatChartData(researchLevelsPerStock, 'Research Level 2', sorted.value),
    formatChartData(researchLevelsPerStock, 'Research Level 3', sorted.value),
    formatChartData(researchLevelsPerStock, 'Research Level 4', sorted.value),
    formatChartData(researchLevelsPerStock, 'Research Level 5', sorted.value)
  ]
}

watch(
  () => modStore.getMod,
  async () => {
    await getData()
    await Plotly.react(chartName.value, animalData.value, layout.value, config.value)
  }
)

const formatChartData = (
  data: ResearchLevelsPerStockResponse[] = [],
  researchLevel: ResearchLevel,
  sort: boolean
): Partial<Data> => {
  if (sort) {
    return {
      name: researchLevel,
      text: data
        .map(obj => obj.counts?.[researchLevel] ?? 0)
        .sort((a, b) => b - a)
        .map(num => num.toString()),
      textposition: 'auto',
      type: chartType.value,
      x: data.sort((a, b) => b.counts?.[researchLevel] - a.counts?.[researchLevel]).map(obj => obj.animal),
      y: data.map(obj => obj.counts?.[researchLevel] ?? 0).sort((a, b) => b - a)
    }
  } else {
    return {
      name: researchLevel,
      text: data.map(obj => obj.counts?.[researchLevel] ?? 0).map(num => num.toString()),
      textposition: 'auto',
      type: chartType.value,
      x: data.map(obj => obj.animal),
      y: data.map(obj => obj.counts?.[researchLevel] ?? 0)
    }
  }
}

const layout = ref<Partial<Layout>>({
  title: 'Number of Combinations Per Research Level',
  xaxis: { title: 'Animal', automargin: true, tickangle: 45 },
  yaxis: { title: 'Number of Combinations' },
  plot_bgcolor: $q.dark.isActive ? 'black' : 'white',
  paper_bgcolor: $q.dark.isActive ? 'black' : 'white',
  font: {
    color: $q.dark.isActive ? 'white' : 'black'
  },
  barmode: sorted.value ? 'stack' : 'group'
})

const config = ref<Partial<Config>>({
  displayModeBar: false,
  displaylogo: false,
  responsive: true
})

watch(
  () => $q.dark.isActive,
  async newDarkModeState => {
    layout.value.plot_bgcolor = newDarkModeState ? 'black' : 'white'
    layout.value.paper_bgcolor = newDarkModeState ? 'black' : 'white'
    if (layout.value.font?.color) {
      layout.value.font.color = newDarkModeState ? 'white' : 'black'
    }
    await getData()
    await Plotly.react(chartName.value, animalData.value, layout.value, config.value)
  }
)
</script>
