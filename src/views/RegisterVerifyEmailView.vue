<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRoute} from 'vue-router'
import useSecurity from '@/composables/useSecurity'

const {verifyEmail} = useSecurity()
const route = useRoute()
const {t} = useI18n()
const messageTitle = ref<string>()
const messageDescription = ref<string>()

onMounted(async () => {
    if (route.query.key) {
        try {
            await verifyEmail(route.query.key as string)
            messageTitle.value = t('register.register-verify-email')
            messageDescription.value = t('register.email-verified')
        } catch (e) {
            messageTitle.value = t('register.register-not-verify-email')
            messageDescription.value = t('register.email-not-verified')
        }
    } else {
        messageTitle.value = t('register.register-not-verify-email')
        messageDescription.value = t('register.email-not-verified')
    }
})
</script>

<template>
    <div class="dashboard-section">
        <h2 class="flex-row-center">{{ messageTitle }}</h2>
        <div class="dashboard-section-container">
            <div class="container flex-column text-center">
                <p>{{ messageDescription }}</p>
                <RouterLink to="/">{{ t('register.back-to-home') }}</RouterLink>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/dashboard.scss';
</style>

