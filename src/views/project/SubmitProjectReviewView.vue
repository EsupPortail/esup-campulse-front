<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import axios from 'axios'
import useProjectDocuments from '@/composables/useProjectDocuments'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import {onMounted, ref, watch} from 'vue'
import useCommissions from '@/composables/useCommissions'
import {useUserStore} from '@/stores/useUserStore'
import {useProjectStore} from '@/stores/useProjectStore'
import {useRoute} from 'vue-router'
import useUtility from '@/composables/useUtility'
import {useAssociationStore} from '@/stores/useAssociationStore'
import useSubmitProject from '@/composables/useSubmitProject'
import useUsers from '@/composables/useUsers'
import FormProjectDocumentUploads from '@/components/form/FormProjectDocumentUploads.vue'
import FormProjectRecapDocuments from '@/components/form/FormProjectRecapDocuments.vue'
import FormProjectBearerInfos from '@/components/form/FormProjectBearerInfos.vue'

const {t} = useI18n()
const {catchHTTPError} = useErrors()
const {loading, notify} = useQuasar()
const userStore = useUserStore()
const projectStore = useProjectStore()
const associationStore = useAssociationStore()
const route = useRoute()
const {CURRENCY, formatDate, fromDateIsAnterior} = useUtility()
const {
    getDocuments,
    initProcessProjectDocuments,
    processDocuments,
    initDocumentUploads,
    uploadDocuments
} = useProjectDocuments()
const {
    patchProjectReview,
    submitProjectReview,
    projectReview,
    initProjectReview,
    projectAssociation
} = useSubmitProject()
const {
    getCommissions,
    getCommissionDates,
    initCommissionDatesLabels,
    commissionDatesLabels
} = useCommissions()
const {userToUpdate} = useUsers()

onMounted(async () => {
    loading.show()
    await onGetDocumentTypes()
    await onGetProjectReview()
    await onGetCommissionDates()
    await onGetAssociationDetails()
    initAssociationName()
    loading.hide()
})

const step = ref(1)

watch(() => step.value === 3, async () => {
    loading.show()
    await onGetProjectDocuments()
    loading.hide()
})

/*const applicant = () => {
    if (projectReview.value.user) return `${userStore.user?.firstName} ${userStore.user?.lastName}`
    else return userStore.user?.associations.find(obj => obj.id === projectReview.value.association)?.name
}*/

const associationName = ref('')

const initAssociationName = () => {
    const association = userStore.user?.associations.find(obj => obj.id === projectReview.value.association)
    if (association) associationName.value = association.name
}

const isSite = () => {
    let isSite = false
    if (userStore.user?.associations.find(obj => obj.id === projectReview.value.association)?.isSite) isSite = true
    return isSite
}

const selfBearer = ref<'yes' | 'no'>('yes')

const datesAreLegal = ref<boolean>(false)
const checkIfDatesAreLegal = () => {
    datesAreLegal.value = fromDateIsAnterior(projectReview.value.realStartDate, projectReview.value.realEndDate)
}
watch(() => projectReview.value.realStartDate, checkIfDatesAreLegal)
watch(() => projectReview.value.realEndDate, checkIfDatesAreLegal)


