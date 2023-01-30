<script lang="ts" setup>
import FormManagedUserUpdate from '@/components/form/FormManagedUserUpdate.vue'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()

</script>

<template>
    <h1>{{ t('user-manager.manage-account') }}</h1>
    <FormManagedUserUpdate/>
</template>

