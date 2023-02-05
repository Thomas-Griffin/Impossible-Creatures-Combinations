<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="cursive-font text-h3">
          <router-link class="text-white flex justify-center items-center" style="text-decoration: none" to="/">
            Impossible Creatures Combinations
          </router-link>
        </q-toolbar-title>

        <q-btn round unelevated>
          <q-icon name="settings">

          </q-icon>

          <q-menu flat rounded>
            <div class="items-center justify-center content-center text-center" style="min-width: 200px">
              <div class="text-subtitle1 q-mt-lg q-mb-sm cursive-font">Settings</div>
              <div class="q-ma-lg">
                <q-toggle v-model="darkModeEnabled"
                          :color="darkModeEnabled ? 'black' : 'white'"
                          :label="darkModeEnabled ? 'Dark Theme' : 'Light Theme'"
                          checked-icon="dark_mode"
                          class="text-left"
                          unchecked-icon="light_mode"
                          @update:model-value="toggleDarkMode"
                />
              </div>
            </div>
          </q-menu>
        </q-btn>

      </q-toolbar>
    </q-header>


    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {useQuasar} from 'quasar';

const $q = useQuasar();
const darkModeEnabled = ref(true);

const toggleDarkMode = () => {
  $q.dark.toggle();
  darkModeEnabled.value = $q.dark.isActive;
};

</script>
