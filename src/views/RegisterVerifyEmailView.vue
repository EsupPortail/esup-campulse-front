<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import router from '@/router'
import * as userService from '@/services/userService'

const { t } = useI18n()
const { notify } = useQuasar()
const route = useRoute()

onMounted(async () => {
  if (route.query.key) {
    try {
      await userService.verifyEmail(route.query.key as string)
      notify({
        type: 'positive',
        message: t('notifications.positive.registration-ok')
      })
    } catch (e) {
      notify({
        type: 'negative',
        message: t('notifications.negative.invalid-token')
      })
    }
  } else {
    notify({
      type: 'negative',
      message: t('notifications.negative.invalid-request')
    })
  }
  await router.push({ name: 'Home' })
})
</script>

<template>
  <div></div>
</template>

<style scoped lang="sass">

</style>
