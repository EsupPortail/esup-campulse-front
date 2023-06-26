<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {useRoute} from 'vue-router'
import {useUserStore} from '@/stores/useUserStore'
import InfoProcessDocuments from '@/components/infoPanel/InfoProcessDocuments.vue'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import {useAssociationStore} from '@/stores/useAssociationStore'
import type {EditedAssociation} from '#/association'
import useUtility from '@/composables/useUtility'
import useAssociation from '@/composables/useAssociation'
import FormDocumentUploads from '@/components/form/FormDocumentUploads.vue'
import useDocumentUploads from '@/composables/useDocumentUploads'
import CharterRecap from '@/components/charter/CharterRecap.vue'
import useCharters from '@/composables/useCharters'

const {t} = useI18n()
const {loading, notify} = useQuasar()
const {catchHTTPError} = useErrors()
const {formatDate, phoneRegex} = useUtility()
const {checkChanges, updateAssociation} = useAssociation()
const {uploadDocuments} = useDocumentUploads()
const {signCharter} = useCharters()
const route = useRoute()
const userStore = useUserStore()
const associationStore = useAssociationStore()

const step = ref(1)

// Association infos
const associationId = ref<number>()
const associationName = ref<string | undefined>('')

const editedAssociation = ref<EditedAssociation>({
    name: '',
    acronym: '',
    lastGoaDate: '',
    presidentNames: '',
    presidentPhone: '',
    address: '',
    zipcode: '',
    city: '',
    country: '',
    phone: '',
    email: '',
    institutionComponent: null,
    activityField: null,
    siret: ''
})

const initEditedAssociation = () => {
    editedAssociation.value.name = associationStore.association?.name as string
    editedAssociation.value.acronym = associationStore.association?.acronym
    editedAssociation.value.lastGoaDate = formatDate(associationStore.association?.lastGoaDate as string)
    editedAssociation.value.presidentNames = associationStore.association?.presidentNames
    editedAssociation.value.presidentPhone = associationStore.association?.presidentPhone
    editedAssociation.value.address = associationStore.association?.address
    editedAssociation.value.zipcode = associationStore.association?.zipcode
    editedAssociation.value.city = associationStore.association?.city
    editedAssociation.value.country = associationStore.association?.country
    editedAssociation.value.phone = associationStore.association?.phone
    editedAssociation.value.email = associationStore.association?.email
    editedAssociation.value.institutionComponent = associationStore.association?.institutionComponent
    editedAssociation.value.activityField = associationStore.association?.activityField
    editedAssociation.value.siret = associationStore.association?.siret
}
watch(() => associationStore.association, initEditedAssociation)

onMounted(async () => {
    loading.show()
    associationId.value = parseInt(route.params.associationId as string)
    associationName.value = userStore.userAssociations.find(obj => obj.association.id === associationId.value)?.association.name
    await onGetAssociationDetails()
    loading.hide()
})

