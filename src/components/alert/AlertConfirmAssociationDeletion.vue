<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import router from '@/router'
import { useAssociationStore } from '@/stores/useAssociationStore'
import { useQuasar } from 'quasar'

const { t } = useI18n()
const confirmation = ref<boolean>(false)
const deletionWord = ref<string>("")
const associationStore = useAssociationStore()
const { notify } = useQuasar()

async function onDeleteAssociation() {
    try {
        if (deletionWord.value === t('association.before-deletion-word')) {
            await associationStore.deleteAssociation(associationStore.association?.id)
            await router.push({ name: 'ManageAssociations' })
            notify({
                type: 'positive',
                message: t('notifications.positive.delete-association')
            })
        } else {
            notify({
                type: 'negative',
                message: t('association.before-deletion-word-error')
            })
        }
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.delete-association-error')
        })
    }
}
</script>

<template>
    <QBtn :label="t('association.delete-association')" color="red" icon="mdi-delete" @click="confirmation = true" />

    <QDialog v-model="confirmation" persistent>
        <QCard>
            <QCardSection class="row items-center">
                <span class="q-ml-sm">{{ t("association.confirm-delete") }}</span>
            </QCardSection>
            <QCardSection>
                <QInput v-model=deletionWord @paste.prevent :label="t('association.before-deletion-word-instruction')" />
            </QCardSection>

            <QCardActions align="right">
                <QBtn v-close-popup :label="t('cancel')" color="secondary" icon="mdi-arrow-left-circle" />
                <QBtn v-close-popup :label="t('association.delete-association')" color="red" icon="mdi-delete"
                    @click="onDeleteAssociation" />
            </QCardActions>
        </QCard>
    </QDialog>
</template>
