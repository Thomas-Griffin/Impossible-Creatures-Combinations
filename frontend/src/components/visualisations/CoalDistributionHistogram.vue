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
import CoalDistributionResponse from '../../types/CoalDistributionResponse'

const modStore = useModStore()
const chartName = ref('CoalDistributionHistogram')

const $q = useQuasar()
const { getCoalDistribution } = useVisualisations()
const data = ref<Data[]>([])

onMounted(async () => {
  await Plotly.newPlot(chartName.value, data.value, layout.value, config.value)
})

const getData = async () => {
  const coalDistribution: CoalDistributionResponse[] = (await getCoalDistribution({ mod: modStore.getMod })) || []
  data.value = [
    {
      x: coalDistribution.map(obj => `${obj.bounds.lower} - ${obj.bounds.upper}`),
      y: coalDistribution.map(obj => obj.count),
      text: coalDistribution.map(obj => obj.count.toString()),
      type: chartType.value
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

const isBarChart = ref<boolean>(true)
const chartType: ComputedRef<PlotType> = computed(
  (): PlotType => (isBarChart.value ? ('bar' as PlotType) : ('histogram' as PlotType))
)

const layout = ref<Partial<Layout>>({
  title: 'Coal Cost Distribution',
  xaxis: { title: 'Coal Costs', automargin: true },
  yaxis: { title: 'Number of Combinations' },
  plot_bgcolor: $q.dark.isActive ? 'black' : 'white',
  paper_bgcolor: $q.dark.isActive ? 'black' : 'white',
  font: {
    color: $q?.dark?.isActive ? 'white' : 'black' ?? 'black'
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
