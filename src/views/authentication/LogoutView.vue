<script lang="ts" setup>
import {onMounted} from 'vue'
import {useQuasar} from 'quasar'
import router from '@/router'
import {useI18n} from 'vue-i18n'
import {useProfileStore} from '@/stores/useProfileStore'

const {loading, notify} = useQuasar()
const {t} = useI18n()
const profileStore = useProfileStore()

onMounted(async () => {
  loading.show()
  profileStore.logOut()
  await router.push({name: 'Login'})
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