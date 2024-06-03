<template>
    <AppHeader />
    <slot />
    <AppFooter />
</template>
<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
</script>