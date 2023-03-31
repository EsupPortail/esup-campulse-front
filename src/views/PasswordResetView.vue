<script lang="ts" setup>
import FormPassWordReset from '@/components/form/FormPasswordReset.vue'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
</script>

<template>
    <h1>{{ t("password.reset-password") }}</h1>
    <FormPassWordReset />
</template>
