<script>
import Cookies from 'js-cookie';
import { useUserStore } from './stores/user';
import { useCategoriesStore } from './stores/lots';

export default {
  data() {
    return {
    }
  },
  methods: {
  },
  async mounted() {
    useUserStore()
    useCategoriesStore()
  },
  setup() {
    useSeoMeta({
      title: 'FunPay — Marketplace for Gamers',
      ogTitle: 'FunPay — Marketplace for Gamers',
      description: 'On the secure FunPay marketplace, you can buy game currencies, accounts, items, skins and boosting services. Gamers can also place these for sale.',
      ogDescription: 'On the secure FunPay marketplace, you can buy game currencies, accounts, items, skins and boosting services. Gamers can also place these for sale.',
    })
  }
}
</script>


<template>
<div class="wrapper">
    <div class="wrapper-content">
      <Header />
      <NuxtPage />
    </div>
  </div>
</template>
