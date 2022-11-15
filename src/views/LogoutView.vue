<script setup lang="ts">
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import router from '@/router'
import { useUserStore } from '@/stores/useUserStore'

const { notify } = useQuasar()
const userStore = useUserStore()

onMounted(async () => {
  userStore.logOut()
  await router.push({ name: 'Home' })
  notify({
    type: 'positive',
    message: 'Déconnexion réussie.'
  })
})
</script>

<template>
  <div></div>
</template>

<style scoped lang="sass">

</style>
