<template>
  <div class="row">
    <div class="col">
      <q-select v-model="chartType" :options="['bar', 'lines']" filled hide-dropdown-icon
                label="Chart Type"
                options-selected-class="text-blue" square @update:model-value="onChartTypeChange"/>
      <q-btn :label="sorted ? 'Sorted' : 'Unsorted'" class="full-width" color="primary" @click="toggleSorted"/>
    </div>
  </div>
  <vue-plotly :config="config" :data="animalData" :layout="layout"></vue-plotly>

</template>
<script setup>
import {VuePlotly} from 'vue3-plotly';
import {onBeforeMount, ref, watch} from 'vue';
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

const chartType = ref('bar')

const onChartTypeChange = async (value) => {
  chartType.value = value
  await getData()
}

const toggleSorted = async () => {
  sorted.value = !sorted.value
  await getData()
}

const getData = async () => {
  const researchLevelsPerStock = await getResearchLevelsPerStock({mod:modStore.getMod})
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
  title: 'Number of Combinations per Research Level',
  xaxis: {title: 'Animal'},
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
