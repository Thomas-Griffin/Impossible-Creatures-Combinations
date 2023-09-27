<template>
  <q-card class="window-width">
    <q-card-section class="cursive-font text-center">
      <h4>Project Info</h4>
      <h6>Impossible Creatures Combinations</h6>
      <p>An app for viewing, sorting and filtering all creature combinations for the
        game Impossible Creatures.
      </p>
      <a :href="githubLink">GitHub Repository</a>
    </q-card-section>
  </q-card>
</template>

<style>

</style>

<script setup>
import {ref} from 'vue';

const githubLink = ref('https://github.com/Thomas-Griffin/Impossible-Creatures-Combinations-Web-App')
</script>
