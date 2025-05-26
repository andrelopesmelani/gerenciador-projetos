// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxt/icon", "@nuxt/fonts", "@nuxt/image", "@pinia/nuxt"],
  css: ["@/assets/scss/main.scss"],
  components: true,
});
