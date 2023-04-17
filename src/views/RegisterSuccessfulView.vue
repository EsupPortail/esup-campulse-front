<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import useSecurity from '@/composables/useSecurity'

const {t} = useI18n()

const {newUser} = useSecurity()
</script>

<template>
    <h1>{{ t("register.register-success") }}</h1>
    <div>
        <p>{{ newUser.isCas ? t('register.registration-ok-cas') : t('register.registration-ok') }}</p>
        <RouterLink :to="{name: 'Home'}">{{ t("register.back-to-home") }}</RouterLink>
    </div>
</template>

<style lang="scss" scoped>
div {
    text-align: center;
}
</style>
