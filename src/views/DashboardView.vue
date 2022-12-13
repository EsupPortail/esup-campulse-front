<script lang="ts" setup>
import {useUserStore} from '@/stores/useUserStore'
import {useI18n} from "vue-i18n";

const userStore = useUserStore()
const {t} = useI18n()
</script>

<template>
    <h1>{{ t("home.dashboard") }}</h1>
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
    </section>
</template>

<style lang="sass" scoped>
section
    display: flex
    gap: 20px
</style>
