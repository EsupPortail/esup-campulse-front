<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import axios from 'axios'
import useAssociation from '@/composables/useAssociation'
import router from '@/router'
import useUserGroups from '@/composables/useUserGroups'
import {useAssociationStore} from '@/stores/useAssociationStore'

const {t} = useI18n()
const confirmation = ref<boolean>(false)
const {notify} = useQuasar()
const {updateAssociation} = useAssociation()
const {isStaff} = useUserGroups()

const associationStore = useAssociationStore()

const associationId = ref<number | undefined>(associationStore.association?.id)

const emit = defineEmits(['hasValidated'])

async function onValidateChanges() {
    try {
        await updateAssociation()
        emit('hasValidated')
        await router.push(isStaff.value ? {name: 'ManageAssociations'} : {
            name: 'AssociationDashboard',
            params: {id: associationId.value}
        })
        notify({
            message: t('notifications.positive.association-successfully-updated'),
            type: 'positive'
        })
    } catch (error) {
        if (axios.isAxiosError(error)) {
            notify({
                message: t('notifications.negative.edit-association-error'),
                type: 'negative'
            })
        }
    }
}
</script>

<template>
    <QBtn
        :label="t('association.validate-all-changes')"
        color="primary"
        icon="mdi-check-circle"
        @click="confirmation = true"
    />

    <QDialog v-model="confirmation" persistent>
        <QCard>
            <QCardSection class="row items-center">
                <span class="q-ml-sm">{{ t('association.alert-confirm-changes') }}</span>
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
                    icon="mdi-check-circle"
                    @click="onValidateChanges"
                />
            </QCardActions>
        </QCard>
    </QDialog>
</template>
