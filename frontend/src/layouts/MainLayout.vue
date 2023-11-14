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
              <q-item-label class="cursive-font">
                {{ page.title }}
              </q-item-label>
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
          style="margin-right: 0.5%; margin-left: 0.15%"
          @click="showDrawer = !showDrawer"
        />

        <suspense>
          <mod-select />
        </suspense>

        <q-space />

        <div class="title-font">
          Impossible Creatures
        </div>

        <q-toolbar-title class="cursive-font">
          {{ currentPage.title }}
        </q-toolbar-title>

        <q-space />

        <q-toggle
          v-model="darkModeEnabled"
          checked-icon="dark_mode"
          class="text-left"
          unchecked-icon="light_mode"
          @update:model-value="toggleDarkMode"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue'
import { colors, getCssVar, setCssVar, useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import ModSelect from 'components/layouts/main/ModSelect.vue'
import { useModStore } from 'stores/modStore'

const modStore = useModStore()
const { lighten } = colors
const router = useRouter()
const $q = useQuasar()
const darkModeEnabled = ref(true)
const showDrawer = ref(false)
const pages = ref([
  { title: 'Combinations', path: '/' },
  { title: 'Visualisations', path: '/visualisations' },
  { title: 'About', path: '/about' },
])
const currentPage = ref(pages.value.find(page => page.path === router.currentRoute.value.path))

onBeforeMount(async () => {
  await modStore.getInitialMod()
})

const toggleDarkMode = () => {
  $q.dark.toggle()
  darkModeEnabled.value = $q.dark.isActive
  let primaryColor = $q.dark.isActive ? lighten(getCssVar('primary'), -50) : lighten(getCssVar('primary'), 50)
  setCssVar('primary', primaryColor)
}

const navigateTo = page => {
  currentPage.value = page
  showDrawer.value = false
  router.push(page.path)
}
</script>
