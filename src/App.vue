<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useQuasar } from 'quasar'
import { useUserStore } from '@/stores/useUserStore'
import axios from "axios";
import { refreshToken } from "@/services/userService";


const { notify } = useQuasar()

async function loadUser() {
  const access = localStorage.getItem('access')
  if (access) {
    const userStore = useUserStore()
    try {
      await userStore.loadUser()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          try {
            await refreshToken()
            await userStore.loadUser()
          } catch (e) {
            await userStore.logOut()
            notify({
              type: 'negative',
              message: 'Votre compte a été déconnecté, veuillez vous reconnecter.'
            })
          }
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
