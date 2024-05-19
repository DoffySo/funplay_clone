<script>
import Cookies from 'js-cookie';
import { useUserStore } from './stores/user';

export default {
  data() {
    return {
      modal: true,
    }
  },
  methods: {
    handleModal() {
      console.log("CLICKED OK!!")
    }
  },
  async mounted() {
    useUserStore()
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
