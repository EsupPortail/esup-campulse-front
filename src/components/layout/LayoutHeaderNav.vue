<script lang="ts" setup>
import LayoutHeaderProfileButton from '@/components/layout/LayoutHeaderProfileButton.vue'
import {useUserStore} from '@/stores/useUserStore'

import {useI18n} from 'vue-i18n'

const {t} = useI18n()
const userStore = useUserStore()
</script>

<template>
    <nav>
        <RouterLink to="/">{{ t("header.home") }}</RouterLink>
        <RouterLink to="/charter">{{ t("header.charter") }}</RouterLink>
        <RouterLink to="/associations">{{ t("header.associations") }}</RouterLink>
        <RouterLink to="/commission">{{ t("header.commission") }}</RouterLink>
        <RouterLink v-if="!userStore.isAuth" to="/login">{{ t("header.login") }}</RouterLink>
        <LayoutHeaderProfileButton class="profile-button" v-if="userStore.isAuth"/>
    </nav>
</template>
