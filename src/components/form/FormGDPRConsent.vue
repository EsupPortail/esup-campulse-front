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
                @click="$emit('updateConsent')"
            />
        </div>
    </fieldset>
</template>


