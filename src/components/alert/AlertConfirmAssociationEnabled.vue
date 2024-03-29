<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useQuasar} from 'quasar'

const {t} = useI18n()
const associationStore = useAssociationStore()
const {notify} = useQuasar()

const emit = defineEmits(['hasValidated'])

const isEnabled = ref<boolean>(false)
watch(() => associationStore.association, () => {
    isEnabled.value = associationStore.association?.isEnabled as boolean
})

const openAlert = ref<boolean>(false)

onMounted(() => {
    isEnabled.value = associationStore.association?.isEnabled as boolean
})


async function onEnableAssociation() {
    let positiveMessage = t('notifications.positive.enable-association')
    let negativeMessage = t('notifications.negative.enable-association-error')
    if (isEnabled.value) {
        positiveMessage = t('notifications.positive.disable-association')
        negativeMessage = t('notifications.negative.disable-association-error')
    }
    try {
        await associationStore.patchEnabledAssociation(!isEnabled.value as boolean, associationStore.association?.id)
        emit('hasValidated')
        notify({
            type: 'positive',
            message: positiveMessage
        })
    } catch (e) {
        notify({
            type: 'negative',
            message: negativeMessage
        })
    }
}
</script>

<template>
    <QBtn
        :color="isEnabled ? 'custom-red' : 'association'"
        :icon="isEnabled ? 'bi-ban' : 'bi-check-lg'"
        :label="isEnabled ? t('association.disable-association') : t('association.enable-association')"
        class="btn-lg"
        @click="openAlert = true"
    />

    <QDialog
        v-model="openAlert"
        persistent
    >
        <QCard>
            <QCardSection class="row items-center">
                <p class="q-ml-sm">
                    {{
                        isEnabled ? t('association.confirm-disable') : t('association.confirm-enable')
                    }}
                </p>
                <div class="flex-row padding-top">
                    <QBtn
                        v-close-popup
                        :label="t('cancel')"
                        class="btn-lg"
                        color="association"
                        icon="bi-x-lg"
                    />
                    <QBtn
                        v-close-popup
                        :color="isEnabled ? 'custom-red' : 'association'"
                        :icon="isEnabled ? 'bi-ban' : 'bi-check-lg'"
                        :label="isEnabled ? t('association.disable-association') : t('association.enable-association')"
                        class="btn-lg"
                        @click="onEnableAssociation"
                    />
                </div>
            </QCardSection>
        </QCard>
    </QDialog>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.scss';
</style>
