<script lang="ts" setup>
import {useI18n} from "vue-i18n";

const {t} = useI18n()
</script>

<template>
  <h1>{{ t("register.register-verify-email") }}</h1>
  <div>
    <p>{{ t("register.email-verified") }}</p>
    <RouterLink to="/">{{ t("register.back-to-home") }}</RouterLink>
  </div>
</template>

<style lang="sass" scoped>
div
  text-align: center
</style>
