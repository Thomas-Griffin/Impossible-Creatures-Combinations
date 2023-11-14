<template>
  <q-btn :icon="isBarChart ? 'bar_chart' : 'stacked_line_chart'" flat @click="onChartTypeChange" />
  <div id="chart"></div>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useVisualisations } from 'src/composables/useVisualisations'
import { useQuasar } from 'quasar'
import { useModStore } from 'src/stores/modStore'
import { Config, Data, Layout } from 'plotly.js'
import Plotly, { PlotType } from 'plotly.js-dist-min'
import ElectricityDistributionResponse from '../../types/ElectrivityDistributionResponse'

const modStore = useModStore()

const $q = useQuasar()
const { getElectricityDistribution } = useVisualisations()
const selectedMod = ref('')
const data = ref<Data[]>([])

onBeforeMount(async () => {
  selectedMod.value = modStore.getMod
  await getData()
})

onMounted(() => {
  Plotly.newPlot('chart', data.value, layout.value, config.value)
})

onBeforeUnmount(() => {
  Plotly.purge('chart')
})

const getData = async () => {
  const electricityDistribution: ElectricityDistributionResponse[] = await getElectricityDistribution({
    mod: modStore.getMod
  })
  data.value = [
    {
      x: electricityDistribution.map(obj => `${obj.bounds.lower} - ${obj.bounds.upper}`),
      y: electricityDistribution.map(obj => obj.count),
      text: electricityDistribution.map(obj => obj.count.toString()),
      type: chartType.value
    }
  ]
}

watch(() => modStore.getMod, getData)

const onChartTypeChange = async () => {
  isBarChart.value = !isBarChart.value
  await getData()
}

const isBarChart = ref(true)
const chartType = computed((): PlotType => (isBarChart.value ? 'bar' : 'histogram'))

const layout = ref<Partial<Layout>>({
  title: 'Electricity Cost Distribution',
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
  newDarkModeState => {
    layout.value.plot_bgcolor = newDarkModeState ? 'black' : 'white'
    layout.value.paper_bgcolor = newDarkModeState ? 'black' : 'white'
    if (layout.value.font?.color) layout.value.font.color = newDarkModeState ? 'white' : 'black'
  }
)
</script>
