<script setup lang="ts">
import { onMounted } from "vue"
import { useI18n } from "vue-i18n"
import { useRoute } from "vue-router"
import { useQuasar } from "quasar"
import { useUserStore } from "@/stores/useUserStore"
import router from '@/router'

const { t } = useI18n()
const { notify } = useQuasar()
const route = useRoute()
const userStore = useUserStore()

onMounted(async () => {
  try {
    if (route.query.ticket) {
      await userStore.logIn('/users/auth/cas/login/', {
        ticket: route.query.ticket as string,
        service: import.meta.env.VITE_APP_FRONT_URL + '/cas-login'
      })
    } else {
      notify({
        type: 'negative',
        message: t('notifications.negative.no-ticket')
      })
    }
  } catch (e) {
    await router.push({name: 'Login'})
    notify({
      type: 'negative',
      message: t('notifications.negative.cas-authentication-error')
    })
  }
})
    /*catch (error) {
      if (axios.isAxiosError(error)) {
        let errorMessage = null
        switch (error.response?.status) {
          // if registration is not completed
          case 400:
            errorMessage = 'Inscription non terminée'
            break
          default:
            errorMessage = t('notifications.negative.cas-authentication-error')
            break
        }
        notify({
          type: 'negative',
          message: errorMessage
        })
      }
      else {
        await router.push({name: 'Login'})
        notify({
          type: 'negative',
          message: t('notifications.negative.cas-authentication-error')
        })
      }
    }
})*/
</script>

<template>
  <div></div>
</template>
