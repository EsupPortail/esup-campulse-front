<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useQuasar} from 'quasar'
import axios from 'axios'
import useErrors from '@/composables/useErrors'

const {t} = useI18n()
const associationStore = useAssociationStore()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()

const emit = defineEmits(['hasValidated'])

const confirmation = ref<boolean>(false)

async function onManageAssociationSubmission() {
    loading.show()
    try {
        const patchedCanSubmitProjects = !associationStore.association?.canSubmitProjects
        await associationStore.patchCanSubmitProjects(patchedCanSubmitProjects, associationStore.association?.id)
        emit('hasValidated')
        notify({
            type: 'positive',
            message: t(`notifications.positive.association-${patchedCanSubmitProjects ? 'can' : 'cannot'}-submit-projects`)
        })
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
    loading.hide()
}

</script>

<template>
    <QBtn
        :color="!associationStore.association?.canSubmitProjects ? 'green' : 'orange'"
        :icon="!associationStore.association?.canSubmitProjects ? 'bi bi-clipboard-check' : 'bi bi-clipboard-x'"
        :label="!associationStore.association?.canSubmitProjects ? t('association.enable-project-submission') : t('association.disable-project-submission')"
        @click="confirmation = true"
    />

    <QDialog
        v-model="confirmation"
        persistent
    >
        <QCard>
            <QCardSection class="row items-center">
                <span class="q-ml-sm">{{
                    !associationStore.association?.canSubmitProjects ? t('alerts.confirm-association-can-submit-projects') : t('alerts.confirm-association-cannot-submit-projects')
                }}</span>
            </QCardSection>

            <QCardActions align="right">
                <QBtn
                    v-close-popup
                    :label="t('cancel')"
                    icon="bi bi-x-lg"
                />
                <QBtn
                    v-close-popup
                    :color="!associationStore.association?.canSubmitProjects ? 'green' : 'orange'"
                    :icon="!associationStore.association?.canSubmitProjects ? 'bi bi-clipboard-check' : 'bi bi-clipboard-x'"
                    :label="!associationStore.association?.canSubmitProjects ? t('association.enable-project-submission') : t('association.disable-project-submission')"
                    @click="onManageAssociationSubmission"
                />
            </QCardActions>
        </QCard>
    </QDialog>
</template>
