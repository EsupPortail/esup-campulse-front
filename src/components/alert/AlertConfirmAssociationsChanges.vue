<script lang="ts" setup>
import type {PropType} from 'vue'
import {onMounted, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useQuasar} from 'quasar'
import type {Association} from '#/association'
import useSecurity from '@/composables/useSecurity'
import axios from 'axios'
import useErrors from '@/composables/useErrors'

const {t} = useI18n()
const changes = ref<boolean>(false)
const deletionWord = ref<string>('')
const associationStore = useAssociationStore()
const {notify} = useQuasar()
const {hasPerm} = useSecurity()
const {catchHTTPError} = useErrors()

const emit = defineEmits(['updateSelectedAssociations'])

const actionsOptions = ref([
    {id: 'email', label: t('association.all-selected-mail')},
    {id: 'csv-export', label: t('association.export-csv')},
    {id: 'xlsx-export', label: t('association.export-xlsx')}
])

const switches = ref<string>()

const props = defineProps({
    selectedAssociations: Array as PropType<Association[]>,
})

const initActionOptions = () => {
    if (hasPerm('delete_association')) {
        actionsOptions.value.push({
            id: 'delete',
            label: t('association.all-selected-delete')
        })
    }
    if (hasPerm('change_association_all_fields')) {
        actionsOptions.value.push({id: 'enable', label: t('association.all-selected-enable')})
        actionsOptions.value.push({id: 'disable', label: t('association.all-selected-disable')})
        actionsOptions.value.push({id: 'site', label: t('association.all-selected-site')})
        actionsOptions.value.push({id: 'not-site', label: t('association.all-selected-not-site')})
    }
}

onMounted(initActionOptions)

