<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useQuasar } from 'quasar'
import _axios from '@/plugins/axios'
import { useUserStore } from '@/stores/useUserStore'

const { notify } = useQuasar()

async function loadUser() {
  const access = localStorage.getItem('access')
  if (access) {
    const userStore = useUserStore()
    try {
      _axios.defaults.headers.common['Authorization'] = 'Bearer ' + access
      const response = await _axios.get(import.meta.env.VITE_APP_BASE_URL + '/users/auth/user/')
      userStore.user = response.data
    } catch (e) {
      if (e.response.status === 401) {
        try {
          const refreshResponse = await _axios.post(import.meta.env.VITE_APP_BASE_URL + '/users/auth/token/refresh/', {
            refresh: localStorage.getItem('refresh')
          })
          localStorage.setItem('access', refreshResponse.data.access)
          _axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('access')
          const responseAuth = await _axios.get(import.meta.env.VITE_APP_BASE_URL + '/users/auth/user/')
          userStore.user = responseAuth.data
        } catch (e) {
          userStore.logOut()
          notify({
            type: 'negative',
            message: 'Votre compte a été déconnecté, veuillez vous reconnecter.'
          })
        } 
      }
    }
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
