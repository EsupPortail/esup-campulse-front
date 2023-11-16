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
import useDocumentUploads from '@/composables/useDocumentUploads'
import router from '@/router'
import useErrors from '@/composables/useErrors'
import type {UploadedProcessDocument} from '#/documents'
import FormUserAddress from '@/components/form/FormUserAddress.vue'
import ProjectRecap from '@/components/project/ProjectRecap.vue'
import ProjectComments from '@/components/project/ProjectComments.vue'
import InfoProcessDocuments from '@/components/infoPanel/InfoProcessDocuments.vue'
import FormDocumentUploads from '@/components/form/FormDocumentUploads.vue'
import InfoFormRequiredFields from '@/components/infoPanel/InfoFormRequiredFields.vue'
import type {AssociationUserDetail} from '#/user'

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
    uploadDocuments,
    createUploadedFileLink
} = useDocumentUploads()
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
    // We get project detail
    projectId.value = parseInt(route.params.projectId as string)
    // We set if it is a new project
    newProject.value = !projectId.value
    // We get project detail
    await onGetProjectDetail()
    // If project is not a draft, then push to 404
    if (projectStore.project && projectStore.project.id === projectId.value) {
        const acceptedStatuses = ['PROJECT_DRAFT', 'PROJECT_DRAFT_PROCESSED']
        if (!acceptedStatuses.includes(projectStore.project.projectStatus)) {
            await router.push({name: '404'})
        }
    }
    // We set the association user
    associationUser.value = userStore.userAssociations
        .find(obj => obj.association.id === associationId.value)
    // We get project categories
    await onGetProjectCategories()
    // Get association users
    await onGetAssociationUsers()
    // Empty project commission funds to make sure we don't delete unrelated objects (security for student + commission member account)
    projectStore.projectCommissionFunds = []
    // When everything is done, then the page can be fully loaded
    isLoaded.value = true
    // Check if user can update project
    await canUpdateProject()
    loading.hide()
})

const step = ref(1)

watch(() => step.value, () => {
    if (step.value === 2) {
        setTimeout(() => {
            document.getElementById('stepper')?.scrollIntoView(true)
        }, 1000)
    } else {
        document.getElementById('stepper')?.scrollIntoView(true)
    }
})

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

// REFS
const applicant = ref<'association' | 'user' | undefined>(route.name === 'SubmitProjectAssociation' ? 'association' : 'user')

const associationId = ref<number>(parseInt(route.params.associationId as string))

const projectId = ref<number>()
watch(() => projectId.value, () => {
    // If the project has not been posted yet, we clean project store
    if (!projectId.value) {
        projectStore.project = undefined
        projectStore.projectCategories = []
        reInitSubmitProjectForm()
    }
    // We set if the project is a re-edition or not
    projectReEdition.value = !!projectStore.projectCommissionFunds.find(obj => obj.isFirstEdition === false)
})

const associationUser = ref<AssociationUserDetail | undefined>()

watch(() => userStore.userAssociations, () => {
    associationUser.value = userStore.userAssociations
        .find(obj => obj.association.id === associationId.value)
})

watch(() => associationUser.value, () => {
    hasPresidentStatus.value = userStore.hasPresidentStatus(associationId.value)
    isSite.value = !!(associationUser.value && associationUser.value?.association.isSite && applicant.value === 'association')
})

const hasPresidentStatus = ref<boolean>(false)

const newProject = ref<boolean>(true)

const newProjectPosted = ref<boolean>(false)

const projectReEdition = ref<boolean>(false)

const isSite = ref<boolean>(false)

const isLoaded = ref<boolean>(false)

const canUpdateProject = async () => {
    let canUpdateProject = false
    // If the applicant is an association
    if (applicant.value === 'association') {
        if (associationUser.value?.association?.canSubmitProjects) {
            if (hasPresidentStatus.value) {
                canUpdateProject = true
            } else if (projectStore.project?.associationUser === associationUser.value?.id) {
                canUpdateProject = true
            }
        }
    }
    // If the applicant is a user
    else {
        canUpdateProject = true
    }
    if (!canUpdateProject) {
        await router.push({name: '404'})
    }
}

// CHECKING IF PROJECT BASIC INFOS DATES ARE LEGAL
const datesAreLegal = ref<boolean>(true)
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
                    message: catchHTTPError(error.response)
                })
            }
        }
    }
}

