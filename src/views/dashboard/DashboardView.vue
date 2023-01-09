<script lang="ts" setup>
import {useUserStore} from '@/stores/useUserStore'
import {useI18n} from 'vue-i18n'

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
            :to="{name: 'PasswordEdit'}"
            color="secondary"
        />
        <QBtn
            v-if="userStore.managerGroup"
            :label="t('dashboard.user-validation')"
            :to="{name: 'ValidateUsers'}"
            color="secondary"
        />
        <QBtn
            v-if="userStore.managerGroup"
            :label="t('dashboard.user-management')"
            :to="{name: 'ManageUsers'}"
            color="secondary"
        />
        <QBtn
            v-if="userStore.isUniManager"
            :label="t('dashboard.create-association')"
            :to="{name: 'AssociationCreate'}"
            color="secondary"
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
