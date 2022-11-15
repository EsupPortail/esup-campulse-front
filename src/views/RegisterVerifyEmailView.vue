<script setup lang="ts">
import router from "@/router";
import _axios from '@/plugins/axios'
import {onMounted} from "vue";
import {useQuasar} from "quasar";
import {useRoute} from "vue-router";

const route = useRoute()
const {notify} = useQuasar()
onMounted(async () => {
  if (route.query.key) {
    try {
      await _axios.post('/users/auth/registration/verify-email/', {key: route.query.key})
      notify({
        type: 'positive',
        message: 'Votre adresse email est confirmée. Votre compte sera bientôt vérifié par l\'équipe d\'administation.'
      })
    } catch (e) {
      notify({
        type: 'negative',
        message: 'Jeton invalide.'
      })
    }
  } else {
    notify({
      type: 'negative',
      message: 'Requête invalide.'
    })
  }
  await router.push({name: 'Home'})
})
</script>

<template>
  <div></div>
</template>

<style scoped lang="sass">

</style>