// Get data for info panel (required documents list)
async function onGetDocumentTypes() {
    try {
        await getDocuments('DOCUMENT_PROJECT_REVIEW')
        initProcessProjectDocuments()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

// Get data for commission dates
async function onGetCommissionDates() {
    try {
        await getCommissions()
        await getCommissionDates(undefined, undefined, undefined)
        initCommissionDatesLabels(isSite())
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

// Get project review and infos about the project (project commission dates...)
async function onGetProjectReview() {
    try {
        await projectStore.getProjectDetail(parseInt(route.params.projectId as string))
        await projectStore.getProjectCommissionDates(false, undefined)
        await projectStore.getProjectReview(parseInt(route.params.projectId as string))
        initProjectReview()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

// Get association details if applicant is an association
async function onGetAssociationDetails() {
    if (projectReview.value.association) {
        try {
            await associationStore.getAssociationDetail(projectReview.value.association, false)
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

// Submit step 1 & 2 (basic infos about applicant and project)
async function onSubmitProjectReviewInfos(nextStep: number) {
    try {
        await patchProjectReview()
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

async function onGetProjectDocuments() {
    try {
        await getDocuments('DOCUMENT_PROJECT_REVIEW')
        initProcessProjectDocuments()
        await projectStore.getProjectDocuments()
        initDocumentUploads()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

async function onUploadDocuments(nextStep: number) {
    loading.show()
    if (projectStore.project) {
        try {
            await uploadDocuments(parseInt(route.params.associationId as string))
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
    loading.hide()
}

/*async function onGetFile(uploadedDocument: ProcessDocument) {
    try {
        const file = await getFile(uploadedDocument.pathFile as string)
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(file)
        link.download = uploadedDocument.name as string
        document.body.appendChild(link)
        link.click()
        link.remove()
    }  catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}*/

async function onSubmitProjectReview() {
    try {
        await submitProjectReview()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}
</script>

<template>
    <section class="dashboard-section">
        <div class="form-title">
            <h2>
                <i
                    aria-hidden="true"
                    class="bi bi-pencil-square"
                ></i>
                {{ t('project.submit-review') }}
            </h2>
        </div>

        <div class="form-container">
            <div class="form">
                <!-- Info panel -->
                <div class="info-panel">
                    <i
                        aria-hidden="true"
                        class="bi bi-exclamation-lg"
                    ></i>
                    <p>{{ t('project.form-help') }}</p>
                    <p>
                        {{ t('project.required-documents-list') + ' :' }}
                    </p>
                    <p class="paragraph">
                        <ul role="list">
                            <li
                                v-for="(document, index) in processDocuments"
                                :key="index"
                            >
                                <span v-if="document.pathTemplate">
                                    <a
                                        :href="document.pathTemplate"
                                        target="_blank"
                                        :title="t('project.document.download-template')"
                                    >{{ document.description }}</a>
                                </span>
                                <span v-else>{{ document.description }}</span>
                            </li>
                        </ul>
                    </p>
                </div>

                <QStepper
                    ref="stepper"
                    v-model="step"
                    animated
                    header-nav
                >
                    <!-- BASIC INFOS -->
                    <QStep
                        :name="1"
                        :title="t('project.general-infos')"
                        icon="mdi-card-text-outline"
                    >
                        <QForm
                            @submit.prevent="onSubmitProjectReviewInfos(2)"
                        >
                            <fieldset>
                                <legend class="title-2">{{ t('project.general-infos') }}</legend>
                                <QInput
                                    v-model="projectReview.name"
                                    :label="t('project.name')"
                                    filled
                                    readonly
                                />
                                <QInput
                                    v-model="projectReview.realStartDate"
                                    :label="t('project.planned-start-date') + ' *'"
                                    :rules="[
                                        val => val && val.length > 0 || t('forms.fill-field'),
                                        val => val && datesAreLegal || t('forms.legal-dates')
                                    ]"
                                    aria-required="true"
                                    filled
                                    reactive-rules
                                    type="date"
                                    :hint="t('project.real-date-hint')"
                                    clearable
                                />
                                <QInput
                                    v-model="projectReview.realEndDate"
                                    :label="t('project.planned-end-date') + ' *'"
                                    :rules="[
                                        val => val && val.length > 0 || t('forms.fill-field'),
                                        val => val && datesAreLegal || t('forms.legal-dates')
                                    ]"
                                    aria-required="true"
                                    filled
                                    reactive-rules
                                    type="date"
                                    :hint="t('project.real-date-hint')"
                                    clearable
                                />
                                <QInput
                                    v-model="projectReview.realLocation"
                                    :label="t('project.planned-location') + ' *'"
                                    :rules="[val => val && val.length > 0 || t('forms.fill-field')]"
                                    aria-required="true"
                                    filled
                                    lazy-rules
                                    :hint="t('project.real-location-hint')"
                                    clearable
                                />
                            </fieldset>

                            <QSeparator/>

                            <FormProjectBearerInfos
                                :applicant="projectReview.association ? 'association' : 'user'"
                                process="review"
                            />

                            <QSeparator/>

                            <fieldset>
                                <legend class="title-3">{{ t('commission.dates') }}</legend>

                                <div
                                    class="display-row"
                                    v-for="projectCommissionDate in projectStore.projectCommissionDates"
                                    :key="projectCommissionDate.id"
                                >
                                    <p class="row-title">{{ commissionDatesLabels.find(obj => obj.value === projectCommissionDate.commissionDate)?.label }}</p>

                                    <p class="paragraph">
                                        <ul>
                                            <li>{{ t('project.amount-asked') }} : {{ projectCommissionDate.amountAsked + CURRENCY}}</li>
                                            <li>{{ t('project.amount-earned') }} : {{ projectCommissionDate.amountEarned + CURRENCY}}</li>
                                        </ul>
                                    </p>
                                </div>
                            </fieldset>

                            <QSeparator/>

                            <fieldset>
                                <legend class="title-3">{{ t('project.outcome') + ' / ' +  t('project.income')}}</legend>

                                <QInput
                                    v-model="projectReview.outcome"
                                    :label="t('project.outcome') + ' *'"
                                    :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                    aria-required="true"
                                    filled
                                    lazy-rules
                                    type="number"
                                    min="0"
                                    inputmode="numeric"
                                    clearable
                                />

                                <QInput
                                    v-model="projectReview.income"
                                    :label="t('project.income') + ' *'"
                                    :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                    aria-required="true"
                                    filled
                                    lazy-rules
                                    type="number"
                                    min="0"
                                    inputmode="numeric"
                                    clearable
                                />
                            </fieldset>
                            <section class="form-page-navigation">
                                <QBtn
                                    :label="t('continue')"
                                    icon-right="bi-check2"
                                    type="submit"
                                />
                            </section>
                        </QForm>
                    </QStep>

                    <!-- REVIEW -->
                    <QStep
                        :name="2"
                        :title="t('project.review')"
                        icon="mdi-chart-box-outline"
                    >
                        <QForm
                            @submit.prevent="onSubmitProjectReviewInfos(3)"
                        >
                            <fieldset>
                                <legend class="title-3">{{ t('project.review') }}</legend>

                                <QInput
                                    v-model="projectReview.review"
                                    :label="t('project.moral-review') + ' *'"
                                    :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                    aria-required="true"
                                    filled
                                    lazy-rules
                                    type="textarea"
                                    clearable
                                    :hint="t('project.moral-review-hint')"
                                />
                                <QInput
                                    v-model="projectReview.impactStudents"
                                    :label="t('project.impact-students') + ' *'"
                                    :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                    aria-required="true"
                                    filled
                                    lazy-rules
                                    type="textarea"
                                    clearable
                                />
                                <QInput
                                    v-model="projectReview.description"
                                    :label="t('project.description') + ' *'"
                                    :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                    aria-required="true"
                                    filled
                                    lazy-rules
                                    type="textarea"
                                    clearable
                                    :hint="t('project.description-hint')"
                                />
                                <QInput
                                    v-model="projectReview.difficulties"
                                    :label="t('project.difficulties') + ' *'"
                                    :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                    aria-required="true"
                                    filled
                                    lazy-rules
                                    type="textarea"
                                    clearable
                                />
                                <QInput
                                    v-model="projectReview.improvements"
                                    :label="t('project.improvements') + ' *'"
                                    :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                    aria-required="true"
                                    filled
                                    lazy-rules
                                    type="textarea"
                                    clearable
                                />
                            </fieldset>
                            <section class="form-page-navigation">
                                <QBtn
                                    :label="t('back')"
                                    icon="bi-chevron-left"
                                    @click="onSubmitProjectReviewInfos(1)"
                                />
                                <QBtn
                                    :label="t('continue')"
                                    icon-right="bi-check2"
                                    type="submit"
                                />
                            </section>
                        </QForm>
                    </QStep>

                    <!-- DOCUMENTS -->
                    <QStep
                        :name="3"
                        :title="t('project.documents')"
                        icon="mdi-file-document-outline"
                    >
                        <QForm
                            @submit.prevent="onUploadDocuments(4)"
                        >
                            <h3 class="title-2">{{ t('project.documents') }}</h3>

                            <FormProjectDocumentUploads/>

                            <section class="form-page-navigation">
                                <QBtn
                                    :label="t('back')"
                                    icon="bi-chevron-left"
                                    @click="onUploadDocuments(2)"
                                />
                                <QBtn
                                    :label="t('continue')"
                                    icon-right="bi-check2"
                                    type="submit"
                                />
                            </section>
                        </QForm>
                    </QStep>

                    <!-- RECAP -->
                    <QStep
                        :name="4"
                        :title="t('recap')"
                        icon="mdi-check"
                    >
                        <QForm
                            @submit.prevent="onSubmitProjectReview"
                        >
                            <h3 class="title-2">{{ t('recap') }}</h3>

                            <section class="recap-sections">
                                <!-- BASIC INFOS RECAP -->
                                <section class="recap-section">
                                    <div class="recap-section-title">
                                        <h4 class="title-3">{{ t('project.general-infos') }}</h4>
                                        <QBtn
                                            :label="t('modify')"
                                            icon="bi-pencil"
                                            @click="() => step = 1"
                                        />
                                    </div>

                                    <section class="flex-section">
                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.name') }}</p>
                                            <p>{{ projectStore.project?.name }}</p>
                                        </div>

                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.planned-start-date') }}</p>
                                            <p>{{ formatDate(projectReview.realStartDate).split('-').reverse().join('/') }}</p>
                                        </div>

                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.planned-end-date') }}</p>
                                            <p>{{ formatDate(projectReview.realEndDate).split('-').reverse().join('/') }}</p>
                                        </div>

                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.planned-location') }}</p>
                                            <p>{{ projectReview.realLocation }}</p>
                                        </div>

                                        <h5 class="title-4">{{ t('project.contact-infos') }}</h5>

                                        <section
                                            v-if="projectReview.association"
                                            class="flex-section"
                                        >
                                            <div class="display-row">
                                                <p class="row-title">{{ t('project.other-first-name') }}</p>
                                                <p>{{ projectReview.otherFirstName }}</p>
                                            </div>
                                            <div class="display-row">
                                                <p class="row-title">{{ t('project.other-last-name') }}</p>
                                                <p>{{ projectReview.otherLastName }}</p>
                                            </div>
                                            <div class="display-row">
                                                <p class="row-title">{{ t('project.other-email') }}</p>
                                                <p>{{ projectReview.otherEmail }}</p>
                                            </div>
                                        </section>
                                        <section
                                            v-else
                                            class="flex-section"
                                        >
                                            <div class="display-row">
                                                <p class="row-title">{{ t('user.first-name') }}</p>
                                                <p>{{ userToUpdate.firstName }}</p>
                                            </div>
                                            <div class="display-row">
                                                <p class="row-title">{{ t('user.last-name') }}</p>
                                                <p>{{ userToUpdate.lastName }}</p>
                                            </div>
                                            <div class="display-row">
                                                <p class="row-title">{{ t('user.email') }}</p>
                                                <p>{{ userToUpdate.email }}</p>
                                            </div>
                                            <div class="display-row">
                                                <p class="row-title">{{ t('user.phone') }}</p>
                                                <p>{{ userToUpdate.phone }}</p>
                                            </div>
                                            <div class="display-row">
                                                <p class="row-title">{{ t('address.address') }}</p>
                                                <p>
                                                    {{ userToUpdate.address }}<br />
                                                    {{ userToUpdate.zipcode + ' ' + userToUpdate.city }}<br />
                                                    {{ userToUpdate.country }}
                                                </p>
                                            </div>
                                        </section>

                                        <h5 class="title-4">{{ t('commission.dates') }}</h5>

                                        <div
                                            class="display-row"
                                            v-for="projectCommissionDate in projectStore.projectCommissionDates"
                                            :key="projectCommissionDate.id"
                                        >
                                            <p class="row-title">{{ commissionDatesLabels.find(obj => obj.value === projectCommissionDate.commissionDate)?.label }}</p>

                                            <p class="paragraph">
                                                <ul>
                                                    <li>{{ t('project.amount-asked') }} : {{ projectCommissionDate.amountAsked + CURRENCY}}</li>
                                                    <li>{{ t('project.amount-earned') }} : {{ projectCommissionDate.amountEarned + CURRENCY}}</li>
                                                </ul>
                                            </p>
                                        </div>

                                        <h5 class="title-4">{{ t('project.outcome') + ' / ' + t('project.income') }}</h5>

                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.outcome') }}</p>
                                            <p>{{ projectReview.outcome + CURRENCY }}</p>
                                        </div>

                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.income') }}</p>
                                            <p>{{ projectReview.income + CURRENCY }}</p>
                                        </div>
                                    </section>
                                </section>

                                <!-- REVIEW INFOS -->
                                <section class="recap-section">
                                    <div class="recap-section-title">
                                        <h4 class="title-3">{{ t('project.review') }}</h4>
                                        <QBtn
                                            :label="t('modify')"
                                            icon="bi-pencil"
                                            @click="() => step = 2"
                                        />
                                    </div>

                                    <section class="flex-section">
                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.review') }}</p>
                                            <p>{{ projectReview.review }}</p>
                                        </div>

                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.impact-students') }}</p>
                                            <p>{{ projectReview.impactStudents }}</p>
                                        </div>

                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.description') }}</p>
                                            <p>{{ projectReview.description }}</p>
                                        </div>

                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.difficulties') }}</p>
                                            <p>{{ projectReview.difficulties }}</p>
                                        </div>

                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.improvements') }}</p>
                                            <p>{{ projectReview.improvements }}</p>
                                        </div>
                                    </section>
                                </section>
                            </section>

                            <!-- DOCUMENTS -->
                            <section class="recap-section">
                                <div class="recap-section-title">
                                    <h4 class="title-3">{{ t('project.documents') }}</h4>
                                    <QBtn
                                        :label="t('modify')"
                                        icon="bi-pencil"
                                        @click="() => step = 3"
                                    />
                                </div>

                                <div class="info-panel info-panel-warning">
                                    <i
                                        class="bi bi-exclamation-lg"
                                        aria-hidden="true"
                                    ></i>
                                    <p>{{ t('project.document.verify') }}</p>
                                </div>
                            </section>
                            <FormProjectRecapDocuments/>
                            <section class="form-page-navigation">
                                <QBtn
                                    :label="t('back')"
                                    icon="bi-chevron-left"
                                    @click="step = 3"
                                />
                                <QBtn
                                    :label="t('project.submit-review')"
                                    icon-right="bi-check2"
                                    type="submit"
                                />
                            </section>
                        </QForm>
                    </QStep>
                </QStepper>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/_variables.scss';
@import '@/assets/styles/dashboard.scss';

.q-form, fieldset {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.display-row {
    width: 100%;
}

.no-rules {
    padding-bottom: 20px;
}

.recap-section {
    margin-bottom: 2rem;
}

.recap-section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

h4 {
    margin: 2rem 0 1rem 0;
}

.flex-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.address-fields div {
    display: flex;
    gap: 1rem;
}

.address-fields div * {
    width: 100%;
}

.form {
    width: 75% !important;
}

</style>

