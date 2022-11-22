<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import router from '@/router'
import { useUserStore } from '@/stores/useUserStore'

const { t } = useI18n()
const { notify } = useQuasar()
const userStore = useUserStore()

onMounted(async () => {
  await userStore.logOut()
  await router.push({ name: 'Home' })
  notify({
    type: 'positive',
    message: t('notifications.positive.logout-success')
  })
})
</script>

<template>
  <div></div>
</template>

<style scoped lang="sass">

</style>
