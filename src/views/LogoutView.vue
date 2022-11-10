<script setup lang="ts">
import {useUserStore} from '@/stores/useUserStore'
import {onMounted} from 'vue'
import router from '@/router'
import {useQuasar} from 'quasar'

const userStore = useUserStore()
const {notify} = useQuasar()

onMounted(async () => {
  userStore.logOut()
  await router.push({name: 'Home'})
  notify({
    message: 'Déconnection réussie'
  })
})
</script>

<template>
  <div></div>
</template>

<style>
</style>