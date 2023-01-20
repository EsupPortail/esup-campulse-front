<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import router from '@/router'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useQuasar} from 'quasar'

const {t} = useI18n()
const changes = ref<boolean>(false)
const associationStore = useAssociationStore()
const {notify} = useQuasar()

async function onChangesAssociations() {
  try {
    // await associationStore.patchEnabledAssociation(isEnabled)
    await router.push({name: 'ManageAssociations'})
    notify({
      type: 'positive',
      message: t('notifications.positive.change-associations')
    })
  } catch (e) {
    notify({
      type: 'negative',
      message: t('notifications.negative.change-associations-error')
    })
  }
}
</script>

<template>
    <QBtn
        :label="t('association.validate-all-changes')"
        color="primary"
        icon="mdi-pencil"
        @click="changes = true"
    />

    <QDialog v-model="changes" persistent>
        <QCard>
            <QCardSection class="row items-center">
                <span class="q-ml-sm">{{ t("association.confirm-changes") }}</span>
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
                    :label="t('association.validate-all-changes')"
                    color="primary"
                    icon="mdi-pencil"
                    @click="onChangesAssociations()"
                />
            </QCardActions>
        </QCard>
    </QDialog>
</template>
