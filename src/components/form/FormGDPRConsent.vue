<script lang="ts" setup>
import {useI18n} from 'vue-i18n'

const {t} = useI18n()

const props = defineProps({
    hasConsent: Boolean
})
</script>

<template>
    <div>
        <QCheckbox
            :label="t('forms.gdpr-accept')"
            :model-value="props.hasConsent"
            aria-label="t('forms.gdpr-accept')"
            color="dashboard"
            @click="$emit('updateConsent')"
        />
    </div>
    <div>
        <RouterLink :to="{ name: 'LegalNotice' }">{{ t('breadcrumbs.legal-notice') }}</RouterLink><br>
        <RouterLink :to="{ name: 'PrivacyPolicy' }">{{ t('breadcrumbs.privacy-policy') }}</RouterLink>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
</style>
