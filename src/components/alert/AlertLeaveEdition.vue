<script lang="ts" setup>
import {useI18n} from 'vue-i18n'

const {t} = useI18n()

const props = defineProps({
    openAlert: Boolean,
    text: String
})
</script>

<template>
    <QDialog
        :model-value="props.openAlert"
        persistent
    >
        <QCard class="variant-space-4">
            <QCardSection>
                <p>{{ props.text }}</p>
                <div class="flex-row padding-top align-items-stretch">
                    <QBtn
                        v-close-popup
                        :label="t('cancel')"
                        class="btn-lg"
                        color="dashboard"
                        icon="bi-x-lg"
                        @click="$emit('closeAlert')"
                    />
                    <QBtn
                        v-close-popup
                        :label="t('discard-changes')"
                        class="btn-lg"
                        color="custom-red"
                        icon="bi-box-arrow-left"
                        @click="$emit('leaveEdition')"
                    />
                </div>
            </QCardSection>
        </QCard>
    </QDialog>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';

.q-card {
    padding: 1rem
}
</style>
