<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import router from '@/router'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useQuasar} from 'quasar'

const {t} = useI18n()
const enable = ref<boolean>(false)
const disable = ref<boolean>(false)
const associationStore = useAssociationStore()
const {notify} = useQuasar()

async function onEnableAssociation(isEnabled: boolean) {
  const messageKeyword = isEnabled ? 'enable' : 'disable'
  try {
    await associationStore.patchEnabledAssociation(isEnabled)
    await router.push({name: 'ManageAssociations'})
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
        v-if="!associationStore.association.isEnabled"
        :label="t('association.enable-association')"
        color="green"
        icon="mdi-eye-check"
        @click="enable = true"
    />
    <QBtn
        v-if="associationStore.association.isEnabled"
        :label="t('association.disable-association')"
        color="orange"
        icon="mdi-eye-remove"
        @click="disable = true"
    />

    <QDialog v-model="enable" persistent>
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
                    @click="onEnableAssociation(true)"
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
                    @click="onEnableAssociation(false)"
                />
            </QCardActions>
        </QCard>
    </QDialog>
</template>
