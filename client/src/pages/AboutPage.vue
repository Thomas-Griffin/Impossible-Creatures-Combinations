<template>
  <q-layout>
    <q-page class="full-height">

      <div class="q-pa-md">
        <div class="row justify-center q-gutter-sm">
          <q-intersection
            v-for="component in components"
            :key="component.name"
            transition="jump-up"
          >
            <component :is="component.component"/>
          </q-intersection>
        </div>
      </div>
    </q-page>
  </q-layout>
</template>

<style>

</style>

<script setup>
import ProjectInfo from 'components/ProjectInfo.vue';
import ChangeLog from 'components/ChangeLog.vue';
import DeveloperInfo from 'components/DeveloperInfo.vue';

import {ref} from 'vue';

const components = ref([
  {
    name: 'ProjectInfo',
    component: ProjectInfo,
    title: 'Project Info',
    icon: 'info',
  },
  {
    name: 'DeveloperInfo',
    component: DeveloperInfo,
    title: 'Developer Info',
    icon: 'person',
  },
  {
    name: 'ChangeLog',
    component: ChangeLog,
    title: 'Change Log',
    icon: 'history',
  },
]);


</script>

