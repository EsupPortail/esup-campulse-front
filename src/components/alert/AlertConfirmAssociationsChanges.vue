<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useQuasar} from 'quasar'
import type {Association} from '#/association'

const {t} = useI18n()
const changes = ref<boolean>(false)
const associationStore = useAssociationStore()
const {notify} = useQuasar()
const actionsOptions = [
    {id: 'email', label: t('association.all-selected-mail')},
    {id: 'enable', label: t('association.all-selected-enable')},
    {id: 'disable', label: t('association.all-selected-disable')},
    {id: 'delete', label: t('association.all-selected-delete')}
]

const switches = ref<string>()

defineProps({
    selectedAssociations: Array,
})

async function onConfirmChanges(selectedAssociations: Association[]) {
    const associationsSuccess: string[] = []
    const associationsError: string[] = []
    const promisesToExecute: Promise<void>[] = []
    let mailto = "mailto:?bcc="
    switch (switches.value) {
        case 'email':
            selectedAssociations.forEach((selectedAssociation) => {
                if (selectedAssociation.email) {
                    mailto += `${selectedAssociation.email},`
                }
            })
            window.location.href = mailto
            break
        case 'enable':
            selectedAssociations.forEach((selectedAssociation) => {
                promisesToExecute.push(associationStore.patchEnabledAssociation(true, selectedAssociation.id).then(() => {
                    associationsSuccess.push(selectedAssociation.name)
                }))
            })
            break
        case 'disable':
            selectedAssociations.forEach((selectedAssociation) => {
                promisesToExecute.push(associationStore.patchEnabledAssociation(false, selectedAssociation.id).then(() => {
                    associationsSuccess.push(selectedAssociation.name)
                }))
            })
            break
        case 'delete':
            selectedAssociations.forEach((selectedAssociation) => {
                promisesToExecute.push(associationStore.deleteAssociation(selectedAssociation.id).then(() => {
                    associationsSuccess.push(selectedAssociation.name)
                    selectedAssociations.splice(selectedAssociations.indexOf(selectedAssociation), 1)
                }).catch(() => {
                    associationsError.push(selectedAssociation.name)
                }))
            })
            break
    }

    Promise.all(promisesToExecute).then(() => {
        if (associationsSuccess.length > 0) {
            associationStore.getManagedAssociations()
            notify({
                type: 'positive',
                message: `${t('notifications.positive.change-associations')}${associationsSuccess.join(', ')}`
            })
        }
        if (associationsError.length > 0) {
            associationStore.getManagedAssociations()
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
        v-model="switches"
        :label="t('association.all-selected')"
        :options="actionsOptions"
        emit-value
        filled
        map-options
        option-label="label"
        option-value="id"
    />
    <QBtn
        :label="t('association.confirm-all-changes')"
        color="primary"
        icon="mdi-pencil"
        @click="(switches !== undefined && selectedAssociations.length > 0) ? changes = true : changes = false"
    />
    <QDialog v-model="changes" persistent>
        <QCard>
            <QCardSection class="row items-center">
                <span class="q-ml-sm">{{ t(`association.confirm-all-${switches}`) }}</span>
                <ul>
                    <li v-for="association in selectedAssociations" :key="association.id">
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
                    v-if="switches === 'email'"
                    v-close-popup
                    :label="t('association.email')"
                    color="secondary"
                    icon="mdi-email"
                    @click="onConfirmChanges(selectedAssociations)"
                />
                <QBtn
                    v-if="switches === 'enable'"
                    v-close-popup
                    :label="t('association.enable')"
                    color="green"
                    icon="mdi-eye-check"
                    @click="onConfirmChanges(selectedAssociations)"
                />
                <QBtn
                    v-if="switches === 'disable'"
                    v-close-popup
                    :label="t('association.disable')"
                    color="orange"
                    icon="mdi-eye-remove"
                    @click="onConfirmChanges(selectedAssociations)"
                />
                <QBtn
                    v-if="switches === 'delete'"
                    v-close-popup
                    :label="t('association.delete')"
                    color="red"
                    icon="mdi-delete"
                    @click="onConfirmChanges(selectedAssociations)"
                />
            </QCardActions>
        </QCard>
    </QDialog>
</template>
