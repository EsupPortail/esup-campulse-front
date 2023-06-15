<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import axios from 'axios'
import useSubmitProject from '@/composables/useSubmitProject'
import useUtility from '@/composables/useUtility'
import {useProjectStore} from '@/stores/useProjectStore'
import {useQuasar} from 'quasar'
import {onBeforeRouteLeave, useRoute} from 'vue-router'
import {useUserStore} from '@/stores/useUserStore'
import useCommissions from '@/composables/useCommissions'
import useProjectDocuments from '@/composables/useProjectDocuments'
import router from '@/router'
import useErrors from '@/composables/useErrors'
import type {ProcessDocument} from '#/documents'
import FormUserAddress from '@/components/form/FormUserAddress.vue'
import FormProjectRecap from '@/components/project/ProjectRecap.vue'
import ProjectComments from '@/components/project/ProjectComments.vue'

const {t} = useI18n()
const {
    projectBasicInfos,
    postNewProject,
    projectCategories,
    projectCommission,
    projectBudget,
    updateProjectCommission,
    projectGoals,
    updateProjectCategories,
    initProjectBasicInfos,
    patchProjectBasicInfos,
    initProjectCategories,
    projectCommissionFunds,
    initProjectBudget,
    patchProjectBudget,
    patchProjectCommissionFunds,
    patchProjectGoals,
    initProjectGoals,
    submitProject,
    reInitSubmitProjectForm,
    projectCommissionFundsDetail,
    reInitProjectCommissionFunds,
    initProjectAssociationUsersLabels,
    projectAssociationUsersLabels
} = useSubmitProject()
const {
    getDocuments,
    initProcessProjectDocuments,
    processDocuments,
    uploadDocuments,
    initDocumentUploads,
    documentUploads,
    deleteDocumentUpload,
    createFileLink
} = useProjectDocuments()
const {fromDateIsAnterior, CURRENCY} = useUtility()
const {
    getCommissionsForStudents,
    initCommissionLabels,
    commissionLabels,
    getFunds,
    fundsLabels,
    funds,
    commissionFunds,
    initChosenCommissionFundsLabels,
    getCommissionFunds
} = useCommissions()
const {catchHTTPError} = useErrors()
const {loading, notify} = useQuasar()
const projectStore = useProjectStore()
const userStore = useUserStore()
const route = useRoute()

onMounted(async () => {
    loading.show()
    projectId.value = parseInt(route.params.projectId as string)
    if (projectId.value) newProject.value = false
    await onGetProjectDetail()
    // If project is not a draft, then push to 404
    if (projectStore.project && projectStore.project?.projectStatus !== 'PROJECT_DRAFT') {
        await router.push({name: '404'})
    }
    initApplicant()
    // If the applicant is an association and the person trying to submit project is not a member of the association, redirect to 404
    if (applicant.value === 'association') {
        const association = userStore.userAssociations.find(obj => obj.association.id === parseInt(route.params.associationId as string))
        if (association) {
            associationId.value = association.association.id
            const associationUserId = association.id
            // If new project and user has no president status, redirect to 404
            if (newProject.value) {
                if (!userStore.hasPresidentStatus(associationId.value)) await router.push({name: '404'})
            }
            // If existing project and user has no president status nor project delegate status; redirect to 404
            else {
                if (!userStore.hasPresidentStatus(associationId.value) && projectStore.project?.associationUser !== associationUserId) {
                    await router.push({name: '404'})
                }
            }
            associationName.value = association.association.name
            initIsSite()
        } else await router.push({name: '404'})
    }
    await onGetProjectCategories()
    await onGetDocumentTypes()
    await onGetAssociationUsers()
    isLoaded.value = true
    loading.hide()
})

const step = ref(1)

watch(() => step.value === 2, async () => {
    loading.show()
    await onGetCommissionDates()
    loading.hide()
})
watch(() => step.value === 3, async () => {
    loading.show()
    await onGetProjectBudget()
    loading.hide()
})
watch(() => step.value === 4, async () => {
    loading.show()
    await onGetProjectGoals()
    loading.hide()
})
watch(() => step.value === 5, async () => {
    loading.show()
    await onGetProjectDocuments()
    loading.hide()
})

