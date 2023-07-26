<script lang="ts" setup>
import type {PropType} from 'vue'
import {onMounted, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useQuasar} from 'quasar'
import type {Association} from '#/association'
import useSecurity from '@/composables/useSecurity'

const {t} = useI18n()
const changes = ref<boolean>(false)
const deletionWord = ref<string>('')
const associationStore = useAssociationStore()
const {notify} = useQuasar()
const {hasPerm} = useSecurity()

const emit = defineEmits(['updateSelectedAssociations'])

const actionsOptions = ref([
    {id: 'email', label: t('association.all-selected-mail')}
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
    }
}

onMounted(initActionOptions)

async function onConfirmChanges(emailType: string) {
    const associationsSuccess: string[] = []
    const associationsError: string[] = []
    const promisesToExecute: Promise<void>[] = []
    let mailto = 'mailto:?bcc='
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
        props.selectedAssociations?.forEach((selectedAssociation) => {
            promisesToExecute.push(associationStore.patchEnabledAssociation(true, selectedAssociation.id).then(() => {
                associationsSuccess.push(selectedAssociation.name)
            }))
        })
        break
    case 'disable':
        props.selectedAssociations?.forEach((selectedAssociation) => {
            promisesToExecute.push(associationStore.patchEnabledAssociation(false, selectedAssociation.id).then(() => {
                associationsSuccess.push(selectedAssociation.name)
            }))
        })
        break
    case 'delete':
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
    }

    Promise.all(promisesToExecute).then(() => {
        let message = ''
        if (associationsSuccess.length > 0) {
            associationStore.getManagedAssociations()
            message = t(`notifications.positive.${switches.value}-associations`)
            notify({
                type: 'positive',
                message: `<p>${message}${associationsSuccess.join(', ')}</p>`,
                html: true
            })
        }
        if (associationsError.length > 0) {
            associationStore.getManagedAssociations()
            message = t(`notifications.negative.${switches.value}-associations-error`)
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
                <p class="q-ml-sm">{{ t(`association.confirm-all-${switches}`) }}</p>
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
            <QCardActions>
                <div class="flex-row padding-top">
                    <QBtn
                        v-close-popup
                        :label="t('cancel')"
                        class="btn-lg"
                        color="dashboard"
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
                        v-if="switches === 'delete'"
                        v-close-popup
                        :label="t('association.delete')"
                        class="btn-lg"
                        color="custom-red"
                        icon="bi-trash"
                        @click="onConfirmChanges('')"
                    />
                </div>
            </QCardActions>
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
