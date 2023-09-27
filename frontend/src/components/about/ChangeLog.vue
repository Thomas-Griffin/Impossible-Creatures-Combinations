<template>
  <q-card class="window-width">
    <q-card-section class="cursive-font text-center">
      <h4>Change Log</h4>

      <div v-for="change in changes" :key="change.version">
        <h6>Version: {{ change.version }}</h6>
        <div class="text-h6">Features</div>
        <q-list dense>
          <q-item v-for="feature in change.features" :key="feature" dense>
            <q-item-section>{{ feature }}</q-item-section>
          </q-item>
        </q-list>
      </div>

    </q-card-section>
  </q-card>
</template>

<style>

</style>

<script setup>
import {ref} from 'vue';

let changes = ref([
  {
    version: '1.0.3',
    features: [
      'Added data visualisations page',
    ]
  },
  {
    version: '1.0.2',
    features: [
      'Added about page',
      'Added change log',
      'Added developer info',
      'Added project info',]
  },
  {
    version: '1.0.1',
    features: [
      'Added abilities to the creature combinations',
      'EHP is now calculated for every combination if not present',
    ]
  },
  {
    version: '1.0.0',
    features: [
      'View all creature combinations',
      'Sort creature combinations',
      'Filter creature combinations',
    ],
  },
]);
</script>



