<script lang="ts" setup>
import FormProfilePasswordEdit from '@/components/form/FormProfilePasswordEdit.vue'
import { useI18n } from "vue-i18n";

const { t } = useI18n()
</script>

<template>
  <h1>{{ t("password.edit-password") }}</h1>
  <FormProfilePasswordEdit />
</template>

<style lang="sass" scoped>

</style>
