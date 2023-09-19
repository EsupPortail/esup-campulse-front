<script lang="ts" setup>
import {onMounted} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRoute} from 'vue-router'
import {useQuasar} from 'quasar'
import {useUserStore} from '@/stores/useUserStore'
import router from '@/router'
import axios from 'axios'
import useErrors from '@/composables/useErrors'

const {t} = useI18n()
const {notify} = useQuasar()
const route = useRoute()
const userStore = useUserStore()
const {catchHTTPError} = useErrors()

onMounted(async () => {
    try {
        if (route.query.ticket) {
            await userStore.logIn('/users/auth/cas/login/', {
                ticket: route.query.ticket as string,
                service: import.meta.env.VITE_APP_FRONT_URL + '/cas-login'
            })
            await router.push({name: 'Dashboard'})
            notify({
                type: 'positive',
                message: t('notifications.positive.login-success')
            })
        } else {
            notify({
                type: 'negative',
                message: t('notifications.negative.no-ticket')
            })
        }
    } catch (error) {
        await router.push({name: 'Login'})
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
})
</script>

<template>
    <div></div>
</template>
