<script lang="ts" setup>
import {useUserStore} from '@/stores/useUserStore'
import {useI18n} from "vue-i18n";

const userStore = useUserStore()
const {t} = useI18n()
</script>

<template>
  <h1>{{ t("home.dashboard") }}</h1>
  <p class="welcome-msg">
    {{ t('dashboard.welcome-message') + ', ' + userStore.userName }}</p>
  <section>
    <QBtn
        :label="t('password.edit-password')"
        color="secondary"
        to="/dashboard/password-edit"
    />
    <QBtn
        v-if="userStore.managerGroup"
        :label="t('dashboard.user-validation')"
        color="secondary"
        to="/dashboard/validate-users"
    />
    <QBtn
        v-if="userStore.managerGroup"
        :label="t('dashboard.user-management')"
        color="secondary"
        to="/dashboard/manage-users"
    />
    <QBtn
        v-if="userStore.isUniManager"
        :label="t('dashboard.create-association')"
        color="secondary"
        to="/dashboard/association/association-create"
    />
  </section>
</template>

<style lang="sass" scoped>
section
  display: flex
  gap: 20px

.welcome-msg
  font-size: 2em
</style>