async function onGetProjectCategories() {
    try {
        await projectStore.getProjectCategoryNames()
        if ((!newProject.value || newProjectPosted.value) && projectStore.project) {
            await projectStore.getProjectCategories()
            initProjectCategories()
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
}

async function onGetFile(uploadedDocument: UploadedProcessDocument) {
    try {
        await createUploadedFileLink(uploadedDocument.pathFile as string, uploadedDocument.name as string)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
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
                message: catchHTTPError(error.response)
            })
        }
    }
}

// GET DATA FOR STEP 2
async function onGetCommissionDates() {
    loading.show()
    try {
        await getCommissionsForStudents(true, isSite.value)
        initCommissionLabels()
        await getFunds()
        await getCommissionFunds()
        if (!newProject.value) {
            await projectStore.getProjectCommissionFunds(false, undefined)
            projectCommission.value = commissionFunds.value
                .find(obj => obj.id === projectStore.projectCommissionFunds[0].commissionFund)?.commission as number
            if (projectCommission.value) {
                initChosenCommissionFundsLabels(projectCommission.value as number, isSite.value)
                projectCommissionFunds.value = projectStore.projectCommissionFunds
                    .map(x => x.commissionFund)
            }
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
    loading.hide()
}

// GET DATA FOR STEP 3
async function onGetProjectBudget() {
    loading.show()
    try {
        await projectStore.getProjectCommissionFunds(false, undefined)
        initProjectBudget()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
    loading.hide()
}

// GET DATA FOR STEP 4
function onGetProjectGoals() {
    initProjectGoals()
}

// SUBMIT STEP 1
async function onSubmitBasicInfos(nextStep: number) {
    loading.show()
    try {
        if (newProject.value && !newProjectPosted.value) {
            await postNewProject(parseInt(route.params.associationId as string))
            newProjectPosted.value = true
        } else {
            await patchProjectBasicInfos()
        }
        await updateProjectCategories()
        await onGetProjectCategories()
        step.value = nextStep
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
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
                message: catchHTTPError(error.response)
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
                    message: catchHTTPError(error.response)
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
                    message: catchHTTPError(error.response)
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
            await uploadDocuments(
                applicant.value === 'association' ? associationId.value : undefined,
                applicant.value === 'user' ? userStore.user?.username : undefined,
                false
            )
            step.value = nextStep
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                notify({
                    type: 'negative',
                    message: catchHTTPError(error.response)
                })
            }
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
                    message: catchHTTPError(error.response)
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
    <div class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-pencil-square"
            ></i>
            {{ t('project.submit-new-project') }}
        </h2>

        <div class="dashboard-section-container">
            <div class="container">
                <InfoProcessDocuments
                    v-if="step === 1"
                    :processes="['DOCUMENT_PROJECT']"
                />
                <QStepper
                    id="stepper"
                    ref="stepper"
                    v-model="step"
                    active-color="commission-bold"
                    data-test="form-stepper"
                    animated
                >
                    <!-- BASIC INFOS -->
                    <QStep
                        :name="1"
                        :title="t('project.general-infos')"
                        data-test="project-step"
                        icon="bi-card-text"
                    >
                        <QForm
                            class="flex-column"
                            @submit.prevent="onSubmitBasicInfos(2)"
                        >
                            <InfoFormRequiredFields/>
                            <QInput
                                v-model="projectBasicInfos.name"
                                :label="t('project.name') + ' *'"
                                :rules="[val => val && val.length > 0 || t('forms.required-project-name')]"
                                aria-required="true"
                                clearable
                                color="commission"
                                data-test="name-input"
                                filled
                                lazy-rules
                            />
                            <QInput
                                v-model="projectBasicInfos.plannedStartDate"
                                :label="t('project.planned-start-date') + ' *'"
                                :rules="[val => val && val.length > 0 || t('forms.required-project-startdate'), val => val && datesAreLegal || t('forms.legal-dates')]"
                                aria-required="true"
                                clearable
                                color="commission"
                                data-test="planned-start-date-input"
                                filled
                                max="2120-01-01"
                                min="1970-01-01"
                                reactive-rules
                                type="date"
                            />
                            <QInput
                                v-model="projectBasicInfos.plannedEndDate"
                                :label="t('project.planned-end-date') + ' *'"
                                :rules="[val => val && val.length > 0 || t('forms.required-project-enddate'), val => val && datesAreLegal || t('forms.legal-dates')]"
                                aria-required="true"
                                clearable
                                color="commission"
                                data-test="planned-end-date-input"
                                filled
                                max="2120-01-01"
                                min="1970-01-01"
                                reactive-rules
                                type="date"
                            />
                            <QInput
                                v-model="projectBasicInfos.plannedLocation"
                                :label="t('project.planned-location') + ' *'"
                                :rules="[val => val && val.length > 0 || t('forms.required-project-location')]"
                                aria-required="true"
                                clearable
                                color="commission"
                                data-test="planned-location-input"
                                filled
                                lazy-rules
                            />
                            <QSelect
                                v-model="projectCategories"
                                :hint="t('forms.multiple-choices-enabled')"
                                :label="t('project.categories') + ' *'"
                                :options="projectStore.projectCategoriesLabels"
                                :rules="[val => val && val.length > 0 || t('forms.required-project-categories')]"
                                clearable
                                color="commission"
                                data-test="categories-select"
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
                                    :rules="[val => val || t('forms.required-project-association-user')]"
                                    clearable
                                    color="commission"
                                    data-test="association-select"
                                    emit-value
                                    filled
                                    lazy-rules
                                    map-options
                                />
                            </div>
                            <div v-else>
                                <div class="info-panel info-panel-warning">
                                    <i
                                        aria-hidden="true"
                                        class="bi bi-info"
                                    ></i>
                                    <p>{{ t('address.verify') }}</p>
                                </div>
                                <FormUserAddress
                                    :edited-by-staff="false"
                                    :user="userStore.user"
                                    color="commission"
                                />
                            </div>
                            <QInput
                                v-if="applicant === 'association'"
                                v-model="projectBasicInfos.partnerAssociation"
                                :label="t('project.partner-association')"
                                clearable
                                color="commission"
                                data-test="partner-association-input"
                                filled
                                lazy-rules
                            />
                            <div class="flex-row-center padding-top padding-bottom">
                                <QBtn
                                    :label="t('continue')"
                                    class="btn-lg"
                                    color="commission"
                                    data-test="continue-button"
                                    icon="bi-check2"
                                    type="submit"
                                />
                            </div>
                        </QForm>
                    </QStep>

                    <!-- COMMISSION CHOICE -->
                    <QStep
                        :name="2"
                        :title="t('project.commission-choice')"
                        data-test="project-step"
                        icon="bi-calendar"
                    >
                        <QForm
                            class="flex-column"
                            @submit.prevent="onSubmitCommission(3)"
                        >
                            <QSelect
                                v-model="projectCommission"
                                :label="t('project.commission-choice') + ' *'"
                                :options="commissionLabels"
                                :rules="[val => val || t('forms.select-project-commission-date')]"
                                clearable
                                color="commission"
                                data-test="commission-select"
                                emit-value
                                filled
                                for="projectCommission"
                                lazy-rules
                                map-options
                                @update:model-value="reInitProjectCommissionFunds(isSite)"
                            >
                                <template v-slot:hint>
                                    <p aria-describedby="projectCommission">
                                        {{
                                            t('project.commission-choice-hint')
                                        }}
                                    </p>
                                </template>
                            </QSelect>

                            <QSelect
                                v-model="projectCommissionFunds"
                                :label="t('project.commission-funds-choice') + ' *'"
                                :options="fundsLabels"
                                :readonly="!projectCommission"
                                :rules="[val => val || t('forms.select-project-commission-member')]"
                                clearable
                                color="commission"
                                data-test="commission-funds-select"
                                emit-value
                                filled
                                for="projectCommissionFunds"
                                lazy-rules
                                map-options
                                multiple
                                stack-label
                                use-chips
                            >
                                <template v-slot:hint>
                                    <p aria-describedby="projectCommissionFunds">
                                        {{ t('project.commission-funds-choice-hint') }}
                                    </p>
                                </template>
                            </QSelect>

                            <div class="flex-row-center padding-top padding-bottom">
                                <QBtn
                                    :label="t('back')"
                                    class="btn-lg"
                                    color="commission"
                                    data-test="back-button"
                                    icon="bi-chevron-left"
                                    @click="onSubmitCommission(1)"
                                />
                                <QBtn
                                    :label="t('continue')"
                                    class="btn-lg"
                                    color="commission"
                                    data-test="continue-button"
                                    icon="bi-check2"
                                    type="submit"
                                />
                            </div>
                        </QForm>
                    </QStep>

                    <!-- BUDGET -->
                    <QStep
                        :name="3"
                        :title="t('project.budget')"
                        data-test="project-step"
                        icon="bi-piggy-bank"
                    >
                        <QForm
                            class="flex-column"
                            @submit.prevent="onSubmitBudget(4)"
                        >
                            <QCheckbox
                                v-model="projectReEdition"
                                :label="t('project.re-edition')"
                                color="commission"
                                data-test="first-edition-checkbox"
                            />

                            <!-- Previous amounts -->
                            <div v-if="projectReEdition">
                                <div class="flex-column">
                                    <h3>{{ t('project.previous-asked') }}</h3>
                                    <QInput
                                        v-for="commissionFund in projectCommissionFundsDetail"
                                        :key="commissionFund.id"
                                        v-model="commissionFund.amountAskedPreviousEdition"
                                        :data-test="funds.find(obj => obj.id === (commissionFunds
                                            .find(obj => obj.id === commissionFund.commissionFund)?.fund))?.acronym + '-amount-asked-previous-edition-input'"
                                        :label="funds.find(obj => obj.id === (commissionFunds
                                            .find(obj => obj.id === commissionFund.commissionFund)?.fund))?.acronym + ' *'"
                                        :rules="projectReEdition ? [val => val && val.length > 0 || t('forms.required-project-amount-asked-previous')] : []"
                                        :shadow-text="` ${CURRENCY}`"
                                        color="commission"
                                        filled
                                        inputmode="numeric"
                                        min="0"
                                        type="number"
                                    />
                                </div>

                                <div class="flex-column">
                                    <h3>{{ t('project.previous-earned') }}</h3>
                                    <QInput
                                        v-for="commissionFund in projectCommissionFundsDetail"
                                        :key="commissionFund.id"
                                        v-model="commissionFund.amountEarnedPreviousEdition"
                                        :data-test="funds.find(obj => obj.id === (commissionFunds
                                            .find(obj => obj.id === commissionFund.commissionFund)?.fund))?.acronym + '-amount-earned-previous-edition-input'"
                                        :label="funds.find(obj => obj.id === (commissionFunds
                                            .find(obj => obj.id === commissionFund.commissionFund)?.fund))?.acronym + ' *'"
                                        :rules="projectReEdition ? [val => val && val.length > 0 || t('forms.required-project-amount-earned-previous')] : []"
                                        :shadow-text="` ${CURRENCY}`"
                                        color="commission"
                                        filled
                                        inputmode="numeric"
                                        min="0"
                                        type="number"
                                    />
                                </div>

                                <QInput
                                    v-model="projectBudget.budgetPreviousEdition"
                                    :label="t('project.budget-previous-edition') + ' *'"
                                    :rules="[val => val && val.length > 0 || t('forms.required-project-budget-previous')]"
                                    :shadow-text="` ${CURRENCY}`"
                                    aria-required="true"
                                    color="commission"
                                    data-test="budget-previous-edition-input"
                                    filled
                                    inputmode="numeric"
                                    lazy-rules
                                    min="0"
                                    type="number"
                                />

                                <QSeparator
                                    aria-hidden="true"
                                    class="margin-bottom"
                                />
                            </div>

                            <QInput
                                v-model="projectBudget.targetAudience"
                                :label="t('project.target-audience') + ' *'"
                                :rules="[val => val && val.length > 0 || t('forms.required-project-audience')]"
                                aria-required="true"
                                data-test="target-audience-textarea"
                                color="commission"
                                filled
                                reactive-rules
                                type="textarea"
                            />

                            <QInput
                                v-model="projectBudget.amountStudentsAudience"
                                :label="t('project.target-students-amount') + ' *'"
                                :rules="[val => val && val.length > 0 || t('forms.required-project-amount-students-audience'), val => val && correctAudienceAmount || t('forms.correct-amount-audience')]"
                                aria-required="true"
                                color="commission"
                                data-test="amount-students-audience-input"
                                filled
                                inputmode="numeric"
                                min="0"
                                reactive-rules
                                type="number"
                            />

                            <QInput
                                v-model="projectBudget.amountAllAudience"
                                :label="t('project.target-all-amount') + ' *'"
                                :rules="[val => val && val.length > 1 || t('forms.required-project-amount-audience'), val => val && correctAudienceAmount || t('forms.correct-amount-audience')]"
                                aria-required="true"
                                color="commission"
                                data-test="amount-all-audience-input"
                                filled
                                inputmode="numeric"
                                lazy-rules
                                min="1"
                                type="number"
                            />

                            <QInput
                                v-model="projectBudget.ticketPrice"
                                :label="t('project.ticket-price') + ' *'"
                                :rules="[val => val && val.length > 0 || t('forms.required-project-ticket')]"
                                :shadow-text="` ${CURRENCY}`"
                                aria-required="true"
                                color="commission"
                                data-test="ticket-price-input"
                                filled
                                inputmode="numeric"
                                lazy-rules
                                min="0"
                                type="number"
                            />

                            <QInput
                                v-model="projectBudget.studentTicketPrice"
                                :label="t('project.student-ticket-price') + ' *'"
                                :rules="[val => val && val.length > 0 || t('forms.required-project-ticket')]"
                                :shadow-text="` ${CURRENCY}`"
                                aria-required="true"
                                color="commission"
                                data-test="student-ticket-price-input"
                                filled
                                inputmode="numeric"
                                lazy-rules
                                min="0"
                                type="number"
                            />

                            <QInput
                                v-model="projectBudget.individualCost"
                                :label="t('project.individual-cost') + ' *'"
                                :rules="[val => val && val.length > 1 || t('forms.required-project-individual-cost'),
                                         val => val !== '0' || t('forms.required-project-individual-cost-not-null')]"
                                :shadow-text="` ${CURRENCY}`"
                                aria-required="true"
                                color="commission"
                                data-test="individual-cost-input"
                                filled
                                inputmode="numeric"
                                lazy-rules
                                min="1"
                                type="number"
                            />

                            <QSeparator
                                aria-hidden="true"
                                class="margin-bottom"
                            />

                            <section class="flex-column">
                                <h4>{{ t('project.amounts-asked') }}</h4>
                                <QInput
                                    v-for="commissionFund in projectCommissionFundsDetail"
                                    :key="commissionFund.id"
                                    v-model="commissionFund.amountAsked"
                                    :data-test="funds.find(obj => obj.id === (commissionFunds
                                        .find(obj => obj.id === commissionFund.commissionFund)?.fund))?.acronym + '-amount-asked-input'"
                                    :label="funds.find(obj => obj.id === (commissionFunds
                                        .find(obj => obj.id === commissionFund.commissionFund)?.fund))?.acronym + ' *'"
                                    :rules="[val => val && val.length > 0 || t('forms.required-project-budget')]"
                                    :shadow-text="` ${CURRENCY}`"
                                    color="commission"
                                    filled
                                    inputmode="numeric"
                                    min="0"
                                    type="number"
                                />
                            </section>

                            <div class="flex-row-center padding-top padding-bottom">
                                <QBtn
                                    :label="t('back')"
                                    class="btn-lg"
                                    color="commission"
                                    data-test="back-button"
                                    icon="bi-chevron-left"
                                    @click="onSubmitBudget(2)"
                                />
                                <QBtn
                                    :label="t('continue')"
                                    class="btn-lg"
                                    color="commission"
                                    data-test="continue-button"
                                    icon="bi-check2"
                                    type="submit"
                                />
                            </div>
                        </QForm>
                    </QStep>

                    <!-- GOALS -->
                    <QStep
                        :name="4"
                        :title="t('project.goals-title')"
                        data-test="project-step"
                        icon="bi-flag"
                    >
                        <QForm
                            class="flex-column"
                            @submit.prevent="onSubmitGoals(5)"
                        >
                            <QInput
                                v-model="projectGoals.goals"
                                :label="t('project.goals') + ' *'"
                                :rules="[val => val && val.length > 0 || t('forms.required-project-goals')]"
                                aria-required="true"
                                color="commission"
                                data-test="goals-textarea"
                                filled
                                lazy-rules
                                type="textarea"
                            />

                            <QInput
                                v-model="projectGoals.summary"
                                :label="t('project.summary') + ' *'"
                                :rules="[val => val && val.length > 0 || t('forms.required-project-summary')]"
                                aria-required="true"
                                color="commission"
                                data-test="summary-textarea"
                                filled
                                lazy-rules
                                type="textarea"
                            />

                            <QInput
                                v-model="projectGoals.plannedActivities"
                                :label="t('project.planned-activities') + ' *'"
                                :rules="[val => val && val.length > 0 || t('forms.required-project-activities')]"
                                aria-required="true"
                                color="commission"
                                data-test="planned-activities-textarea"
                                filled
                                lazy-rules
                                type="textarea"
                            />

                            <QInput
                                v-model="projectGoals.preventionSafety"
                                :label="t('project.prevention-safety') + ' *'"
                                :rules="[val => val && val.length > 0 || t('forms.required-project-safety')]"
                                aria-required="true"
                                color="commission"
                                data-test="prevention-safety-textarea"
                                filled
                                lazy-rules
                                type="textarea"
                            />

                            <QInput
                                v-model="projectGoals.marketingCampaign"
                                :label="t('project.marketing-campaign') + ' *'"
                                :rules="[val => val && val.length > 0 || t('forms.required-project-marketing')]"
                                aria-required="true"
                                color="commission"
                                data-test="marketing-campaign-textarea"
                                filled
                                lazy-rules
                                type="textarea"
                            />

                            <QInput
                                v-model="projectGoals.sustainableDevelopment"
                                :label="t('project.sustainable-development') + ' *'"
                                :rules="[val => val && val.length > 0 || t('forms.required-project-sustainable')]"
                                aria-required="true"
                                color="commission"
                                data-test="sustainable-development-textarea"
                                filled
                                lazy-rules
                                type="textarea"
                            />

                            <div class="flex-row-center padding-top padding-bottom">
                                <QBtn
                                    :label="t('back')"
                                    class="btn-lg"
                                    color="commission"
                                    data-test="back-button"
                                    icon="bi-chevron-left"
                                    @click="onSubmitGoals(3)"
                                />
                                <QBtn
                                    :label="t('continue')"
                                    class="btn-lg"
                                    color="commission"
                                    data-test="continue-button"
                                    icon="bi-check2"
                                    type="submit"
                                />
                            </div>
                        </QForm>
                    </QStep>

                    <!-- DOCUMENTS -->
                    <QStep
                        :name="5"
                        :title="t('project.documents')"
                        data-test="project-step"
                        icon="bi-file-earmark"
                    >
                        <QForm @submit.prevent="onUploadDocuments(6)">
                            <div class="info-panel info-panel-error">
                                <i
                                    aria-hidden="true"
                                    class="bi bi-exclamation-lg"
                                ></i>
                                <p>{{ t('project.sign-charter') }}</p>
                            </div>

                            <FormDocumentUploads
                                :association-id="associationId"
                                process="project"
                            />

                            <div class="flex-row-center padding-top padding-bottom">
                                <QBtn
                                    :label="t('back')"
                                    class="btn-lg"
                                    color="commission"
                                    data-test="back-button"
                                    icon="bi-chevron-left"
                                    @click="onUploadDocuments(4)"
                                />
                                <QBtn
                                    :label="t('continue')"
                                    class="btn-lg"
                                    color="commission"
                                    data-test="continue-button"
                                    icon="bi-check2"
                                    type="submit"
                                />
                            </div>
                        </QForm>
                    </QStep>

                    <!-- RECAP -->
                    <QStep
                        :name="6"
                        :title="t('recap')"
                        data-test="project-step"
                        icon="bi-check-lg"
                    >
                        <ProjectRecap
                            view="submitProject"
                            @submit-project="onSubmitProject"
                            @change-step="newStep => step = newStep"
                            @get-file="uploadDocument => onGetFile(uploadDocument)"
                        />
                    </QStep>
                </QStepper>
            </div>
        </div>

        <div class="dashboard-section">
            <h2>
                <i
                    aria-hidden="true"
                    class="bi bi-chat"
                ></i>
                {{ t('project.comments.title') }}
            </h2>
            <div class="dashboard-section-container">
                <div class="container">
                    <ProjectComments
                        v-if="isLoaded"
                        :project="projectId"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';
@import '@/assets/_variables.scss';
</style>
