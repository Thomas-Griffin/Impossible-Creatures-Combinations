// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devServer: {port: 8080},
    devtools: {enabled: true},
    modules: ['nuxt-primevue', "@pinia/nuxt"],
    primevue: {
        cssLayerOrder: 'primevue'
    },
    css: ['primevue/resources/themes/aura-dark-noir/theme.css'],
})