// REFS
const applicant = ref<'association' | 'user' | undefined>()

const associationName = ref<string | undefined>('')
const associationId = ref<number>()
const projectId = ref<number>()

const newProject = ref<boolean>(true)

const projectReEdition = ref<boolean>(false)
watch(() => projectStore.projectCommissionFunds.length, () => {
    if (projectStore.projectCommissionFunds.find(obj => obj.isFirstEdition === false)) projectReEdition.value = true
})

const isSite = ref<boolean>(false)

const isLoaded = ref<boolean>(false)

// CONST
const MAX_FILES = 10
const MAX_FILE_SIZE = 8388608

// INIT APPLICANT STATUS BASED ON ROUTER
const initApplicant = () => {
    if (route.name === 'SubmitProjectAssociation') applicant.value = 'association'
    else applicant.value = 'user'
}

// INIT IS SITE
const initIsSite = () => {
    const association = userStore.user?.associations.find(obj => obj.id === associationId.value)
    if (association && association.isSite && applicant.value === 'association') isSite.value = true
}

// CHECKING IF PROJECT BASIC INFOS DATES ARE LEGAL
const datesAreLegal = ref<boolean>(false)
watch(() => projectBasicInfos.value.plannedStartDate, () => {
    datesAreLegal.value = fromDateIsAnterior(projectBasicInfos.value.plannedStartDate, projectBasicInfos.value.plannedEndDate, true)
})
watch(() => projectBasicInfos.value.plannedEndDate, () => {
    datesAreLegal.value = fromDateIsAnterior(projectBasicInfos.value.plannedStartDate, projectBasicInfos.value.plannedEndDate, true)
})

// CHECKING IF PROJECT AUDIENCE AMOUNT NUMBERS ARE POSSIBLE
const correctAudienceAmount = ref<boolean>(false)
watch(() => projectBudget.value.amountStudentsAudience, () => {
    correctAudienceAmount.value = parseInt(projectBudget.value.amountStudentsAudience as string) <= parseInt(projectBudget.value.amountAllAudience as string)
})
watch(() => projectBudget.value.amountAllAudience, () => {
    correctAudienceAmount.value = parseInt(projectBudget.value.amountStudentsAudience as string) <= parseInt(projectBudget.value.amountAllAudience as string)
})

// GET DATA FOR STEP 1
async function onGetProjectDetail() {
    if (!newProject.value) {
        try {
            await projectStore.getProjectDetail(projectId.value as number)
            initProjectBasicInfos()
        } catch (error) {
            await router.push({name: '404'})
            if (axios.isAxiosError(error) && error.response) {
                notify({
                    type: 'negative',
                    message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
                })
            }
        }
    }
}

