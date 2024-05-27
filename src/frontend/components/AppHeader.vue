<template>
    <header id="app-header" :style="`background-image: url('/backgrounds/background-${darkMode}.png')`">
        <Menubar :model="menuItems">
            <template #end>
                <ModSelect />
                <DarkModeToggle />
            </template>
            <template #item="{item, props, hasSubmenu}">
                <router-link v-if="item.route" v-slot="{href, navigate}" :to="item.route" custom>
                    <a :href="href" v-bind="props.action" @click="navigate">
                        <span class="ml-2">{{ item.label }}</span>
                    </a>
                </router-link>
                <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                    <span class="ml-2">{{ item.label }}</span>
                    <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
                </a>
            </template>
        </Menubar>
    </header>
</template>

<script lang="ts" setup>
import useDisplayStore from '~store/displayStore'

const menuItems = ref([
    {
        label: 'Combinations',
        route: '/',
    },
    {
        label: 'Visualisations',
        route: '/visualisations',
    },
    {
        label: 'About',
        route: '/about',
    },
])

const displayStore = useDisplayStore()
const darkMode = computed(() => (displayStore.getDarkMode ? 'dark' : 'light'))
</script>
