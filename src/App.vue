<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'
import _axios from '@/plugins/axios'


async function loadUser() {
  const access = localStorage.getItem('access')
  if (access) {
    const userStore = useUserStore()
    _axios.defaults.headers.common['Authorization'] = 'Bearer ' + access
    const response = await _axios.get(import.meta.env.VITE_APP_BASE_URL + '/users/auth/user/')
    // TODO : if user is validated
    userStore.user = response.data
  }
}
loadUser()

</script>

<template>
  <router-view/>
</template>

<style lang="sass">
/* @import "@/assets/base.css" */

#app
  font-family: "Unistra A", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif

h1
  text-align: center
</style>
