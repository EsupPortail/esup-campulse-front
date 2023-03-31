<script lang="ts" setup>
import FormResendEmail from '@/components/form/FormResendEmail.vue'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
</script>

<template>
  <h1>{{ t("register.register-resend") }}</h1>
  <FormResendEmail />
</template>
