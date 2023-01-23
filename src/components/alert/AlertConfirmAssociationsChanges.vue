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
const actionsOptions = ref([
    {id: 'email', label: t('association.all-selected-mail')},
    {id: 'enable', label: t('association.all-selected-enable')},
    {id: 'disable', label: t('association.all-selected-disable')},
    {id: 'delete', label: t('association.all-selected-delete')}
])

defineProps({
    selectedAssociations: Array,
})

async function onConfirmChanges(selectedAssociations) {
    const associationsSuccess = []
    const associationsError = []
    const promisesToExecute = []
    let mailto = "mailto:?bcc="
    switch (actionsOptions.value.value) {
        case 'email':
            selectedAssociations.forEach(async (selectedAssociation) => {
                if (selectedAssociation.email) {
                    mailto += `${selectedAssociation.email},`
                }
            })
            window.location.href = mailto
            break
        case 'enable':
            selectedAssociations.forEach(async (selectedAssociation) => {
                promisesToExecute.push(associationStore.patchEnabledAssociation(true, selectedAssociation.id).then(() => {
                    associationsSuccess.push(selectedAssociation.name)
                }))
            })
            break
        case 'disable':
            selectedAssociations.forEach(async (selectedAssociation) => {
                promisesToExecute.push(associationStore.patchEnabledAssociation(false, selectedAssociation.id).then(() => {
                    associationsSuccess.push(selectedAssociation.name)
                }))
            })
            break
        case 'delete':
            selectedAssociations.forEach(async (selectedAssociation) => {
                promisesToExecute.push(associationStore.deleteAssociation(selectedAssociation.id).then(() => {
                    associationsSuccess.push(selectedAssociation.name)
                }).catch(() => {
                    associationsError.push(selectedAssociation.name)
                }))
            })
            break
    }
    
    Promise.all(promisesToExecute).then(() => {
        if (associationsSuccess.length > 0) {
            notify({
                type: 'positive',
                message: `${t('notifications.positive.change-associations')}${associationsSuccess.join(', ')}`
            })
        }
        if (associationsError.length > 0) {
            notify({
                type: 'negative',
                message: `${t('notifications.negative.change-associations-error')}${associationsError.join(', ')}`
            })
        }
    })
}
</script>

<template>
    <QSelect
        v-model="actionsOptions.value"
        :label="t('association.all-selected')"
        :options="actionsOptions"
        option-value="id"
        option-label="label"
        emit-value
        filled
        map-options
    />
    <QBtn
        :label="t('association.confirm-all-changes')"
        color="primary"
        icon="mdi-pencil"
        @click="(actionsOptions.value !== undefined && selectedAssociations.length > 0) ? changes = true : changes = false"
    />
    <QDialog v-model="changes" persistent>
        <QCard>
            <QCardSection class="row items-center">
                <span class="q-ml-sm">{{ t(`association.confirm-all-${actionsOptions.value}`) }}</span>
                <ul>
                    <li :key="association.id" v-for="association in selectedAssociations">
                        {{ association.name }}
                    </li>
                </ul>
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
                    v-if="actionsOptions.value === 'email'"
                    :label="t('association.email')"
                    color="secondary"
                    icon="mdi-email"
                    @click="onConfirmChanges(selectedAssociations)"
                />
                <QBtn
                    v-close-popup
                    v-if="actionsOptions.value === 'enable'"
                    :label="t('association.enable')"
                    color="green"
                    icon="mdi-eye-check"
                    @click="onConfirmChanges(selectedAssociations)"
                />
                <QBtn
                    v-close-popup
                    v-if="actionsOptions.value === 'disable'"
                    :label="t('association.disable')"
                    color="orange"
                    icon="mdi-eye-remove"
                    @click="onConfirmChanges(selectedAssociations)"
                />
                <QBtn
                    v-close-popup
                    v-if="actionsOptions.value === 'delete'"
                    :label="t('association.delete')"
                    color="red"
                    icon="mdi-delete"
                    @click="onConfirmChanges(selectedAssociations)"
                />
            </QCardActions>
        </QCard>
    </QDialog>
</template>
