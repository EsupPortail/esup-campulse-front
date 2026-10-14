<script lang="ts" setup>
import {useI18n} from 'vue-i18n'

const {t} = useI18n()

defineProps({
  hasConsent: Boolean
})
</script>

<template>
  <div>
    <QCheckbox
      :aria-label="t('forms.gdpr-consent')"
      :label="t('forms.gdpr-consent')"
      :model-value="hasConsent"
      color="dashboard"
      @click="$emit('updateConsent')"
    />
  </div>
  <div class="legal-links">
    <RouterLink :to="{ name: 'PrivacyPolicy' }">{{ t('breadcrumbs.privacy-policy') }}</RouterLink>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/variables';

.legal-links a {
  color: $dashboardColor;
  margin-left: 4rem;
}
</style>
