<script setup lang="ts">
import { useUserStore } from '@/stores/useUserStore'
import { ref } from 'vue'

const userStore = useUserStore()
const newUser = userStore.newUser

const isCas = ref<boolean | undefined>(newUser?.isCas)
</script>

<template>
  <QDialog v-model="isCas" persistent>
    <QCard>
      <QCardSection class="row no-wrap">
        <QIcon name="mdi-information-outline" color="negative" size="md" />
        <span class="q-ml-sm">{{ $t('alerts.aborted-cas-registration.message') }}</span>
      </QCardSection>
      <QCardActions align="right">
        <QBtn flat :label="$t('alerts.close')" color="primary" v-close-popup />
        <QBtn :label="$t('alerts.aborted-cas-registration.button')" color="primary" v-close-popup to="/register" />
      </QCardActions>
    </QCard>
  </QDialog>
</template>

<style scoped lang="sass">

</style>