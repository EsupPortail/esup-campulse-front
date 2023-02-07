<script lang="ts" setup>
import {ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useQuasar} from 'quasar'

const {t} = useI18n()
const associationStore = useAssociationStore()
const {notify} = useQuasar()

const isEnabled = ref<boolean>(false)
watch(() => associationStore.association, () => {
    isEnabled.value = associationStore.association?.isEnabled as boolean
})

const openAlert = ref<boolean>(false)


async function onEnableAssociation() {
    const messageKeyword = isEnabled.value ? 'disable' : 'enable'
    try {
        await associationStore.patchEnabledAssociation(isEnabled.value as boolean, associationStore.association?.id)
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
        :color="isEnabled ? 'orange' : 'green'"
        :icon="isEnabled ? 'mdi-eye-remove' : 'mdi-eye-check'"
        :label="isEnabled ? t('association.disable-association') : t('association.enable-association')"
        @click="onEnableAssociation"
    />

    <QDialog v-model="openAlert" persistent>
        <QCard>
            <QCardSection class="row items-center">
                <span class="q-ml-sm">{{ t("association.confirm-enable") }}</span>
            </QCardSection>

            <QCardActions align="right">
                <QBtn
                    v-close-popup
                    :label="t('cancel')"
                    color="secondary"
                    icon="mdi-arrow-left-circle"
                />
                <QBtn
                    v-close-popup
                    :label="t('association.enable-association')"
                    color="green"
                    icon="mdi-eye-check"
                    @click="onEnableAssociation"
                />
            </QCardActions>
        </QCard>
    </QDialog>
    <QDialog v-model="disable" persistent>
        <QCard>
            <QCardSection class="row items-center">
                <span class="q-ml-sm">{{ t("association.confirm-disable") }}</span>
            </QCardSection>

            <QCardActions align="right">
                <QBtn
                    v-close-popup
                    :label="t('cancel')"
                    color="secondary"
                    icon="mdi-arrow-left-circle"
                />
                <QBtn
                    v-close-popup
                    :label="t('association.disable-association')"
                    color="orange"
                    icon="mdi-eye-remove"
                    @click="onEnableAssociation"
                />
            </QCardActions>
        </QCard>
    </QDialog>
</template>