async function onConfirmChanges(emailType: string) {
    const associationsSuccess: string[] = []
    const associationsError: string[] = []
    const promisesToExecute: Promise<void>[] = []
    let mailto = 'mailto:?bcc='
    let positiveMessage = ''
    let negativeMessage = ''
    switch (switches.value) {
    case 'email':
        props.selectedAssociations?.forEach((selectedAssociation) => {
            if (selectedAssociation.email) {
                mailto += `${selectedAssociation.email},`
                associationsSuccess.push(selectedAssociation.name)
            } else {
                associationsError.push(selectedAssociation.name)
            }
        })
        window.open(mailto, (emailType as string === 'web') ? '_blank' : '_self')
        break
    case 'enable':
        positiveMessage = t('notifications.positive.enable-associations')
        negativeMessage = t('notifications.negative.enable-associations-error')
        props.selectedAssociations?.forEach((selectedAssociation) => {
            promisesToExecute.push(associationStore.patchEnabledAssociation(true, selectedAssociation.id).then(() => {
                associationsSuccess.push(selectedAssociation.name)
            }))
        })
        break
    case 'disable':
        positiveMessage = t('notifications.positive.disable-associations')
        negativeMessage = t('notifications.negative.disable-associations-error')
        props.selectedAssociations?.forEach((selectedAssociation) => {
            promisesToExecute.push(associationStore.patchEnabledAssociation(false, selectedAssociation.id).then(() => {
                associationsSuccess.push(selectedAssociation.name)
            }))
        })
        break
    case 'site':
        positiveMessage = t('notifications.positive.enable-associations-site')
        negativeMessage = t('notifications.negative.enable-associations-site-error')
        props.selectedAssociations?.forEach((selectedAssociation) => {
            promisesToExecute.push(associationStore.patchIsSite(true, selectedAssociation.id).then(() => {
                associationsSuccess.push(selectedAssociation.name)
            }))
        })
        break
    case 'not-site':
        positiveMessage = t('notifications.positive.disable-associations-site')
        negativeMessage = t('notifications.negative.disable-associations-site-error')
        props.selectedAssociations?.forEach((selectedAssociation) => {
            promisesToExecute.push(associationStore.patchIsSite(false, selectedAssociation.id).then(() => {
                associationsSuccess.push(selectedAssociation.name)
            }))
        })
        break
    case 'delete':
        positiveMessage = t('notifications.positive.delete-associations')
        negativeMessage = t('notifications.negative.delete-associations-error')
        if (deletionWord.value === t('association.before-deletion-word')) {
            props.selectedAssociations?.forEach((selectedAssociation) => {
                promisesToExecute.push(associationStore.deleteAssociation(selectedAssociation.id).then(() => {
                    associationsSuccess.push(selectedAssociation.name)
                    if (props.selectedAssociations) {
                        let newSelectedAssociations = props.selectedAssociations
                        newSelectedAssociations = newSelectedAssociations?.splice(props.selectedAssociations?.indexOf(selectedAssociation), 1)
                        emit('updateSelectedAssociations', newSelectedAssociations)
                    }
                }).catch(() => {
                    associationsError.push(selectedAssociation.name)
                }))
            })
            deletionWord.value = ''
        } else {
            notify({
                type: 'negative',
                message: t('notifications.negative.association-before-deletion-word-error')
            })
        }
        break
    case 'csv-export':
    case 'xlsx-export':
        if (props.selectedAssociations?.length) {
            try {
                const associationIds = props.selectedAssociations.map(x => x.id)
                const file = await associationStore.export(associationIds, (switches.value === 'csv-export') ? 'csv' : 'xlsx')
                const message = (switches.value === 'csv-export') ? t('notifications.positive.csv-export-associations') : t('notifications.positive.xlsx-export-associations')
                notify({
                    type: 'positive',
                    message,
                    html: true
                })
                const link = document.createElement('a')
                link.href = window.URL.createObjectURL(new Blob([file]))
                link.download = (switches.value === 'csv-export') ? `${t('association.csv-name')}.csv` : `${t('association.csv-name')}.xlsx`
                document.body.appendChild(link)
                link.click()
                link.remove()
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    notify({
                        type: 'negative',
                        message: catchHTTPError(error.response)
                    })
                }
            }
        }
        break
    }

    Promise.all(promisesToExecute).then(() => {
        let message = ''
        if (associationsSuccess.length > 0) {
            associationStore.getManagedAssociations()
            message = positiveMessage
            notify({
                type: 'positive',
                message: `<p>${message}${associationsSuccess.join(', ')}</p>`,
                html: true
            })
        }
        if (associationsError.length > 0) {
            associationStore.getManagedAssociations()
            message = negativeMessage
            notify({
                type: 'negative',
                message: `<p>${message}${associationsError.join(', ')}</p>`,
                html: true
            })
        }
    })
}
</script>

