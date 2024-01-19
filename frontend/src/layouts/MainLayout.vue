<template>
  <q-layout view="hHh LpR fFf">
    <q-drawer
      v-model="showDrawer"
      class=""
      overlay
      side="left"
    >
      <div class="q-pa-md">
        <q-list padding>
          <q-item
            v-for="(page, index) in pages"
            :key="index"
            :active="currentPage === page"
            active-class="text-info"
            clickable
            @click="navigateTo(page)"
          >
            <q-item-section>
              <q-item-label class="cursive-font">
                {{ page.title }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>
    <q-header class="text-center background-image">
      <q-toolbar>
        <q-btn
          dense
          flat
          icon="menu"
          style="margin-right: 0.5%; margin-left: 0.15%"
          @click="showDrawer = !showDrawer"
        />
        <ModSelect />

        <SortFilterControls v-if="currentPage?.title === 'Combinations'" />
        <CombinationsTableControls v-if="currentPage?.title === 'Combinations'" />
        <q-toolbar-title class="q-pa-lg title-font break-word">Impossible Creatures {{ currentPage?.title }} </q-toolbar-title>
        <TablePaginationControls v-if="currentPage?.title === 'Combinations'" />
        <DarkModeToggle />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import ModSelect from 'components/layouts/main/ModSelect.vue';
import SortFilterControls from '../components/combinations/SortFilterControls.vue';
import TablePaginationControls from '../components/combinations/TablePaginationControls.vue';
import CombinationsTableControls from '../components/combinations/TableDisplayControls.vue';
import DarkModeToggle from '../components/layouts/main/DarkModeToggle.vue';

const router = useRouter();
const showDrawer = ref(false);
const pages = ref<Page[]>([
  {title: 'Combinations', path: '/'},
  {title: 'Visualisations', path: '/visualisations'},
  {title: 'About', path: '/about'}
]);

interface Page {
  title: string;
  path: string;
}

const currentPage = ref<Page | undefined>(pages.value.find(page => page.path === router.currentRoute.value.path));

const navigateTo = (page: Page) => {
  currentPage.value = page;
  showDrawer.value = false;
  router.push(page.path);
};
</script>

<style lang="sass" scoped></style>
