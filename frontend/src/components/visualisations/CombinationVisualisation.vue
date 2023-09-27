<template>
  <div :style="sizeCss">
    <vue3-chart-js v-bind="{ ...chart }"/>
  </div>
</template>

<script setup>
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs';
import {ref} from 'vue';

const props = defineProps(
  {
    size: {
      type: String,
      default: '300px',
    },
    labels: Array,
    data: Array,
    type: String,
    title: String,
    backgroundColor: String,
    borderColor: String,
  },
)

const sizeCss = ref(`max-width: ${props.size}`)

const chart = {
  type: props.type,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  },
  data: {
    labels: props.labels,
    datasets: [
      {
        label: props.title,
        data: props.data,
        borderColor: props.borderColor,
        backgroundColor: props.backgroundColor,
      },
    ],
  },
};


</script>

