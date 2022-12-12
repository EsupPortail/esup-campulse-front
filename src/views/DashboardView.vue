<script lang="ts" setup>
import {useUserStore} from '@/stores/useUserStore'
import {useI18n} from "vue-i18n";

const userStore = useUserStore()
const {t} = useI18n()
</script>

<template>
  <h1>{{ t("home.dashboard") }}</h1>
  <QBtn :label="t('password.edit-password')" color="secondary" to="/profile-password-edit"/>
  <QBtn v-if="userStore.managerGroup" :label="t('manager.users')" color="secondary" to="/users"/>
  <QBtn :label="t('association.create')" color="secondary" to="/association/create"/>

</template>

<style>
</style>
