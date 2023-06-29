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
    const messageKeyword = isEnabled.value ? 'disable' : 'enable'
    try {
        await associationStore.patchEnabledAssociation(!isEnabled.value as boolean, associationStore.association?.id)
        emit('hasValidated')
        notify({
            type: 'positive',
            message: t(`notifications.positive.${messageKeyword}-association`)
        })
    } catch (e) {
        notify({
            type: 'negative',
            message: t(`notifications.negative.${messageKeyword}-association-error`)
        })
    }
}
</script>

<template>
    <QBtn
        :color="isEnabled ? 'red' : 'dashboard'"
        :icon="isEnabled ? 'bi-unlock' : 'bi-lock'"
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
                <span class="q-ml-sm">{{
                    isEnabled ? t('association.confirm-disable') : t('association.confirm-enable')
                }}</span>
            </QCardSection>

            <QCardActions align="right">
                <div class="flex-row">
                    <QBtn
                        v-close-popup
                        :label="t('cancel')"
                        class="btn-lg"
                        color="dashboard"
                        icon="bi-x-lg"
                    />
                    <QBtn
                        v-close-popup
                        :color="isEnabled ? 'red' : 'dashboard'"
                        :icon="isEnabled ? 'bi-unlock' : 'bi-lock'"
                        :label="isEnabled ? t('association.disable-association') : t('association.enable-association')"
                        class="btn-lg"
                        @click="onEnableAssociation"
                    />
                </div>
            </QCardActions>
        </QCard>
    </QDialog>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.scss';
</style>
