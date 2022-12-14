<script lang="ts" setup>
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
                :label="$t('forms.gdpr')"
                :model-value="props.hasConsent"
                @click="$emit('updateConsent')"
            />
        </div>
    </fieldset>
</template>

<style lang="sass" scoped>
legend
    font-size: 1.5em
</style>