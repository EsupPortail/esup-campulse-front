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
            <QCardSection class="row items-center">
                <p class="paragraph">{{ props.text }}</p>
            </QCardSection>

            <QCardActions align="right">
                <QBtn
                    v-close-popup
                    :label="t('cancel')"
                    color="secondary"
                    icon="bi-x-lg"
                    @click="$emit('closeAlert')"
                />
                <QBtn
                    v-close-popup
                    :label="t('discard-changes')"
                    color="delete"
                    icon="bi-box-arrow-left"
                    @click="$emit('leaveEdition')"
                />
            </QCardActions>
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
