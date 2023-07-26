<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import useSecurity from '@/composables/useSecurity'

const {t} = useI18n()

const {newUser} = useSecurity()
</script>

<template>
    <div class="dashboard-section">
        <h2 class="flex-row-center">{{ t("register.register-success") }}</h2>
        <div class="dashboard-section-container">
            <div class="container">
                <div class="flex-column flex-center">
                    <p>{{ newUser.isCas ? t('register.registration-ok-cas') : t('register.registration-ok') }}</p>
                    <RouterLink :to="{name: 'Home'}">{{ t("register.back-to-home") }}</RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/dashboard.scss';
</style>
