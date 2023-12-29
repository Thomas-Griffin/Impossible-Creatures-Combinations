<template>
  <q-btn :icon="isBarChart ? 'bar_chart' : 'stacked_line_chart'" flat @click="onChartTypeChange" />
  <div :id="chartName"></div>
</template>
<script lang="ts" setup>
import { computed, ComputedRef, onMounted, ref, watch } from 'vue'
import { useVisualisations } from 'src/composables/useVisualisations'
import { useQuasar } from 'quasar'
import { useModStore } from 'src/stores/modStore'
import { Config, Data, Layout } from 'plotly.js'
import Plotly, { PlotType } from 'plotly.js-dist-min'
import ElectricityDistributionPerResearchLevelResponse from '../../types/ElectricityDistributionPerResearchLevelResponse'

const modStore = useModStore()
const chartName = ref('ElectricityDistributionPerResearchLevelHistogram')

const $q = useQuasar()
const { getElectricityDistributionPerResearchLevel } = useVisualisations()
const data = ref<Data[]>([])

onMounted(async () => {
  await Plotly.newPlot(chartName.value, data.value, layout.value, config.value)
})

const getData = async () => {
  const electricityDistribution: ElectricityDistributionPerResearchLevelResponse[] =
    (await getElectricityDistributionPerResearchLevel({ mod: modStore.getMod })) || []
  data.value = [
    {
      x: electricityDistribution.map(obj => `${obj.bounds.lower} - ${obj.bounds.upper}`),
      y: electricityDistribution.map(obj => obj.counts['Research Level 1']),
      text: electricityDistribution.map(obj => obj.counts['Research Level 1'].toString()),
      type: chartType.value,
      name: 'Research Level 1'
    },
    {
      x: electricityDistribution.map(obj => `${obj.bounds.lower} - ${obj.bounds.upper}`),
      y: electricityDistribution.map(obj => obj.counts['Research Level 2']),
      text: electricityDistribution.map(obj => obj.counts['Research Level 2'].toString()),
      type: chartType.value,
      name: 'Research Level 2'
    },
    {
      x: electricityDistribution.map(obj => `${obj.bounds.lower} - ${obj.bounds.upper}`),
      y: electricityDistribution.map(obj => obj.counts['Research Level 3']),
      text: electricityDistribution.map(obj => obj.counts['Research Level 3'].toString()),
      type: chartType.value,
      name: 'Research Level 3'
    },
    {
      x: electricityDistribution.map(obj => `${obj.bounds.lower} - ${obj.bounds.upper}`),
      y: electricityDistribution.map(obj => obj.counts['Research Level 4']),
      text: electricityDistribution.map(obj => obj.counts['Research Level 4'].toString()),
      type: chartType.value,
      name: 'Research Level 4'
    },
    {
      x: electricityDistribution.map(obj => `${obj.bounds.lower} - ${obj.bounds.upper}`),
      y: electricityDistribution.map(obj => obj.counts['Research Level 5']),
      text: electricityDistribution.map(obj => obj.counts['Research Level 5'].toString()),
      type: chartType.value,
      name: 'Research Level 5'
    }
  ]
}

watch(
  () => modStore.getMod,
  async () => {
    await getData()
    await Plotly.react(chartName.value, data.value, layout.value, config.value)
  }
)

const onChartTypeChange = async () => {
  isBarChart.value = !isBarChart.value
  await getData()
  await Plotly.react(chartName.value, data.value, layout.value, config.value)
}

const isBarChart = ref(true)
const chartType: ComputedRef<PlotType> = computed(() =>
  isBarChart.value ? ('bar' as PlotType) : ('histogram' as PlotType)
)

const layout = ref<Partial<Layout>>({
  title: 'Electricity Cost Distribution Per Research Level',
  xaxis: { title: 'Electricity Costs', automargin: true },
  yaxis: { title: 'Number of Combinations' },
  plot_bgcolor: $q.dark.isActive ? 'black' : 'white',
  paper_bgcolor: $q.dark.isActive ? 'black' : 'white',
  font: {
    color: $q.dark.isActive ? 'white' : 'black'
  }
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
    await Plotly.react(chartName.value, data.value, layout.value, config.value)
  }
)
</script>
