<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import _axios from '@/plugins/axios'
import router from '@/router'

const { notify } = useQuasar()
const route = useRoute()

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
