<script>
import Cookies from 'js-cookie';

export default {
  async mounted() {
    console.log(21);
    useUserStore().getUser()

    const test = await $fetch('/api/account/token', {
      method: "post",
      body: {
        token: Cookies.get("token")
      }
    })
    console.log(test);
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
