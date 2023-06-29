<script lang="ts" setup>
import LayoutHeaderProfileButton from '@/components/layout/LayoutHeaderProfileButton.vue'
import {useUserStore} from '@/stores/useUserStore'
import {useI18n} from 'vue-i18n'

const userStore = useUserStore()
const {t} = useI18n()
</script>

<template>
    <nav
            :aria-label="t('primary-nav')"
            class="flex-row-center"
            role="navigation"
    >
        <RouterLink :to="{name: 'Home'}">{{ t('header.home') }}</RouterLink>
        <RouterLink
                :to="{name: 'Charter'}"
                class="space-2"
        >
            {{ t('header.charter') }}
        </RouterLink>
        <RouterLink
                :to="{name: 'Associations'}"
                class="space-1"
        >
            {{ t('header.associations') }}
        </RouterLink>
        <RouterLink
                :to="{name: 'Commission'}"
                class="space-3"
        >
            {{ t('header.commission') }}
        </RouterLink>
        <RouterLink
                v-if="!userStore.isAuth"
                :to="{name: 'Login'}"
        >
            {{ t('header.login') }}
        </RouterLink>
        <LayoutHeaderProfileButton
                v-if="userStore.isAuth"
                class="profile-button"
        />
    </nav>
</template>

<style lang="scss">
@import '@/assets/styles/header.scss';
</style>
