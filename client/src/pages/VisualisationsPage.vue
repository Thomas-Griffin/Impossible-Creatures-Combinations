<template>
  <combination-visualisation :background-color="'rgb(255, 255, 255)'"
                             :border-color="'rgb(255, 255, 255)'"
                             :data="data"
                             :labels="columns"
                             :size="'300px'"
                             :title="title"
                             :type="'radar'"
  />
</template>

<script setup>
import CombinationVisualisation from 'components/CombinationVisualisation.vue';
import {ref} from 'vue';

const columns = ref([
  'HP',
  'Attack',
  'Defense',
  'Special Attack',
  'Special Defense',
  'Speed',
]);

const data = ref([
  0,
  1,
  2,
  3,
  4,
  5,
]);

const title = ref('Creature Name');

</script>



