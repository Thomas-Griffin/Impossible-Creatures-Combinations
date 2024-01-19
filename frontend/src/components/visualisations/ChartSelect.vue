<template>
  <div class="flex justify-center flex-center">
    <q-btn-group>
      <q-btn
        icon="add"
        label="Add Chart"
        outline
        @click="newChart()"
      />
    </q-btn-group>
  </div>
  <div
    v-for="chart in charts"
    :key="chart.id"
    class="flex justify-center flex-center q-pa-sm"
  >
    <q-btn
      :key="chart.id"
      :value="chart.id"
      icon="delete"
      label="Delete"
      outline
      @click="removeChart(chart.id)"
    />
    <CombinationChart :id="chart.id" />
  </div>
</template>
<script lang="ts" setup>
import {ref} from 'vue';
import CombinationChart from './CombinationChart.vue';
import Chart from '../../types/Chart';

const charts = ref<Chart[]>([]);

const newChart = () => {
  const chart: Partial<Chart> = {
    id: `chart-${charts.value.length}`
  };
  charts.value.push(chart as Chart);
};

const removeChart = (chartId: string) => {
  const index = charts.value.findIndex(chart => chart.id === chartId);
  if (index > -1) {
    charts.value.splice(index, 1);
  }
};
</script>
