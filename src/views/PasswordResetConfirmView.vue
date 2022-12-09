<script lang="ts" setup>
import FormPasswordResetConfirm from '@/components/form/FormPasswordResetConfirm.vue'
import {useI18n} from "vue-i18n";

const {t} = useI18n()
</script>

<template>
  <h1>{{ t("password.new-password") }}</h1>
  <FormPasswordResetConfirm/>
</template>

<style lang="sass" scoped>

</style>
