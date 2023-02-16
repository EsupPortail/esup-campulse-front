<script lang="ts" setup>
import LayoutHeaderProfileButton from '@/components/layout/LayoutHeaderProfileButton.vue'
import {useUserStore} from '@/stores/useUserStore'
import {useI18n} from 'vue-i18n'

const userStore = useUserStore()
const {t} = useI18n()
</script>

<template>
    <nav aria-label=’primary’>
        <RouterLink to="/">{{ t("header.home") }}</RouterLink>
        <RouterLink to="/charter">{{ t("header.charter") }}</RouterLink>
        <RouterLink to="/associations">{{ t("header.associations") }}</RouterLink>
        <RouterLink to="/commission">{{ t("header.commission") }}</RouterLink>
        <RouterLink v-if="!userStore.isAuth" to="/login">{{ t("header.login") }}
        </RouterLink>
        <LayoutHeaderProfileButton v-if="userStore.isAuth"/>
    </nav>
</template>

<style lang="sass" scoped>
nav
    display: flex
    justify-content: flex-end

nav > *
    color: white
    padding: 0.3em
    text-decoration: none
    font-size: 1.8em

nav > *:hover
    background-color: rgba(255, 255, 255, 0.3)

</style>
