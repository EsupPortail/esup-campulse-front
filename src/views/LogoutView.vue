<script lang="ts" setup>
import {onMounted} from 'vue'
import {useQuasar} from 'quasar'
import router from '@/router'
import {useI18n} from 'vue-i18n'
import {useUserStore} from '@/stores/useUserStore'

const {loading, notify} = useQuasar()
const {t} = useI18n()
const userStore = useUserStore()

onMounted(async () => {
    loading.show()
    await router.push({name: 'Login'})
    await userStore.logOut()
    notify({
        type: 'negative',
        message: t('notifications.negative.automatic-logout')
    })
    loading.hide()
})
</script>

<template>
    <div></div>
</template>