// Step 1: get association infos
async function onGetAssociationDetails() {
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

// Submit step 1: update association infos
async function onPatchAssociation() {
    loading.show()
    try {
        if (Object.entries(checkChanges(editedAssociation.value)).length) {
            await updateAssociation()
            notify({
                message: t('notifications.positive.association-successfully-updated'),
                type: 'positive'
            })
        }
        step.value = 2
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

// Submit step 2: upload charter documents
async function onUploadDocuments(nextStep: number) {
    loading.show()
    try {
        await uploadDocuments(associationId.value)
        step.value = nextStep
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

// Submit step 3: patch charter status to processing
async function onSignCharter() {
    loading.show()
    if (associationId.value) {
        try {
            await signCharter(associationId.value)
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

loading.hide()
</script>

<template>
    <section class="dashboard-section">
        <div class="form-container">
            <div class="form">
                <InfoProcessDocuments
                    :processes="['CHARTER_ASSOCIATION', 'DOCUMENT_ASSOCIATION']"
                />
                <QStepper
                    ref="stepper"
                    v-model="step"
                    animated
                    header-nav
                >
                    <QStep
                        :name="1"
                        :title="t('charter.site.sign-form.association-infos-update')"
                        icon="bi-pencil"
                    >
                        <QForm
                            @submit="onPatchAssociation"
                        >
                            <QInput
                                v-model="editedAssociation.name"
                                :label="t('association.labels.name') + ' *'"
                                :rules="[val => val && val.length > 0 || t('forms.fill-field')]"
                                aria-required="true"
                                clearable
                                filled
                                lazy-rules
                            />
                            <QInput
                                v-model="editedAssociation.acronym"
                                :label="t('association.labels.acronym')"
                                clearable
                                filled
                            />
                            <QInput
                                v-model="editedAssociation.lastGoaDate"
                                :label="t('association.labels.last-goa')"
                                :rules="[val => val && val.length > 0 || t('forms.fill-field')]"
                                clearable
                                filled
                                type="date"
                            />
                            <QInput
                                v-model="editedAssociation.presidentNames"
                                :label="t('association.labels.president-name')"
                                :rules="[val => val && val.length > 0 || t('forms.fill-field')]"
                                clearable
                                filled
                            />
                            <QInput
                                v-model="editedAssociation.presidentPhone"
                                :label="t('association.labels.president-phone')"
                                :rules="[val => phoneRegex.test(val) || t('forms.required-phone')]"
                                clearable
                                filled
                                type="tel"
                            />
                            <QSelect
                                v-model="editedAssociation.institutionComponent"
                                :label="t('association.labels.institution-component')"
                                :options="associationStore.institutionComponentLabels"
                                :rules="[val => val || t('forms.fill-field')]"
                                clearable
                                emit-value
                                filled
                                map-options
                            />
                            <QSelect
                                v-model="editedAssociation.activityField"
                                :label="t('association.labels.activity-field') + ' *'"
                                :options="associationStore.activityFieldLabels"
                                :rules="[val => val || t('forms.fill-field')]"
                                aria-required="true"
                                clearable
                                emit-value
                                filled
                                map-options
                            />
                            <fieldset>
                                <legend>{{ t('association.labels.address') }}</legend>
                                <QInput
                                    v-model="editedAssociation.address"
                                    :label="t('address.address')"
                                    :rules="[val => val && val.length > 0 || t('forms.fill-field')]"
                                    clearable
                                    filled
                                />
                                <div class="flex-group">
                                    <QInput
                                        v-model="editedAssociation.zipcode"
                                        :label="t('address.zipcode')"
                                        :rules="[val => val && val.length > 0 || t('forms.fill-field')]"
                                        clearable
                                        filled
                                    />
                                    <QInput
                                        v-model="editedAssociation.city"
                                        :label="t('address.city')"
                                        :rules="[val => val && val.length > 0 || t('forms.fill-field')]"
                                        clearable
                                        filled
                                    />
                                    <QInput
                                        v-model="editedAssociation.country"
                                        :label="t('address.country')"
                                        :rules="[val => val && val.length > 0 || t('forms.fill-field')]"
                                        clearable
                                        filled
                                    />
                                </div>
                            </fieldset>

                            <QInput
                                v-model="editedAssociation.siret"
                                :label="t('association.labels.siret')"
                                :rules="[val => val && val.length > 0 || t('forms.fill-field')]"
                                clearable
                                filled
                                inputmode="numeric"
                            />
                            <div class="btn-group">
                                <QBtn
                                    :label="t('continue')"
                                    icon="bi-check-lg"
                                    type="submit"
                                />
                            </div>
                        </QForm>
                    </QStep>

                    <QStep
                        :name="2"
                        :title="t('charter.site.sign-form.documents-upload')"
                        icon="bi-file-earmark"
                    >
                        <QForm
                            @submit="onUploadDocuments"
                        >
                            <FormDocumentUploads
                                :association-id="associationId"
                                process="charter"
                            />
                            <div class="btn-group">
                                <QBtn
                                    :label="t('back')"
                                    icon="bi-chevron-left"
                                    @click="step = step - 1"
                                />
                                <QBtn
                                    :label="t('continue')"
                                    icon="bi-check-lg"
                                    type="submit"
                                />
                            </div>
                        </QForm>
                    </QStep>

                    <QStep
                        :name="3"
                        :title="t('recap')"
                        icon="bi-check-lg"
                    >
                        <QForm
                            @submit="onSignCharter"
                        >
                            <CharterRecap
                                :association-id="associationId"
                                view="signCharter"
                                @change-step="newStep => step = newStep"
                            />
                            <div class="btn-group">
                                <QBtn
                                    :label="t('back')"
                                    icon="bi-chevron-left"
                                    @click="step = step - 1"
                                />
                                <QBtn
                                    :label="t('charter.sign')"
                                    icon="bi-check-lg"
                                    type="submit"
                                />
                            </div>
                        </QForm>
                    </QStep>
                </QStepper>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/dashboard.scss";
@import "@/assets/styles/forms.scss";

.form {
    width: 80% !important;
}

.flex-group {
    display: flex;
    gap: 1rem;
    justify-content: space-between;

    .q-input {
        width: 100%;
    }
}

.q-field {
    padding-bottom: 20px;
}
</style>