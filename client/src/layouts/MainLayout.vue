<template>
  <q-layout view="hHh LpR fFf">

    <q-drawer
      v-model="showDrawer"
      overlay
      side="left"
    >
      <div class="q-pa-md">
        <q-list padding>
          <q-item
            v-for="(page, index) in pages"
            :key="index"
            :active="currentPage === page"
            clickable
            @click="navigateTo(page)"
          >
            <q-item-section>
              <q-item-label class="cursive-font">{{ page.title }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <q-header>
      <q-toolbar>
        <q-btn
          dense
          flat
          icon="menu"
          round
          @click="showDrawer = !showDrawer"
        />
        <q-toolbar-title class="cursive-font">
          <div class="text-wrapper">
            <div class="text-white flex mdi-format-text-wrapping-wrap justify-center items-center"
                 style="text-decoration: none;">
              {{ currentPage.title }}
            </div>
          </div>
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
<style>
.text-wrapper {
  white-space: normal;
}
</style>
<script setup>
import {ref} from 'vue';
import {useQuasar} from 'quasar';
import {useRouter} from 'vue-router';

const router = useRouter();
const $q = useQuasar();
const darkModeEnabled = ref(true);
const showDrawer = ref(false);
const pages = ref([
  {title: 'Combinations', path: '/'},
  {title: 'Visualisations', path: '/visualisations'},
  {title: 'About', path: '/about'},
]);
const currentPage = ref(pages.value.find(page => page.path === router.currentRoute.value.path));
const toggleDarkMode = () => {
  $q.dark.toggle();
  darkModeEnabled.value = $q.dark.isActive;
};

const navigateTo = (page) => {
  currentPage.value = page;
  showDrawer.value = false;
  router.push(page.path);
};

</script>
