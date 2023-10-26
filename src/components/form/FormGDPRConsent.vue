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
            :aria-label="t('forms.gdpr-accept')"
            :label="t('forms.gdpr-accept')"
            :model-value="props.hasConsent"
            color="dashboard"
            data-test="legal-notice-checkbox"
            @click="$emit('updateConsent')"
        />
    </div>
    <div class="legal-links">
        <!--<RouterLink :to="{ name: 'LegalNotice' }">{{ t('breadcrumbs.legal-notice') }}</RouterLink><br>-->
        <RouterLink :to="{ name: 'PrivacyPolicy' }">{{ t('breadcrumbs.privacy-policy') }}</RouterLink>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';

.legal-links a {
    color: $dashboardColor;
    margin-left: 4rem;
}
</style>
