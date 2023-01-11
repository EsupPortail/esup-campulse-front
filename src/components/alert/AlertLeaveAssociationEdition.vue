<script lang="ts" setup>
import {useI18n} from 'vue-i18n'

const {t} = useI18n()

const props = defineProps({
    openAlert: Boolean
})
</script>

<template>
    <QDialog
        :model-value="props.openAlert"
        persistent
    >
        <QCard>
            <QCardSection class="row items-center">
                <span class="q-ml-sm">{{ t("alerts.leave-association-edition.message") }}</span>
            </QCardSection>

            <QCardActions align="right">
                <QBtn
                    v-close-popup
                    :label="t('cancel')"
                    color="secondary"
                    icon="mdi-arrow-left-circle"
                    @click="$emit('closePopup')"
                />
                <QBtn
                    v-close-popup
                    :label="t('discard-changes')"
                    color="red"
                    icon="mdi-close-circle-outline"
                    @click="$emit('leaveEdition')"
                />
            </QCardActions>
        </QCard>
    </QDialog>
</template>

<style lang="sass">

</style>