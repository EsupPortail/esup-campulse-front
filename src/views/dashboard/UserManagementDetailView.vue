<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import FormManagedUserUpdate from "@/components/form/FormManagedUserUpdate.vue";

const {t} = useI18n()

</script>

<template>
    <h1>{{ t('user-manager.manage-account') }}</h1>
    <FormManagedUserUpdate/>
</template>

<style lang="sass" scoped>

</style>