<template>
  <q-card class="window-width">
    <q-card-section class="cursive-font text-center">
      <h4>Developer Info</h4>

      <p>Developed by: Thomas Griffin</p>
      <q-btn
        :href="githubProfileLink"
        flat
        style="text-transform: none"
      >
        <q-avatar rounded>
          <img
            :src="githubAvatarLink"
            alt="Thomas Griffin's GitHub Avatar"
          />
        </q-avatar>
        <span class="q-ml-sm">GitHub Profile</span>
      </q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import {ref} from 'vue';

const githubProfileLink = ref('https://github.com/Thomas-Griffin');
const githubAvatarLink = ref('https://avatars.githubusercontent.com/u/40271229?v=4');
</script>

<style></style>
