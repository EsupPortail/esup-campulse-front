<script setup lang="ts">
const props = defineProps({
  hasConsent: Boolean
})
</script>

<template>
  <fieldset>
    <legend>
      {{ $t('forms.gdpr-title') }}
    </legend>
    <div class="gdpr-consent">
      <QCheckbox
          :model-value="props.hasConsent"
          @click="$emit('updateConsent')"
      />
      <p>{{ $t('forms.gdpr') }}</p>
    </div>
  </fieldset>
</template>

<style scoped lang="sass">
.gdpr-consent
  display: flex
  gap: 5px
  align-items: flex-start
  padding-top: 10px

legend
  font-size: 1.5em
</style>