async function onGetProjectCategories() {
    try {
        await projectStore.getProjectCategoryNames()
        if (!newProject.value && projectStore.project) {
            await projectStore.getProjectCategories()
            initProjectCategories()
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

async function onGetDocumentTypes() {
    try {
        await getDocuments('DOCUMENT_PROJECT')
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

async function onGetFile(uploadedDocument: ProcessDocument) {
    try {
        await createFileLink(uploadedDocument)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

async function onGetAssociationUsers() {
    try {
        if (applicant.value === 'association' && associationId.value) {
            await initProjectAssociationUsersLabels(associationId.value)
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

// GET DATA FOR STEP 2
async function onGetCommissionDates() {
    try {
        await getCommissionsForStudents(undefined, isSite.value)
        initCommissionLabels()
        await getFunds()
        await getCommissionFunds()
        if (!newProject.value) {
            await projectStore.getProjectCommissionFunds(false, undefined)
            projectCommission.value = commissionFunds.value
                .find(obj => obj.id === projectStore.projectCommissionFunds[0].commissionFund)?.commission as number
            if (projectCommission.value) {
                initChosenCommissionFundsLabels(projectCommission.value as number)
                projectCommissionFunds.value = projectStore.projectCommissionFunds
                    .map(x => x.commissionFund)
            }
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

// GET DATA FOR STEP 3
function onGetProjectBudget() {
    initProjectBudget()
}

// GET DATA FOR STEP 4
function onGetProjectGoals() {
    initProjectGoals()
}

// GET DATA FOR STEP 5
async function onGetProjectDocuments() {
    try {
        await getDocuments('DOCUMENT_PROJECT')
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

// FILE TOO LARGE ON STEP 5
async function onDocumentRejected() {
    notify({
        type: 'negative',
        message: t('notifications.negative.413-error')
    })
}

// SUBMIT STEP 1
async function onSubmitBasicInfos(nextStep: number) {
    loading.show()
    try {
        if (newProject.value) {
            await postNewProject(parseInt(route.params.associationId as string))
        } else {
            await patchProjectBasicInfos()
        }
        await updateProjectCategories()
        step.value = nextStep
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

// SUBMIT STEP 2
async function onSubmitCommission(nextStep: number) {
    loading.show()
    try {
        await updateProjectCommission()
        step.value = nextStep
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

// SUBMIT STEP 3
async function onSubmitBudget(nextStep: number) {
    loading.show()
    if (projectStore.project) {
        try {
            await patchProjectBudget(!projectReEdition.value)
            await patchProjectCommissionFunds(!projectReEdition.value)
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

// SUBMIT STEP 4
async function onSubmitGoals(nextStep: number) {
    loading.show()
    if (projectStore.project) {
        try {
            await patchProjectGoals()
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

// SUBMIT STEP 5
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

// DELETE DOCS ON STEP 5
async function onDeleteDocumentUpload(documentId: number) {
    loading.show()
    try {
        await deleteDocumentUpload(documentId)
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

// SUBMIT STEP 6
async function onSubmitProject() {
    loading.show()
    if (projectStore.project) {
        try {
            await submitProject()
            await router.push({name: 'SubmitProjectSuccessful', params: {projectId: projectStore.project?.id}})
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

// WHEN THE USER LEAVES THE PAGE, WE CLEAR OR INPUTS
onBeforeRouteLeave(reInitSubmitProjectForm)

</script>

<template>
    <section class="dashboard-section">
        <div class="form-title">
            <h2>
                <i
                    aria-hidden="true"
                    class="bi bi-pencil-square"
                ></i>
                {{ t('project.submit-new-project') }}
            </h2>
        </div>

        <div class="form-container">
            <div class="form">
                <div class="info-panel">
                    <i
                        aria-hidden="true"
                        class="bi bi-info"
                    ></i>
                    <p>{{ t('project.form-help') }}</p>
                    <p>
                        {{ t('project.info-panel-status') }}
                        {{
                            applicant === 'association' ? t('project.info-panel-status-association') : t('project.info-panel-status-individual') + '.'
                        }}
                        <span v-if="applicant === 'association'"><strong>{{ associationName }}</strong>.</span>
                    </p>
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
                                        :title="t('project.document.download-template')"
                                        target="_blank"
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
                >
                    <!-- BASIC INFOS -->
                    <QStep
                        :name="1"
                        :title="t('project.general-infos')"
                        icon="bi-card-text"
                    >
                        <QForm
                            @submit.prevent="onSubmitBasicInfos(2)"
                        >
                            <h3 class="title-2">{{ t('project.general-infos') }}</h3>

                            <QInput
                                v-model="projectBasicInfos.name"
                                :label="t('project.name') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                aria-required="true"
                                clearable
                                filled
                                lazy-rules
                            />
                            <QInput
                                v-model="projectBasicInfos.plannedStartDate"
                                :label="t('project.planned-start-date') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field'), val => val && datesAreLegal || t('forms.legal-dates')]"
                                aria-required="true"
                                clearable
                                filled
                                lazy-rules
                                type="date"
                            />
                            <QInput
                                v-model="projectBasicInfos.plannedEndDate"
                                :label="t('project.planned-end-date') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field'), val => val && datesAreLegal || t('forms.legal-dates')]"
                                aria-required="true"
                                clearable
                                filled
                                lazy-rules
                                type="date"
                            />
                            <QInput
                                v-model="projectBasicInfos.plannedLocation"
                                :label="t('project.planned-location') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                aria-required="true"
                                clearable
                                filled
                                lazy-rules
                            />
                            <QSelect
                                v-model="projectCategories"
                                :hint="t('forms.multiple-choices-enabled')"
                                :label="t('project.categories') + ' *'"
                                :options="projectStore.projectCategoriesLabels"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                clearable
                                emit-value
                                filled
                                lazy-rules
                                map-options
                                multiple
                                use-chips
                            />
                            <div v-if="applicant === 'association'">
                                <QSelect
                                    v-model="projectBasicInfos.associationUser"
                                    :label="t('project.association-user') + ' *'"
                                    :options="projectAssociationUsersLabels"
                                    :rules="[ val => val || t('forms.fill-field')]"
                                    clearable
                                    emit-value
                                    filled
                                    lazy-rules
                                    map-options
                                />
                            </div>
                            <fieldset
                                v-else
                                class="individual-bearer"
                            >
                                <legend class="title-3">{{ t('address.address') }}</legend>
                                <div class="info-panel info-panel-warning">
                                    <i
                                        aria-hidden="true"
                                        class="bi bi-info"
                                    ></i>
                                    <p>{{ t('address.verify') }}</p>
                                </div>
                                <FormUserAddress :user="userStore.user"/>
                            </fieldset>
                            <section class="btn-group">
                                <QBtn
                                    :label="t('continue')"
                                    icon-right="bi-check2"
                                    type="submit"
                                />
                            </section>
                        </QForm>
                    </QStep>

                    <!-- COMMISSION CHOICE -->
                    <QStep
                        :name="2"
                        :title="t('project.commission-choice')"
                        icon="bi-calendar"
                    >
                        <QForm
                            @submit.prevent="onSubmitCommission(3)"
                        >
                            <h3 class="title-2">{{ t('project.commission-choice') }}</h3>

                            <QSelect
                                v-model="projectCommission"
                                :hint="t('project.commission-choice-hint')"
                                :label="t('project.commission-choice') + ' *'"
                                :options="commissionLabels"
                                :rules="[ val => val || t('forms.fill-field')]"
                                emit-value
                                filled
                                lazy-rules
                                clearable
                                map-options
                                @update:model-value="reInitProjectCommissionFunds"
                            />

                            <QSelect
                                :readonly="!projectCommission"
                                v-model="projectCommissionFunds"
                                :hint="t('project.commission-funds-choice-hint')"
                                :label="t('project.commission-funds-choice') + ' *'"
                                :options="fundsLabels"
                                :rules="[ val => val || t('forms.fill-field')]"
                                emit-value
                                filled
                                lazy-rules
                                clearable
                                map-options
                                multiple
                                use-chips
                                stack-label
                            />

                            <section class="btn-group">
                                <QBtn
                                    :label="t('back')"
                                    icon="bi-chevron-left"
                                    @click="onSubmitCommission(1)"
                                />
                                <QBtn
                                    :label="t('continue')"
                                    icon-right="bi-check2"
                                    type="submit"
                                />
                            </section>
                        </QForm>
                    </QStep>

                    <!-- BUDGET -->
                    <QStep
                        :name="3"
                        :title="t('project.budget')"
                        icon="bi-piggy-bank"
                    >
                        <QForm
                            @submit.prevent="onSubmitBudget(4)"
                        >
                            <h3 class="title-2">{{ t('project.budget') }}</h3>

                            <QCheckbox
                                v-model="projectReEdition"
                                :label="t('project.re-edition')"
                            />

                            <!-- Previous amounts -->
                            <section
                                v-if="projectReEdition"
                                class="previous-budget"
                            >
                                <fieldset class="previous-budget-fieldset">
                                    <legend class="title-5">{{ t('project.previous-asked') }} :</legend>
                                    <section class="previous-budget-section">
                                        <QInput
                                            v-for="commissionFund in projectCommissionFundsDetail"
                                            :key="commissionFund.id"
                                            v-model="commissionFund.amountAskedPreviousEdition"
                                            :label="funds.find(obj => obj.id === (commissionFunds
                                                .find(obj => obj.id === commissionFund.commissionFund).fund))?.acronym + ' *'"
                                            :rules="projectReEdition ? [ val => val && val.length > 0 || t('forms.fill-field')] : []"
                                            :shadow-text="` ${CURRENCY}`"
                                            filled
                                            inputmode="numeric"
                                            min="0"
                                            type="number"
                                        />
                                    </section>
                                </fieldset>

                                <fieldset class="previous-budget-fieldset">
                                    <legend class="title-5">{{ t('project.previous-earned') }} :</legend>
                                    <section class="previous-budget-section">
                                        <QInput
                                            v-for="commissionFund in projectCommissionFundsDetail"
                                            :key="commissionFund.id"
                                            v-model="commissionFund.amountEarnedPreviousEdition"
                                            :label="funds.find(obj => obj.id === (commissionFunds
                                                .find(obj => obj.id === commissionFund.commissionFund).fund))?.acronym + ' *'"
                                            :rules="projectReEdition ? [ val => val && val.length > 0 || t('forms.fill-field')] : []"
                                            :shadow-text="` ${CURRENCY}`"
                                            filled
                                            inputmode="numeric"
                                            min="0"
                                            type="number"
                                        />
                                    </section>
                                </fieldset>

                                <QInput
                                    v-model="projectBudget.budgetPreviousEdition"
                                    :label="t('project.budget-previous-edition') + ' *'"
                                    :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                    :shadow-text="` ${CURRENCY}`"
                                    aria-required="true"
                                    filled
                                    inputmode="numeric"
                                    lazy-rules
                                    min="0"
                                    type="number"
                                />

                                <QSeparator
                                    aria-hidden="true"
                                    role="presentation"
                                />
                            </section>

                            <QInput
                                v-model="projectBudget.targetAudience"
                                :label="t('project.target-audience') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                aria-required="true"
                                filled
                                reactive-rules
                                type="textarea"
                            />

                            <QInput
                                v-model="projectBudget.amountStudentsAudience"
                                :label="t('project.target-students-amount') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field'), val => val && correctAudienceAmount || t('forms.correct-amount-audience')]"
                                aria-required="true"
                                filled
                                inputmode="numeric"
                                min="0"
                                reactive-rules
                                type="number"
                            />

                            <QInput
                                v-model="projectBudget.amountAllAudience"
                                :label="t('project.target-all-amount') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field'), val => val && correctAudienceAmount || t('forms.correct-amount-audience')]"
                                aria-required="true"
                                filled
                                inputmode="numeric"
                                lazy-rules
                                min="0"
                                type="number"
                            />

                            <QInput
                                v-model="projectBudget.ticketPrice"
                                :label="t('project.ticket-price') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                :shadow-text="` ${CURRENCY}`"
                                aria-required="true"
                                filled
                                inputmode="numeric"
                                lazy-rules
                                min="0"
                                type="number"
                            />

                            <QInput
                                v-model="projectBudget.amountStudentsAudience"
                                :label="t('project.target-students-amount') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field'),
                                          val => val && correctAudienceAmount || t('forms.correct-amount-audience')]"
                                aria-required="true"
                                filled
                                inputmode="numeric"
                                reactive-rules
                                min="0"
                                type="number"
                            />

                            <QInput
                                v-model="projectBudget.amountAllAudience"
                                :label="t('project.target-all-amount') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field'),
                                          val => val && correctAudienceAmount || t('forms.correct-amount-audience')]"
                                aria-required="true"
                                filled
                                inputmode="numeric"
                                lazy-rules
                                min="0"
                                type="number"
                            />

                            <QInput
                                v-model="projectBudget.ticketPrice"
                                :label="t('project.ticket-price') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                :shadow-text="` ${CURRENCY}`"
                                aria-required="true"
                                filled
                                inputmode="numeric"
                                lazy-rules
                                min="0"
                                type="number"
                            />

                            <QInput
                                v-model="projectBudget.individualCost"
                                :label="t('project.individual-cost') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                :shadow-text="` ${CURRENCY}`"
                                aria-required="true"
                                filled
                                inputmode="numeric"
                                lazy-rules
                                min="0"
                                type="number"
                            />

                            <QSeparator
                                aria-hidden="true"
                                role="presentation"
                            />

                            <section class="asked-budget">
                                <fieldset class="asked-budget-fieldset">
                                    <legend class="title-5">{{ t('project.amounts-asked') }} :</legend>
                                    <section class="asked-budget-section">
                                        <QInput
                                            v-for="commissionFund in projectCommissionFundsDetail"
                                            :key="commissionFund.id"
                                            v-model="commissionFund.amountAsked"
                                            :label="funds.find(obj => obj.id === (commissionFunds
                                                .find(obj => obj.id === commissionFund.commissionFund).fund))?.acronym + ' *'"
                                            :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                            :shadow-text="` ${CURRENCY}`"
                                            filled
                                            inputmode="numeric"
                                            min="0"
                                            type="number"
                                        />
                                    </section>
                                </fieldset>
                            </section>

                            <section class="btn-group">
                                <QBtn
                                    :label="t('back')"
                                    icon="bi-chevron-left"
                                    @click="onSubmitBudget(2)"
                                />
                                <QBtn
                                    :label="t('continue')"
                                    icon-right="bi-check2"
                                    type="submit"
                                />
                            </section>
                        </QForm>
                    </QStep>

                    <!-- GOALS -->
                    <QStep
                        :name="4"
                        :title="t('project.goals-title')"
                        icon="bi-flag"
                    >
                        <QForm
                            @submit.prevent="onSubmitGoals(5)"
                        >
                            <h3 class="title-2">{{ t('project.goals-title') }}</h3>

                            <QInput
                                v-model="projectGoals.goals"
                                :label="t('project.goals') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                aria-required="true"
                                filled
                                lazy-rules
                                type="textarea"
                            />

                            <QInput
                                v-model="projectGoals.summary"
                                :label="t('project.summary') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                aria-required="true"
                                filled
                                lazy-rules
                                type="textarea"
                            />

                            <QInput
                                v-model="projectGoals.plannedActivities"
                                :label="t('project.planned-activities') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                aria-required="true"
                                filled
                                lazy-rules
                                type="textarea"
                            />

                            <QInput
                                v-model="projectGoals.preventionSafety"
                                :label="t('project.prevention-safety') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                aria-required="true"
                                filled
                                lazy-rules
                                type="textarea"
                            />

                            <QInput
                                v-model="projectGoals.marketingCampaign"
                                :label="t('project.marketing-campaign') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                aria-required="true"
                                filled
                                lazy-rules
                                type="textarea"
                            />

                            <section class="btn-group">
                                <QBtn
                                    :label="t('back')"
                                    icon="bi-chevron-left"
                                    @click="onSubmitGoals(3)"
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
                        :name="5"
                        :title="t('project.documents')"
                        icon="bi-file-earmark"
                    >
                        <QForm
                            @submit.prevent="onUploadDocuments(6)"
                        >
                            <h3 class="title-2">{{ t('project.documents') }}</h3>

                            <div class="info-panel info-panel-warning">
                                <i
                                    aria-hidden="true"
                                    class="bi bi-exclamation-lg"
                                ></i>
                                <p>{{ t('project.sign-charter') }}</p>
                            </div>

                            <section class="flex-section">
                                <div
                                    v-for="(document, index) in processDocuments"
                                    :key="index"
                                >
                                    <QFile
                                        v-model="document.pathFile"
                                        :accept="document.mimeTypes?.join(', ')"
                                        :aria-required="document.isRequiredInProcess"
                                        :disable="document.isMultiple && documentUploads.filter(obj => obj.document === document.document).length >= MAX_FILES ||
                                            !document.isMultiple && documentUploads.filter(obj => obj.document === document.document).length === 1"
                                        :hint="t('project.document-hint') + (document.isMultiple ? (' ' + t('project.document-hint-multiple')) : '')"
                                        :label="document.description + (document.isRequiredInProcess ? ' *' : '')"
                                        :max-file-size="MAX_FILE_SIZE"
                                        :max-files="document.isMultiple ? (MAX_FILES - documentUploads.filter(obj => obj.document === document.document).length) :
                                            (1 - documentUploads.filter(obj => obj.document === document.document).length)"
                                        :multiple="document.isMultiple"
                                        :rules="document.isRequiredInProcess ? [val => val || t('forms.select-document')] : []"
                                        append
                                        clearable
                                        counter
                                        filled
                                        lazy-rules
                                        use-chips
                                        @rejected="onDocumentRejected"
                                    >
                                        <template v-slot:prepend>
                                            <QIcon name="mdi-paperclip"/>
                                        </template>
                                    </QFile>

                                    <div
                                        v-if="document.pathTemplate"
                                        class="info-panel info-panel-warning"
                                    >
                                        <i
                                            aria-hidden="true"
                                            class="bi bi-exclamation-lg"
                                        ></i>
                                        <p>
                                            {{ t('project.document.use-template') }} <span>
                                                <a
                                                    :href="document.pathTemplate"
                                                    target="_blank"
                                                >{{
                                                    `${t('project.document.download-template')} "${document.description}".`
                                                }}</a></span>
                                        </p>
                                    </div>

                                    <div class="document-input-group">
                                        <div class="document-input variant-space-3">
                                            <div class="document-input-list">
                                                <div
                                                    v-for="uploadedDocument in documentUploads.filter(obj => obj.document === document.document)"
                                                    :key="uploadedDocument.id"
                                                    class="document-item"
                                                >
                                                    <p @click="onGetFile(uploadedDocument)">
                                                        <i
                                                            aria-hidden="true"
                                                            class="bi bi-file-earmark"
                                                        ></i>
                                                        {{ uploadedDocument.name }}
                                                        <i
                                                            aria-hidden="true"
                                                            class="bi bi-eye"
                                                        ></i>
                                                    </p>
                                                    <button
                                                        type="button"
                                                        @click="onDeleteDocumentUpload(uploadedDocument.id ? uploadedDocument.id : 0)"
                                                    >
                                                        <i
                                                            aria-hidden="true"
                                                            class="bi bi-x-lg"
                                                        ></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section class="btn-group">
                                <QBtn
                                    :label="t('back')"
                                    icon="bi-chevron-left"
                                    @click="onUploadDocuments(4)"
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
                        :name="6"
                        :title="t('recap')"
                        icon="bi-check-lg"
                    >
                        <FormProjectRecap
                            view="submitProject"
                            @submit-project="onSubmitProject"
                            @change-step="newStep => step = newStep"
                            @get-file="uploadDocument => onGetFile(uploadDocument)"
                        />
                    </QStep>
                </QStepper>
            </div>
        </div>
    </section>
    <section
        class="dashboard-section"
    >
        <div class="form-title">
            <h2>
                <i
                    aria-hidden="true"
                    class="bi bi-chat"
                ></i>
                {{ t('project.comments.title') }}
            </h2>
        </div>
        <div class="form-container">
            <div class="form">
                <ProjectComments
                    v-if="isLoaded"
                    :project="projectId"
                />
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/_variables.scss';

.q-input, .q-select {
  padding: 1rem;
}

.display-row {
  width: 100%;
  margin: 0 1rem;
}

legend, p, h3 {
  padding: 0 1rem;
}

legend {
  margin-top: 1.5rem;
}

.radio-btn {
  padding-left: 0.5rem;
}

.paragraph {
  margin-bottom: 0.5rem;
}

.self-bearer {
  font-size: 1rem;
}

.form {
  width: 75%;
}

.individual-bearer {
  padding: 0 1rem
}

.document-item > p {
    cursor: pointer;
}
</style>
