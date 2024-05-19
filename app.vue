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
