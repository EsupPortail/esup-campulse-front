<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {onMounted, ref} from 'vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import {useRoute} from 'vue-router'
import CharterRecapAssociationInfos from '@/components/charter/CharterRecapAssociationInfos.vue'
import FormDocumentUploads from '@/components/form/FormDocumentUploads.vue'
import {watch} from 'vue'
import useCharters from '@/composables/useCharters'
import useDocumentUploads from '@/composables/useDocumentUploads'
import router from '@/router'
import type {AssociationCharterStatus} from '#/charters'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const {uploadDocuments, initCharterDocumentUploads} = useDocumentUploads()
const associationStore = useAssociationStore()
const route = useRoute()
const {patchCharterDocument, patchCharterStatus, getCharterDocuments} = useCharters()
const {documents, documentUploads} = useDocumentUploads()

const associationId = ref<number>()

const comment = ref('')

interface ActionOption {
    value: Action,
    label: string,
    icon: Icon,
}

type Action = 'validate' | 'reject' | 'return' | ''
type Icon = 'bi-check-lg' | 'bi-x-octagon' | 'bi-exclamation-triangle' | ''

const open = ref<boolean>(false)

const actions: ActionOption[] = [
    {
        value: 'validate',
        label: t('charter.actions.validate'),
        icon: 'bi-check-lg'
    },
    {
        value: 'return',
        label: t('charter.actions.return'),
        icon: 'bi-exclamation-triangle'
    },
    {
        value: 'reject',
        label: t('charter.actions.reject'),
        icon: 'bi-x-octagon'
    }
]

const selectedAction = ref<Action>('')
const selectedIcon = ref<Icon>('')
const selectedLabel = ref('')

const initAction = () => {
    const findSelectedAction = actions.find(obj => obj.value === selectedAction.value)
    if (findSelectedAction) {
        selectedIcon.value = findSelectedAction.icon
        selectedLabel.value = findSelectedAction.label
    }
}

watch(() => selectedAction.value, initAction)

watch(() => open.value, () => {
    if (open.value === false) comment.value = ''
})

async function onGetAssociationDetail() {
    if (associationId.value) {
        try {
            await associationStore.getAssociationDetail(associationId.value, false)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                notify({
                    type: 'negative',
                    message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
                })
            }
        }
    }
}

onMounted(async () => {
    loading.show()
    selectedAction.value = 'validate'
    initAction()
    associationId.value = parseInt(route.params.associationId as string)
    await onGetAssociationDetail()
    loading.hide()
})

async function onValidateCharter() {
    loading.show()
    try {
        // We upload new documents if needed
        await uploadDocuments(associationId.value)
        // We update our document uploads
        await getCharterDocuments(associationId.value)
        initCharterDocumentUploads()
        // We look for the right ids to patch
        const uploadedAssociationCharter = documentUploads.value
            .find(x => x.document === (documents.value
                .find(y => y.acronym === 'CHARTE_SITE_ALSACE'))?.id)?.id
        const uploadedGDPRAssociationCharter = documentUploads.value
            .find(x => x.document === (documents.value
                .find(y => y.acronym === 'RGPD_SITE_ALSACE'))?.id)?.id
        // We patch our documents and the charter status of the association
        if (associationId.value && selectedAction.value && uploadedAssociationCharter && uploadedGDPRAssociationCharter) {
            await patchCharterDocument(selectedAction.value, uploadedAssociationCharter, comment.value)
            await patchCharterDocument(selectedAction.value, uploadedGDPRAssociationCharter, comment.value)
            let associationCharterStatus: AssociationCharterStatus = 'CHARTER_REJECTED'
            if (selectedAction.value === 'validate') associationCharterStatus = 'CHARTER_VALIDATED'
            else if (selectedAction.value === 'return') associationCharterStatus = 'CHARTER_DRAFT'
            await patchCharterStatus(associationCharterStatus, associationId.value)
        }
        notify({
            type: 'positive',
            message: t(`notifications.positive.charter-${selectedAction.value}`)
        })
        await router.push({name: 'AssociationCharterList', params: {associationId: associationId.value}})
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
    loading.hide
}
</script>

<template>
    <QForm @submit="open = true">
        <section class="dashboard-section">
            <h2>
                <QIcon name="bi-info-circle"/>
                {{ t('charter.site.sign-form.association-infos-update') }}
            </h2>
            <div class="dashboard-section-container">
                <div class="container">
                    <CharterRecapAssociationInfos :association="associationId"/>
                </div>
            </div>
        </section>
        <section class="dashboard-section">
            <h2>
                <QIcon name="bi-file-earmark"/>
                {{ t('charter.site.sign-form.documents-upload') }}
            </h2>
            <div class="dashboard-section-container">
                <div class="container">
                    <FormDocumentUploads
                        :association-id="associationId"
                        process="charter"
                    />
                </div>
            </div>
        </section>
        <section class="flex-column padding-top padding-bottom">
            <div class="flex-row-center">
                <QSelect
                    v-model="selectedAction"
                    :label="t('charter.actions.manage')"
                    :options="actions"
                    color="charter"
                    emit-value
                    filled
                    map-options
                />
                <QBtn
                    :color="selectedAction !== 'validate' ? 'custom-red' : 'charter'"
                    :icon="selectedIcon"
                    :label="selectedLabel"
                    :text-color="selectedAction !== 'validate' ? '' : 'charter'"
                    class="btn-lg"
                    type="submit"
                />
            </div>
            <div class="flex-row-center">
                <QBtn
                    :label="t('back')"
                    :to="{name: 'AssociationCharterList', params: {associationId: associationId}}"
                    class="btn-lg"
                    color="charter"
                    icon="bi-box-arrow-left"
                    text-color="charter"
                />
            </div>
        </section>
    </QForm>
    <QDialog v-model="open">
        <QCard class="variant-space-2">
            <QCardSection class="q-pt-none flex-column">
                <div
                    v-if="selectedAction === 'reject'"
                    class="info-panel info-panel-error"
                >
                    <i
                        aria-hidden="true"
                        class="bi bi-exclamation-lg"
                    ></i>
                    <p>{{ t('charter.reject-info') }}</p>
                </div>
                <QForm
                    class="flex-column"
                    @submit="onValidateCharter"
                >
                    <QInput
                        v-model="comment"
                        :aria-required="selectedAction !== 'validate'"
                        :label="t('forms.comment') + (selectedAction !== 'validate' ? ` (${t('required')})` : ` (${t('optional')})`)"
                        :rules="selectedAction !== 'validate' ? [ val => val && val.length > 0 || t('forms.required-comment')] : []"
                        color="charter"
                        filled
                        lazy-rules
                        type="textarea"
                    >
                        <template v-slot:hint>
                            <p :aria-describedby="t('forms.charter-validation-comment')">
                                {{ t('forms.charter-validation-comment') }}
                            </p>
                        </template>
                    </QInput>
                    <div class="flex-row-center padding-top">
                        <QBtn
                            :label="t('back')"
                            class="btn-lg"
                            color="charter"
                            icon="bi-box-arrow-left"
                            text-color="charter"
                            @click="open = false"
                        />
                        <QBtn
                            :color="selectedAction === 'reject' || selectedAction === 'return' ? 'custom-red' : 'charter'"
                            :icon="selectedIcon"
                            :label="selectedLabel"
                            :text-color="selectedAction === 'reject' || selectedAction === 'return' ? '' : 'charter'"
                            class="btn-lg"
                            type="submit"
                        />
                    </div>
                </QForm>
            </QCardSection>
        </QCard>
    </QDialog>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/documents.scss';
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';
</style>