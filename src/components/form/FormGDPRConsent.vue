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
            :label="t('forms.gdpr')"
            :model-value="props.hasConsent"
            aria-label="t('forms.gdpr')"
            color="dashboard"
            @click="$emit('updateConsent')"
        />
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
</style>
