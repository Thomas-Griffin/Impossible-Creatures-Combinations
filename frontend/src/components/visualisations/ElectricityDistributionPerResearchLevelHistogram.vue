<template>
  <q-btn :icon="isBarChart? 'bar_chart' : 'stacked_line_chart'" flat @click="onChartTypeChange"/>
  <vue-plotly :config="config" :data="data" :layout="layout"></vue-plotly>
</template>
<script setup>

import {VuePlotly} from 'vue3-plotly';
import {computed, onBeforeMount, ref, watch} from 'vue';
import {useVisualisations} from 'src/composables/useVisualisations';
import {useQuasar} from 'quasar';
import {useModStore} from 'stores/modStore';

const modStore = useModStore()

const $q = useQuasar()
const {getElectricityDistributionPerResearchLevel} = useVisualisations()
const selectedMod = ref('')
const data = ref([])


onBeforeMount(async () => {
  selectedMod.value = modStore.getMod
  await getData()
})

const getData = async () => {
  const electricityDistribution = await getElectricityDistributionPerResearchLevel({mod: modStore.getMod})
  data.value = [{
    x: electricityDistribution.map(obj => `${obj.bounds.lower} - ${obj.bounds.upper}`),
    y: electricityDistribution.map(obj => obj.counts['Research Level 1']),
    text: electricityDistribution.map(obj => obj.counts['Research Level 1']),
    type: chartType.value,
    name: 'Research Level 1',
  },
    {
      x: electricityDistribution.map(obj => `${obj.bounds.lower} - ${obj.bounds.upper}`),
      y: electricityDistribution.map(obj => obj.counts['Research Level 2']),
      text: electricityDistribution.map(obj => obj.counts['Research Level 2']),
      type: chartType.value,
      name: 'Research Level 2',
    },
    {
      x: electricityDistribution.map(obj => `${obj.bounds.lower} - ${obj.bounds.upper}`),
      y: electricityDistribution.map(obj => obj.counts['Research Level 3']),
      text: electricityDistribution.map(obj => obj.counts['Research Level 3']),
      type: chartType.value,
      name: 'Research Level 3',
    },
    {
      x: electricityDistribution.map(obj => `${obj.bounds.lower} - ${obj.bounds.upper}`),
      y: electricityDistribution.map(obj => obj.counts['Research Level 4']),
      text: electricityDistribution.map(obj => obj.counts['Research Level 4']),
      type: chartType.value,
      name: 'Research Level 4',
    },
    {
      x: electricityDistribution.map(obj => `${obj.bounds.lower} - ${obj.bounds.upper}`),
      y: electricityDistribution.map(obj => obj.counts['Research Level 5']),
      text: electricityDistribution.map(obj => obj.counts['Research Level 5']),
      type: chartType.value,
      name: 'Research Level 5',
    },
  ]
}

watch(() => modStore.getMod, getData)

const onChartTypeChange = async () => {
  isBarChart.value = !isBarChart.value
  await getData()
}

const isBarChart = ref(true)
const chartType = computed(() => isBarChart.value ? 'bar' : 'line')

const layout = ref({
  title: 'Electricity Cost Distribution Per Research Level',
  xaxis: {title: 'Electricity Costs', automargin: true},
  yaxis: {title: 'Number of Combinations'},
  plot_bgcolor: $q.dark.isActive ? 'black' : 'white',
  paper_bgcolor: $q.dark.isActive ? 'black' : 'white',
  font: {
    color: $q.dark.isActive ? 'white' : 'black',
  },

})

const config = ref({
  displayModeBar: false,
  displayLogo: false,
  responsive: true,
})

watch(
    () => $q.dark.isActive,
    (newDarkModeState) => {
      let newLayout = {...layout.value}
      newLayout.plot_bgcolor = newDarkModeState ? 'black' : 'white';
      newLayout.paper_bgcolor = newDarkModeState ? 'black' : 'white';
      newLayout.font.color = newDarkModeState ? 'white' : 'black';
      layout.value = newLayout
    }
);
</script>
