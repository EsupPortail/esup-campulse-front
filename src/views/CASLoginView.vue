<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import router from "@/router";
import { useUserStore } from "@/stores/useUserStore";

const { notify } = useQuasar()
const route = useRoute()
const userStore = useUserStore()

onMounted(async () => {
  try {
    if (route.query.ticket) {
      await userStore.logIn(
          '/users/auth/cas/login/',
          {
            ticket: route.query.ticket as string,
            service: import.meta.env.VITE_APP_FRONT_URL + '/cas-login'
          }
      )
      await router.push({ name: 'Home' })
    } else {
      notify({
        message: 'Pas de ticket.'
      })
    }
  } catch (e) {
    notify({
      message: 'Erreur d\'authentification CAS.'
    })
  }
})
</script>

<template>
  <div></div>
</template>
