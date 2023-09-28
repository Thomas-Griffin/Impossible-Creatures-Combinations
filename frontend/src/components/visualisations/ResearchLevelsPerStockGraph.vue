<template>
  <div class="row">
    <div class="col-4">
      <q-select v-model="selectedMod" :options="mods" filled hide-dropdown-icon
                label="Mod"
                options-selected-class="text-blue" square @update:model-value="onModChange"/>
    </div>
    <div class="col-4">
      <q-select v-model="chartType" :options="['bar', 'lines']" filled hide-dropdown-icon
                label="Chart Type"
                options-selected-class="text-blue" square @update:model-value="onChartTypeChange"/>
    </div>
    <div class="col-4">
      <q-btn :label="sorted ? 'Sorted' : 'Unsorted'" class="full-width" color="primary" @click="toggleSorted"/>
    </div>
  </div>
  <div class="full-height full-width items-center">
    <vue-plotly v-if="!sorted" :config="config" :data="animalData" :layout="layout"></vue-plotly>
    <div v-else>
      <vue-plotly v-for="researchLevel in 5" :key="researchLevel" :config="config"
                  :data="sortByNumberInResearchLevel(researchLevel)" :layout="layout"></vue-plotly>
    </div>
  </div>
</template>
<script setup>
import {VuePlotly} from 'vue3-plotly';
import {onBeforeMount, ref, watch} from 'vue';
import {useMods} from 'src/composables/useMods';
import {useVisualisations} from 'src/composables/useVisualisations';
import {useQuasar} from 'quasar';

const $q = useQuasar()
const {getMods, getModDisplayName, getModFromDisplayString} = useMods()
const {getResearchLevelsPerStock} = useVisualisations()
const selectedMod = ref('')
const mods = ref([])

const animalData = ref([])
const sortedAnimalData = ref({1: [], 2: [], 3: [], 4: [], 5: []})
const sorted = ref(true)

onBeforeMount(async () => {
  mods.value = (await getMods()).map(mod => getModDisplayName(mod))
  selectedMod.value = mods.value[0]
  await onModChange()
})

const chartType = ref('bar')

const onChartTypeChange = async (value) => {
  chartType.value = value
  await onModChange()
}

const toggleSorted = async () => {
  sorted.value = !sorted.value
  await onModChange()
}

const sortByNumberInResearchLevel = (researchLevel) => {
  let data = sortedAnimalData.value[researchLevel]
  return data.sort((a, b) => b.y[0] - a.y[0])
}

const onModChange = async () => {
  const mod = getModFromDisplayString(selectedMod.value)
  const researchLevelsPerStock = await getResearchLevelsPerStock({mod})
  if (sorted.value === true) {
    sortedAnimalData.value = {
      1: researchLevelsPerStock.map(obj => ({
        x: ['Research Level 1'],
        y: [obj.counts?.['Research Level 1'] ?? 0],
        type: chartType.value,
        name: obj.animal,
      })),
      2: researchLevelsPerStock.map(obj => ({
        x: ['Research Level 2'],
        y: [obj.counts?.['Research Level 2'] ?? 0],
        type: chartType.value,
        name: obj.animal,
      })),
      3: researchLevelsPerStock.map(obj => ({
        x: ['Research Level 3'],
        y: [obj.counts?.['Research Level 3'] ?? 0],
        type: chartType.value,
        name: obj.animal,
      })),
      4: researchLevelsPerStock.map(obj => ({
        x: ['Research Level 4'],
        y: [obj.counts?.['Research Level 4'] ?? 0],
        type: chartType.value,
        name: obj.animal,
      })),
      5: researchLevelsPerStock.map(obj => ({
        x: ['Research Level 5'],
        y: [obj.counts?.['Research Level 5'] ?? 0],
        type: chartType.value,
        name: obj.animal,
      })),
    }

  } else {
    animalData.value = researchLevelsPerStock.map(obj => ({
      x: ['Research Level 1', 'Research Level 2', 'Research Level 3', 'Research Level 4', 'Research Level 5'],
      y: [obj.counts?.['Research Level 1'], obj.counts?.['Research Level 2'], obj.counts?.['Research Level 3'], obj.counts?.['Research Level 4'], obj.counts?.['Research Level 5']],
      type: chartType.value,
      name: obj.animal,
    }))
  }

}

const layout = ref({
  title: 'Number of Combinations per Research Level',
  xaxis: {title: 'Research Level'},
  yaxis: {title: 'Number of Animals'},
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
