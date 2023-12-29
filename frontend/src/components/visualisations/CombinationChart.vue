<template>
  <div class="full-width full-height justify-center items-center">
    <div class="q-ma-sm row justify-center items-center">
      <q-select
        v-model="xAttribute"
        :options="xAttributeOptions"
        label="X"
        outlined
        @update:model-value="option => setXAttribute(option.value)"
      />
      <q-select
        v-model="yAttribute"
        :options="yAttributeOptions"
        label="Y"
        outlined
        @update:model-value="option => setYAttribute(option.value)"
      />
      <q-input
        v-model="bucketSize"
        debounce="500"
        label="Bucket Size"
        outlined
        type="number"
        @update:model-value="updateChart"
      />
    </div>

    <div :id="chartId"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import Plotly from 'plotly.js-dist-min'
import { Config, Data, Layout } from 'plotly.js'
import { useQuasar } from 'quasar'
import { useModStore } from '../../stores/modStore'
import ChartTypes from '../../types/ChartTypes'
import CombinationAttributes from '../../types/CombinationAttributes'
import { useVisualisations } from '../../composables/useVisualisations'

const modStore = useModStore()
const { getAttributeChart, getXPerYChart } = useVisualisations()
const xAttributeOptions = computed(() =>
  Object.values(CombinationAttributes)
    .map(attribute => ({
      label: attribute,
      value: attribute
    }))
    .filter(attribute => attribute.value !== yAttribute.value)
)
const yAttributeOptions = computed(() =>
  Object.values(CombinationAttributes)
    .map(attribute => ({
      label: attribute,
      value: attribute
    }))
    .filter(attribute => attribute.value !== xAttribute.value)
)

const xAttribute = ref<CombinationAttributes>(CombinationAttributes.NONE)
const yAttribute = ref<CombinationAttributes>(CombinationAttributes.NONE)
const bucketSize = ref(1)

const chartDrawn = ref(false)

const barmode = ref('group')

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const chartData = ref<Data[]>([])
const chartId = ref(props.id)

const chartType = computed(() => {
  if (yAttribute.value === CombinationAttributes.NONE) {
    return ChartTypes.ATTRIBUTE
  }
  return ChartTypes.X_PER_Y
})

const fetchFunction = computed(() => {
  switch (chartType.value) {
    case ChartTypes.ATTRIBUTE:
      return getAttributeChart
    case ChartTypes.X_PER_Y:
      return getXPerYChart
    default:
      return getAttributeChart
  }
})
const qVueGlobals = useQuasar()
const sorted = ref(false)

const layout = computed(
  () =>
    ({
      barmode: barmode.value,
      title:
        yAttribute.value === CombinationAttributes.NONE
          ? xAttribute.value
          : `${xAttribute.value} by ${yAttribute.value}`,
      xaxis: {
        title: xAttribute.value,
        automargin: true,
        tickangle: -45
      },
      yaxis: {
        title: 'Combinations'
      },
      plot_bgcolor: qVueGlobals.dark.isActive ? 'black' : 'white',
      paper_bgcolor: qVueGlobals.dark.isActive ? 'black' : 'white',
      font: {
        color: qVueGlobals.dark.isActive ? 'white' : 'black',
        size: 14,
        family: 'Futura, sans-serif'
      },
      legend: {
        orientation: 'h',
        yanchor: 'bottom',
        y: 1,
        xanchor: 'right',
        x: 0.8
      },
      hoverlabel: {
        align: 'left',
        namelength: -1
      }
    }) as Partial<Layout>
)

const config = ref<Partial<Config>>({
  displayModeBar: false,
  displaylogo: false,
  responsive: true
})

const isBarChart = ref(true)

async function updateChart() {
  if (bucketSize.value < 1) {
    bucketSize.value = 1
  }
  const response = await fetchFunction.value({
    mod: modStore.getMod,
    chartOptions: {
      sort: sorted.value,
      chartType: isBarChart.value ? 'bar' : 'line'
    },
    attributes: {
      x: xAttribute.value,
      y: yAttribute.value
    },
    bucketSize: bucketSize.value > 0 ? bucketSize.value : 1
  })
  chartData.value = response || []
  if (chartDrawn.value) {
    await Plotly.react(chartId.value, chartData.value, layout.value, config.value)
  }
}

watch(
  () => modStore.getMod,
  async () => {
    await updateChart()
  }
)

watch(
  () => qVueGlobals.dark.isActive,
  async () => {
    await updateChart()
  }
)

onMounted(async () => {
  await updateChart()
  await Plotly.newPlot(chartId.value, chartData.value, layout.value, config.value)
  chartDrawn.value = true
})

const setXAttribute = async (attribute: CombinationAttributes) => {
  xAttribute.value = attribute
  await updateChart()
}

const setYAttribute = async (attribute: CombinationAttributes) => {
  yAttribute.value = attribute
  await updateChart()
}
</script>
