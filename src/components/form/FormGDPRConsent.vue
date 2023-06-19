<script lang="ts" setup>
import {useI18n} from 'vue-i18n'

const {t} = useI18n()

const props = defineProps({
    hasConsent: Boolean
})
</script>

<template>
    <fieldset>
        <div>
            <QCheckbox
                :label="t('forms.gdpr')"
                :model-value="props.hasConsent"
                aria-label="t('forms.gdpr')"
                color="secondary"
                @click="$emit('updateConsent')"
            />
        </div>
    </fieldset>
</template>


