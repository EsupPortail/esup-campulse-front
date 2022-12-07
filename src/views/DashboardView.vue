<script setup lang="ts">
import {useUserStore} from '@/stores/useUserStore'
const userStore = useUserStore()
</script>

<template>
  <h1>{{ $t("home.dashboard") }}</h1>
  <QBtn :label="$t('password.edit-password')" color="secondary" to="/profile-password-edit" />
  <QBtn v-if="userStore.managerGroup" :label="$t('manager.users')" color="secondary" to="/users" />
</template>

<style>
</style>
