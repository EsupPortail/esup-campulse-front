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
    <h1>{{ messageTitle }}</h1>
    <div>
        <p>{{ messageDescription }}</p>
        <RouterLink to="/">{{ t("register.back-to-home") }}</RouterLink>
    </div>
</template>

<style lang="sass" scoped>
div
    text-align: center
</style>
