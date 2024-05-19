// https://nuxt.com/docs/api/configuration/nuxt-config
import dotenv from "dotenv";

dotenv.config();

export default defineNuxtConfig({
  devServer: { port: 8080 },
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  modules: ["nuxt-primevue", "@pinia/nuxt", "nuxt-plotly"],
  vite: {
    optimizeDeps: {
      include: ["plotly.js-dist-min"],
    },
  },
  primevue: {
    cssLayerOrder: "primevue",
  },
  css: ["primevue/resources/themes/aura-dark-noir/theme.css"],
});
