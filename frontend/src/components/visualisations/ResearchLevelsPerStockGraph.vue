<template>
  <q-btn :icon="isBarChart? 'bar_chart' : 'stacked_line_chart'" flat @click="onChartTypeChange"/>
  <q-btn :icon="sorted? 'format_list_numbered' : 'sort_by_alpha'" :model-value="sorted" flat @click="toggleSorted"/>
  <vue-plotly :config="config" :data="animalData" :layout="layout"></vue-plotly>

</template>
<script setup>
import {VuePlotly} from 'vue3-plotly';
import {computed, onBeforeMount, ref, watch} from 'vue';
import {useVisualisations} from 'src/composables/useVisualisations';
import {useQuasar} from 'quasar';
import {useModStore} from 'stores/modStore';

const modStore = useModStore()

const $q = useQuasar()
const {getResearchLevelsPerStock} = useVisualisations()
const selectedMod = ref('')
const animalData = ref([])
const sorted = ref(true)

onBeforeMount(async () => {
  selectedMod.value = modStore.getMod
  await getData()
})

const isBarChart = ref(true)
const chartType = computed(() => isBarChart.value ? 'bar' : 'line')

const onChartTypeChange = async () => {
  isBarChart.value = !isBarChart.value
  await getData()
}
const toggleSorted = async () => {
  sorted.value = !sorted.value
  await getData()
}

const getData = async () => {
  const researchLevelsPerStock = await getResearchLevelsPerStock({mod: modStore.getMod})
  animalData.value = [
    formatChartData(researchLevelsPerStock, 'Research Level 1', sorted.value),
    formatChartData(researchLevelsPerStock, 'Research Level 2', sorted.value),
    formatChartData(researchLevelsPerStock, 'Research Level 3', sorted.value),
    formatChartData(researchLevelsPerStock, 'Research Level 4', sorted.value),
    formatChartData(researchLevelsPerStock, 'Research Level 5', sorted.value),
  ]
}


watch(() => modStore.getMod, getData)

const formatChartData = (data, researchLevel, sorting) => {
  if (sorting) {
    return {
      name: researchLevel,
      text: data.map(obj => obj.counts?.[researchLevel] ?? 0).sort((a, b) => b - a),
      textposition: 'auto',
      type: chartType.value,
      x: data.sort((a, b) => b.counts?.[researchLevel] - a.counts?.[researchLevel]).map(obj => obj.animal),
      y: data.map(obj => obj.counts?.[researchLevel] ?? 0).sort((a, b) => b - a),
    }
  } else {
    return {
      name: researchLevel,
      text: data.map(obj => obj.counts?.[researchLevel] ?? 0),
      textposition: 'auto',
      type: chartType.value,
      x: data.map(obj => obj.animal),
      y: data.map(obj => obj.counts?.[researchLevel] ?? 0),
    }
  }
}

const layout = ref({
  title: 'Number of Combinations Per Research Level',
  xaxis: {title: 'Animal', automargin: true, tickangle: 45},
  yaxis: {title: 'Number of Combinations'},
  plot_bgcolor: $q.dark.isActive ? 'black' : 'white',
  paper_bgcolor: $q.dark.isActive ? 'black' : 'white',
  font: {
    color: $q.dark.isActive ? 'white' : 'black',
  },
  barmode: sorted.value ? 'stack' : 'group',
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
