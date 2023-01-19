<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import router from '@/router'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useQuasar} from 'quasar'

const {t} = useI18n()
const confirm = ref<boolean>(false)
const associationStore = useAssociationStore()
const {notify} = useQuasar()

async function onDeleteAssociation() {
  try {
    await associationStore.deleteAssociation()
    await router.push({name: 'ManageAssociations'})
    notify({
      type: 'positive',
      message: t('notifications.positive.delete-association')
    })
  } catch (e) {
    notify({
      type: 'negative',
      message: t('notifications.negative.delete-association-error')
    })
  }
}
</script>

<template>
    <QBtn
        :label="t('association.delete')"
        color="red"
        icon="mdi-delete"
        @click="confirm = true"
    />

    <QDialog v-model="confirm" persistent>
        <QCard>
            <QCardSection class="row items-center">
                <span class="q-ml-sm">{{ t("association.confirm-delete") }}</span>
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
                    :label="t('association.delete')"
                    color="red"
                    icon="mdi-delete"
                    @click="onDeleteAssociation"
                />
            </QCardActions>
        </QCard>
    </QDialog>
</template>
