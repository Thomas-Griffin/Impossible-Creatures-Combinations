<template>
  <div class="h-full w-full justify-content-center align-items-center">
    <div class="row">
      <Dropdown
        v-model="xAttribute"
        :max-selected-labels="1"
        :option-disabled="(option: any) => option === yAttribute"
        :options="axisOptions"
      >
        <template #value> X: {{ xAttribute }}</template>
      </Dropdown>
      <Dropdown
        v-model="yAttribute"
        :max-selected-labels="1"
        :option-disabled="(option: any) => option === xAttribute"
        :options="axisOptions"
      >
        <template #value> Y: {{ yAttribute }}</template>
      </Dropdown>
      <span>Bucket Size</span>
      <InputNumber
        v-model="bucketSize"
        :min="1"
        @update:model-value="updateChart"
      />
    </div>
    <div :id="chartId">
      <NuxtPlotly
        :config="config"
        :data="chartData"
        :layout="layout"
        style="width: 100%"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useModStore } from "~/store/modStore";
import CombinationAttributes from "~/types/enums/CombinationAttributes";
import ChartTypes from "~/types/enums/ChartTypes";
import { useDisplayStore } from "~/store/displayStore";
import type {
  NuxtPlotlyConfig,
  NuxtPlotlyData,
  NuxtPlotlyLayout,
} from "nuxt-plotly";

const displayStore = useDisplayStore();

const getBackgroundColour = () => {
  return displayStore.getDarkMode ? "#000000" : "#ffffff";
};

const modStore = useModStore();

const { getAttributeChart, getXPerYChart } = useVisualisations();

const axisOptions = ref(Object.values(CombinationAttributes));

const xAttribute = ref<CombinationAttributes>(CombinationAttributes.NONE);
const yAttribute = ref<CombinationAttributes>(CombinationAttributes.NONE);
const bucketSize = ref(1);

const barmode = ref("group");

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const chartData = ref<NuxtPlotlyData[]>([]);
const chartId = ref(props.id);

const chartType = computed(() => {
  if (yAttribute.value === CombinationAttributes.NONE) {
    return ChartTypes.ATTRIBUTE;
  }
  return ChartTypes.X_PER_Y;
});

const fetchFunction = computed(() => {
  switch (chartType.value) {
    case ChartTypes.ATTRIBUTE:
      return getAttributeChart;
    case ChartTypes.X_PER_Y:
      return getXPerYChart;
    default:
      return getAttributeChart;
  }
});

const sorted = ref(false);

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
        tickangle: -45,
      },
      yaxis: {
        title: "Combinations",
      },
      plot_bgcolor: getBackgroundColour(),
      paper_bgcolor: getBackgroundColour(),
      font: {
        color: displayStore.getDarkMode ? "#ffffff" : "#000000",
        size: 14,
        family: "Futura, sans-serif",
      },
      legend: {
        orientation: "h",
        yanchor: "bottom",
        y: 1,
        xanchor: "right",
        x: 0.8,
      },
      hoverlabel: {
        align: "left",
        namelength: -1,
      },
    }) as Partial<NuxtPlotlyLayout>,
);

const config = ref<Partial<NuxtPlotlyConfig>>({
  displayModeBar: false,
  displaylogo: false,
  responsive: true,
});

const isBarChart = ref(true);

async function updateChart() {
  if (bucketSize.value < 1) {
    bucketSize.value = 1;
  }
  const response = await fetchFunction.value({
    mod: modStore.getMod,
    chartOptions: {
      sort: sorted.value,
      chartType: isBarChart.value ? "bar" : "line",
    },
    attributes: {
      x: xAttribute.value,
      y: yAttribute.value,
    },
    bucketSize: bucketSize.value > 0 ? bucketSize.value : 1,
  });
  chartData.value = response || [];
}

watch(
  () => modStore.getMod,
  async () => {
    await updateChart();
  },
);

watch(
  () => displayStore.darkMode,
  async () => {
    await updateChart();
  },
);

watch(
  () => xAttribute.value,
  async () => {
    await updateChart();
  },
);

watch(
  () => yAttribute.value,
  async () => {
    await updateChart();
  },
);
</script>
