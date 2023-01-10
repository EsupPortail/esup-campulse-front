<script lang="ts" setup>
import {useUserStore} from '@/stores/useUserStore'
import {useI18n} from 'vue-i18n'

const userStore = useUserStore()
const {t} = useI18n()
</script>

<template>
    <h1>{{ t("home.dashboard") }}</h1>
    <p class="welcome-msg">
        {{ t('dashboard.welcome-message') + ', ' + userStore.userName }}
    </p>
    <section>
        <h2>
            <QIcon name="mdi-card-account-details-outline"/>
            {{ t('dashboard.manage-my-account') }}
        </h2>
        <QBtn
            :label="t('password.edit-password')"
            :to="{name: 'PasswordEdit'}"
            color="secondary"
        />
    </section>
    <section v-if="userStore.isUniManager">
        <h2>
            <QIcon name="mdi-format-list-bulleted-square"/>
            {{ t('dashboard.manage-association-directory') }}
        </h2>
        <QBtn
            :label="t('dashboard.edit-or-delete-association')"
            :to="{name: 'ManageAssociations'}"
            color="secondary"
        />
        <QBtn
            :label="t('dashboard.create-association')"
            :to="{name: 'CreateAssociation'}"
            color="secondary"
        />
    </section>
    <section v-if="userStore.user?.associations.length > 0">
        <h2>
            <QIcon name="mdi-pencil-box-outline"/>
            {{ t('dashboard.association-user.manage-my-associations') }}
        </h2>
        <QBtn
            :label="t('dashboard.association-user.edit-my-associations')"
            :to="{name: 'ManageAssociations'}"
            color="secondary"
        />
    </section>
    <section v-if="userStore.managerGroup">
        <h2>
            <QIcon name="mdi-account-group"/>
            {{ t('dashboard.manage-users') }}
        </h2>
        <QBtn
            :label="t('dashboard.user-validation')"
            :to="{name: 'ValidateUsers'}"
            color="secondary"
        />
        <QBtn
            :label="t('dashboard.user-management')"
            :to="{name: 'ManageUsers'}"
            color="secondary"
        />
    </section>
</template>

<style lang="sass" scoped>
section
    display: flex
    flex-direction: column
    gap: 10px

    .q-btn
        max-width: 40em
        width: 100%
        display: block
        margin: auto

h2
    background-color: $primary
    color: #fff
    font-size: 2em
    text-align: center

.welcome-msg
    font-size: 2em
    text-align: center
</style>
