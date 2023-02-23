<script lang="ts" setup>
import LayoutHeaderProfileButton from '@/components/layout/LayoutHeaderProfileButton.vue'
import {useUserStore} from '@/stores/useUserStore'
import {useI18n} from 'vue-i18n'

const userStore = useUserStore()
const {t} = useI18n()
</script>

<template>
    <nav aria-label="primary">
        <RouterLink to="/">{{ t("header.home") }}</RouterLink>
        <RouterLink class="space-2" to="/charter">{{ t("header.charter") }}</RouterLink>
        <RouterLink class="space-1" to="/associations">{{ t("header.associations") }}</RouterLink>
        <RouterLink class="space-3" to="/commission">{{ t("header.commission") }}</RouterLink>
        <RouterLink v-if="!userStore.isAuth" to="/login">{{ t("header.login") }}</RouterLink>
        <LayoutHeaderProfileButton v-if="userStore.isAuth" class="profile-button"/>
    </nav>
</template>
