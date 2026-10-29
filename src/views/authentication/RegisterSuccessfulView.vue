<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import useSecurity from '@/composables/useAuthentication'
import {onUnmounted} from 'vue'
import {useProfileStore} from '@/stores/useProfileStore'

const {t} = useI18n()

const {newUser} = useSecurity()
const profileStore = useProfileStore()

onUnmounted(() => {
  profileStore.unloadNewProfile()
  newUser.isCas = false
  newUser.firstName = ''
  newUser.lastName = ''
  newUser.username = ''
  newUser.email = ''
  newUser.phone = ''
})
</script>

<template>
  <div class="dashboard-section">
    <h2 class="flex-row-center">{{ t('register.register-success') }}</h2>
    <div class="dashboard-section-container">
      <div class="container">
        <div class="flex-column flex-center">
          <p>{{ newUser.isCas ? t('register.registration-ok-cas') : t('register.registration-ok') }}</p>
          <RouterLink :to="{name: 'Home'}">{{ t('register.back-to-home') }}</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/dashboard';
</style>
