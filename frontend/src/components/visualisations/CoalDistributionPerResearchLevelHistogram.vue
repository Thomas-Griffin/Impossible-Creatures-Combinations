<template>
  <q-btn :icon="isBarChart ? 'bar_chart' : 'stacked_line_chart'" flat @click="onChartTypeChange" />
  <div id="chart"></div>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useVisualisations } from 'src/composables/useVisualisations'
import { useQuasar } from 'quasar'
import { useModStore } from 'src/stores/modStore'
import { Mod } from 'src/types/Mod'
import Plotly from 'plotly.js-dist-min'
import { Config, Layout } from 'plotly.js'
import CoalDistributionPerResearchLevelResponse from '../../types/CoalDistributionPerResearchLevelResponse'

const modStore = useModStore()

const $q = useQuasar()
const { getCoalDistributionPerResearchLevel } = useVisualisations()
const selectedMod = ref<Mod | null>(null)
const data = ref<object[]>([])

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
  const coalDistribution: CoalDistributionPerResearchLevelResponse[] = await getCoalDistributionPerResearchLevel({
    mod: modStore.getMod
  })
  data.value = [
    {
      x: coalDistribution.map(obj => `${obj.bounds.lower} - ${obj.bounds.upper}`),
      y: coalDistribution.map(obj => obj.counts['Research Level 1']),
      text: coalDistribution.map(obj => obj.counts['Research Level 1']),
      type: chartType.value,
      name: 'Research Level 1'
    },
    {
      x: coalDistribution.map(obj => `${obj.bounds.lower} - ${obj.bounds.upper}`),
      y: coalDistribution.map(obj => obj.counts['Research Level 2']),
      text: coalDistribution.map(obj => obj.counts['Research Level 2']),
      type: chartType.value,
      name: 'Research Level 2'
    },
    {
      x: coalDistribution.map(obj => `${obj.bounds.lower} - ${obj.bounds.upper}`),
      y: coalDistribution.map(obj => obj.counts['Research Level 3']),
      text: coalDistribution.map(obj => obj.counts['Research Level 3']),
      type: chartType.value,
      name: 'Research Level 3'
    },
    {
      x: coalDistribution.map(obj => `${obj.bounds.lower} - ${obj.bounds.upper}`),
      y: coalDistribution.map(obj => obj.counts['Research Level 4']),
      text: coalDistribution.map(obj => obj.counts['Research Level 4']),
      type: chartType.value,
      name: 'Research Level 4'
    },
    {
      x: coalDistribution.map(obj => `${obj.bounds.lower} - ${obj.bounds.upper}`),
      y: coalDistribution.map(obj => obj.counts['Research Level 5']),
      text: coalDistribution.map(obj => obj.counts['Research Level 5']),
      type: chartType.value,
      name: 'Research Level 5'
    }
  ]
}

watch(() => modStore.getMod, getData)

const onChartTypeChange = async () => {
  isBarChart.value = !isBarChart.value
  await getData()
}

const isBarChart = ref(true)
const chartType = computed(() => (isBarChart.value ? 'bar' : 'line'))

const layout = ref<Partial<Layout>>({
  title: 'Coal Cost Distribution Per Research Level',
  xaxis: { title: 'Coal Costs', automargin: true },
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
