<script setup lang="ts">
import { useQuasar } from 'quasar'
import { RouterView } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'
import _axios from '@/plugins/axios'

const { notify } = useQuasar()

async function loadUser() {
  const access = localStorage.getItem('access')
  if (access) {
    const userStore = useUserStore()
    _axios.defaults.headers.common['Authorization'] = 'Bearer ' + access
    try {
      const response = await _axios.get(import.meta.env.VITE_APP_BASE_URL + '/users/auth/user/')
      // TODO : if user is validated
      userStore.user = response.data
    } catch (e) {
      if (e.response.status === 401) {
        try {
          const refreshResponse = await _axios.post(import.meta.env.VITE_APP_BASE_URL + '/users/auth/token/refresh/', {
            refresh: localStorage.getItem('refresh')
          })
          localStorage.setItem('access', refreshResponse.data.access)
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
