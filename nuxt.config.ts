// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js'
        }
      ]
    }
  },
  runtimeConfig: {
    mongoUrl: process.env.MONGO_URL,
  },
  nitro: {
    plugins: [
        "@/server/database/connection.js",
    ],
  },
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@bootstrap-vue-next/nuxt'
  ],
  watch: [
    '@/stores/**',
  ],
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    '@/public/style.css'
  ],
  
})
