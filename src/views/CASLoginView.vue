<script lang="ts" setup>
import _axios from "@/plugins/axios";
import router from "@/router";
import {useUserStore} from "@/stores/useUserStore";
import {onMounted} from "vue";
import {useQuasar} from "quasar";
import {useRoute} from "vue-router";

const userStore = useUserStore()
const route = useRoute()
const {notify} = useQuasar()
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
      await router.push({name: 'Home'})
    } else {
      notify({
        message: 'Pas de ticket'
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