<template>
    <div class="table-actions-select padding-top">
        <QSelect
            v-model="switches"
            :label="t('association.all-selected')"
            :options="actionsOptions"
            color="association"
            emit-value
            filled
            map-options
            option-label="label"
            option-value="id"
        />
        <QBtn
            :label="t('association.confirm-all-changes')"
            class="btn-lg"
            color="association"
            icon="bi-check-lg"
            @click="(switches !== undefined && selectedAssociations && selectedAssociations.length > 0) ? changes = true : changes = false"
        />
    </div>

    <QDialog
        v-model="changes"
        persistent
    >
        <QCard>
            <QCardSection class="flex-column items-center dialog-message">
                <p
                    v-if="switches === 'email'"
                    class="q-ml-sm"
                >
                    {{ t('association.confirm-all-email') }}
                </p>
                <p
                    v-if="switches === 'csv-export'"
                    class="q-ml-sm"
                >
                    {{ t('association.confirm-all-csv-export') }}
                </p>
                <p
                    v-if="switches === 'xlsx-export'"
                    class="q-ml-sm"
                >
                    {{ t('association.confirm-all-xlsx-export') }}
                </p>
                <p
                    v-if="switches === 'enable'"
                    class="q-ml-sm"
                >
                    {{ t('association.confirm-all-enable') }}
                </p>
                <p
                    v-if="switches === 'disable'"
                    class="q-ml-sm"
                >
                    {{ t('association.confirm-all-disable') }}
                </p>
                <p
                    v-if="switches === 'site'"
                    class="q-ml-sm"
                >
                    {{ t('association.confirm-all-site') }}
                </p>
                <p
                    v-if="switches === 'not-site'"
                    class="q-ml-sm"
                >
                    {{ t('association.confirm-all-not-site') }}
                </p>
                <p
                    v-if="switches === 'delete'"
                    class="q-ml-sm"
                >
                    {{ t('association.confirm-all-delete') }}
                </p>
                <template v-if="switches === 'email'">
                    <ul
                        v-for="association in selectedAssociations"
                        :key="association.id"
                    >
                        <li v-if="association.email !== ''">{{ association.name }}</li>
                    </ul>
                </template>
                <template v-else>
                    <ul
                        v-for="association in selectedAssociations"
                        :key="association.id"
                    >
                        <li>{{ association.name }}</li>
                    </ul>
                </template>
            </QCardSection>
            <QCardSection v-if="switches === 'delete'">
                <QInput
                    v-model=deletionWord
                    :label="t('association.before-deletion-word-instruction')"
                    @paste.prevent
                />
            </QCardSection>
            <QCardSection>
                <div class="flex-row-center padding-top">
                    <QBtn
                        v-close-popup
                        :label="t('cancel')"
                        class="btn-lg"
                        color="association"
                        icon="bi-x-lg"
                    />
                    <QBtn
                        v-if="switches === 'email'"
                        v-close-popup
                        :label="t('association.email-software')"
                        class="btn-lg"
                        color="association"
                        icon="bi-envelope"
                        @click="onConfirmChanges('software')"
                    />
                    <QBtn
                        v-if="switches === 'email'"
                        v-close-popup
                        :label="t('association.email-web')"
                        class="btn-lg"
                        color="association"
                        icon="bi-envelope"
                        @click="onConfirmChanges('web')"
                    />
                    <QBtn
                        v-if="switches === 'csv-export'"
                        v-close-popup
                        :label="t('association.export-csv')"
                        class="btn-lg"
                        color="association"
                        icon="bi-filetype-csv"
                        @click="onConfirmChanges('')"
                    />
                    <QBtn
                        v-if="switches === 'xlsx-export'"
                        v-close-popup
                        :label="t('association.export-xlsx')"
                        class="btn-lg"
                        color="association"
                        icon="bi-filetype-xlsx"
                        @click="onConfirmChanges('')"
                    />
                    <QBtn
                        v-if="switches === 'enable'"
                        v-close-popup
                        :label="t('association.enable')"
                        class="btn-lg"
                        color="association"
                        icon="bi-unlock"
                        @click="onConfirmChanges('')"
                    />
                    <QBtn
                        v-if="switches === 'disable'"
                        v-close-popup
                        :label="t('association.disable')"
                        class="btn-lg"
                        color="custom-red"
                        icon="bi-lock"
                        @click="onConfirmChanges('')"
                    />
                    <QBtn
                        v-if="switches === 'site'"
                        v-close-popup
                        :label="t('association.enable-association-site')"
                        class="btn-lg"
                        color="association"
                        icon="bi-file-earmark-check-fill"
                        @click="onConfirmChanges('')"
                    />
                    <QBtn
                        v-if="switches === 'not-site'"
                        v-close-popup
                        :label="t('association.disable-association-site')"
                        class="btn-lg"
                        color="custom-red"
                        icon="bi-file-earmark-x-fill"
                        @click="onConfirmChanges('')"
                    />
                    <QBtn
                        v-if="switches === 'delete'"
                        v-close-popup
                        :label="t('association.delete')"
                        class="btn-lg"
                        color="custom-red"
                        icon="bi-trash"
                        @click="onConfirmChanges('')"
                    />
                </div>
            </QCardSection>
        </QCard>
    </QDialog>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import '@/assets/variables.scss';

p {
    font-size: 1.8rem;
}

li {
    font-size: 1.5rem;
}
</style>
