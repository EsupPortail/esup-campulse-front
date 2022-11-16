<script setup lang="ts">
import { onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"
import { useQuasar } from "quasar"
import router from "@/router"
import { useUserStore } from "@/stores/useUserStore"

const { t } = useI18n()
const { notify } = useQuasar()
const route = useRoute()
const userStore = useUserStore()

onMounted(async () => {
  try {
    if (route.query.ticket) {
      await userStore.logIn({ticket: route.query.ticket as string, service: import.meta.env.VITE_APP_FRONT_URL + '/cas-login'})
    } else {
      notify({
        type: 'negative',
        message: t('notifications.negative.no-ticket')
      })
    }
  } catch (e) {
    notify({
      type: 'negative',
      message: t('notifications.negative.cas-authentication-error')
    })
  }
})
</script>

<template>
  <div></div>
</template>
