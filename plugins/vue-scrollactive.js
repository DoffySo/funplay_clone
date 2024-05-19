import { defineNuxtPlugin } from '#app'
import VueScrollactive from 'vue-scrollactive'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(VueScrollactive)
})
