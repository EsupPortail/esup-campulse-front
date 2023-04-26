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

const {t} = useI18n()
const {
    projectBasicInfos,
    postNewProject,
    projectCategories,
    projectCommissionDatesModel,
    projectCommissionDates,
    projectBudget,
    updateProjectCommissionDates,
    projectGoals,
    updateProjectCategories,
    initProjectBasicInfos,
    patchProjectBasicInfos,
    initProjectCategories,
    initProjectCommissionDatesModel,
    initProjectBudget,
    patchProjectBudget,
    patchProjectCommissionDates,
    initProjectCommissionDates,
    patchProjectGoals,
    initProjectGoals,
    submitProject,
    reInitSubmitProjectForm
} = useSubmitProject()
const {
    getDocumentTypes,
    initProcessProjectDocuments,
    processDocuments,
    postProjectDocuments,
    initDocumentUploads,
    documentUploads,
    deleteDocumentUpload,
    getFile
} = useProjectDocuments()
const {fromDateIsAnterior, CURRENCY} = useUtility()
const {
    getCommissions,
    commissions,
    getCommissionDates,
    commissionDatesLabels,
    commissionDates,
    initCommissionDatesLabels
} = useCommissions()
const {catchHTTPError} = useErrors()
const {loading, notify} = useQuasar()
const projectStore = useProjectStore()
const userStore = useUserStore()
const route = useRoute()

onMounted(async () => {
    loading.show()

    if (route.params.projectId) newProject.value = false

    await onGetProjectDetail()

    // If project is not a draft, then push to 404
    if (projectStore.project && projectStore.project?.projectStatus !== 'PROJECT_DRAFT') {
        await router.push({name: '404'})
    }

    initApplicant()
    if (applicant.value === 'association') {
        const association = userStore.user?.associations.find(obj => obj.id === parseInt(route.params.associationId as string))
        if (association) associationName.value = association.name
        else await router.push({name: '404'})
    }

    initIsSite()

    await onGetProjectCategories()
    await onGetDocumentTypes()
    loading.hide()
})

const step = ref(1)
const done1 = ref(false)
const done2 = ref(false)
const done3 = ref(false)
const done4 = ref(false)
const done5 = ref(false)
const done6 = ref(false)

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

const newProject = ref<boolean>(true)

const projectReEdition = ref<boolean>(false)
watch(() => projectStore.projectCommissionDates.length, () => {
    if (projectStore.projectCommissionDates.find(obj => obj.isFirstEdition === false)) projectReEdition.value = true
})

const isSite = ref<boolean | undefined>(undefined)

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
    isSite.value = applicant.value === 'association' && userStore.user?.associations.find(obj => obj.id === parseInt(route.params.associationId as string))?.isSite
}

// CHECKING IF PROJECT BASIC INFOS DATES ARE LEGAL
const datesAreLegal = ref<boolean>(false)
watch(() => projectBasicInfos.value.plannedStartDate, () => {
    datesAreLegal.value = fromDateIsAnterior(projectBasicInfos.value.plannedStartDate, projectBasicInfos.value.plannedEndDate)
})
watch(() => projectBasicInfos.value.plannedEndDate, () => {
    datesAreLegal.value = fromDateIsAnterior(projectBasicInfos.value.plannedStartDate, projectBasicInfos.value.plannedEndDate)
})

// CHECKING IF PROJECT AUDIENCE AMOUNT NUMBERS ARE POSSIBLE
const correctAudienceAmount = ref<boolean>(false)
watch(() => projectBudget.value.amountStudentsAudience, () => {
    correctAudienceAmount.value = Number(projectBudget.value.amountStudentsAudience) <= Number(projectBudget.value.amountAllAudience)
})
watch(() => projectBudget.value.amountAllAudience, () => {
    correctAudienceAmount.value = Number(projectBudget.value.amountStudentsAudience) <= Number(projectBudget.value.amountAllAudience)
})

// GET DATA FOR STEP 1
async function onGetProjectDetail() {
    if (!newProject.value) {
        try {
            await projectStore.getProjectDetail(parseInt(route.params.projectId as string))
            initProjectBasicInfos()
        }
        catch (error) {
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
        await getDocumentTypes()
        initProcessProjectDocuments('DOCUMENT_PROJECT')
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

async function onGetFile(pathFile: string, fileName: string) {
    try {
        const file = await getFile(pathFile)
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(file)
        link.download = fileName
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
}

// GET DATA FOR STEP 2
async function onGetCommissionDates() {
    if (!projectCommissionDatesModel.value.length) {
        try {
            await getCommissions()
            await getCommissionDates(true, false)
            await initCommissionDatesLabels(isSite.value)
            if (!newProject.value) {
                await projectStore.getProjectCommissionDates(false, undefined)
                initProjectCommissionDatesModel()
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
}

// GET DATA FOR STEP 3
async function onGetProjectBudget() {
    try {
        await getCommissions()
        await getCommissionDates(true, false)
        await projectStore.getProjectCommissionDates(false, undefined)
        initProjectCommissionDates()
        initProjectBudget()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

// GET DATA FOR STEP 4
function onGetProjectGoals() {
    if (projectStore.project) {
        initProjectGoals()
    }
}

// GET DATA FOR STEP 5
async function onGetProjectDocuments() {
    try {
        await getDocumentTypes()
        initProcessProjectDocuments('DOCUMENT_PROJECT')
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
        if (projectStore.project) {
            await updateProjectCategories()
            done1.value = true
            step.value = nextStep
        }
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
async function onSubmitCommissionDates(nextStep: number) {
    loading.show()
    if (projectStore.project) {
        try {
            await updateProjectCommissionDates()
            done2.value = true
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

// SUBMIT STEP 3
async function onSubmitBudget(nextStep: number) {
    loading.show()
    if (projectStore.project) {
        try {
            await patchProjectBudget(!projectReEdition.value)
            await patchProjectCommissionDates(!projectReEdition.value)
            done3.value = true
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
            done4.value = true
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
            await postProjectDocuments(parseInt(route.params.associationId as string))
            done5.value = true
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
            done6.value = true
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
                        class="bi bi-exclamation-lg"
                    ></i>
                    <p>{{ t('project.form-help') }}</p>
                    <p>
                        {{ t('project.info-panel-status') }}
                        {{ applicant === 'association' ? t('project.info-panel-status-association') : t('project.info-panel-status-individual') + '.' }}
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
                >
                    <!-- BASIC INFOS -->
                    <QStep
                        :done="done1"
                        :name="1"
                        :title="t('project.general-infos')"
                        icon="mdi-card-text-outline"
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
                                filled
                                lazy-rules
                            />
                            <QInput
                                v-model="projectBasicInfos.plannedStartDate"
                                :label="t('project.planned-start-date') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field'), val => val && datesAreLegal || t('forms.legal-dates')]"
                                aria-required="true"
                                filled
                                lazy-rules
                                type="date"
                            />
                            <QInput
                                v-model="projectBasicInfos.plannedEndDate"
                                :label="t('project.planned-end-date') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field'), val => val && datesAreLegal || t('forms.legal-dates')]"
                                aria-required="true"
                                filled
                                lazy-rules
                                type="date"
                            />
                            <QInput
                                v-model="projectBasicInfos.location"
                                :label="t('project.location') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                aria-required="true"
                                filled
                                lazy-rules
                            />
                            <QInput
                                v-model="projectBasicInfos.otherFirstName"
                                :label="t('project.other-first-name')"
                                filled
                                lazy-rules
                            />
                            <QInput
                                v-model="projectBasicInfos.otherLastName"
                                :label="t('project.other-last-name')"
                                filled
                                lazy-rules
                            />
                            <QInput
                                v-model="projectBasicInfos.otherEmail"
                                :label="t('project.other-email')"
                                filled
                                lazy-rules
                            />
                            <QInput
                                v-model="projectBasicInfos.otherPhone"
                                :label="t('project.other-phone')"
                                filled
                                lazy-rules
                            />
                            <QSelect
                                v-model="projectCategories"
                                :label="t('project.categories') + ' *'"
                                :options="projectStore.projectCategoriesLabels"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                emit-value
                                filled
                                lazy-rules
                                map-options
                                multiple
                                stack-label
                                use-chips
                                :hint="t('forms.multiple-choices-enabled')"
                            />
                            <section class="form-page-navigation">
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
                        :done="done2"
                        :name="2"
                        :title="t('project.commission-choice')"
                        icon="mdi-calendar-blank"
                    >
                        <QForm
                            @submit.prevent="onSubmitCommissionDates(3)"
                        >
                            <h3 class="title-2">{{ t('project.commission-choice') }}</h3>

                            <QSelect
                                v-model="projectCommissionDatesModel"
                                :hint="t('project.commission-choice-hint')"
                                :label="t('project.commission-choice') + ' *'"
                                :options="commissionDatesLabels"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                emit-value
                                filled
                                lazy-rules
                                map-options
                                multiple
                                stack-label
                                use-chips
                            />

                            <section class="form-page-navigation">
                                <QBtn
                                    :label="t('back')"
                                    icon="bi-chevron-left"
                                    @click="onSubmitCommissionDates(1)"
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
                        :done="done3"
                        :name="3"
                        :title="t('project.budget')"
                        icon="mdi-hand-coin-outline"
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
                                v-if="projectCommissionDates.length && projectReEdition"
                                class="previous-budget"
                            >
                                <fieldset class="previous-budget-fieldset">
                                    <legend class="title-5">{{ t('project.previous-asked') }} :</legend>
                                    <section class="previous-budget-section">
                                        <QInput
                                            v-for="(commissionDate, index) in projectCommissionDates"
                                            :key="index"
                                            v-model="commissionDate.amountAskedPreviousEdition"
                                            :label="commissions.find(obj => obj.id === commissionDates.find(obj => obj.id === commissionDate.commissionDate)?.commission)?.acronym + ' *'"
                                            :rules="projectReEdition ? [ val => val && val.length > 0 || t('forms.fill-field')] : []"
                                            filled
                                            type="number"
                                            min="0"
                                        />
                                    </section>
                                </fieldset>

                                <fieldset class="previous-budget-fieldset">
                                    <legend class="title-5">{{ t('project.previous-earned') }} :</legend>
                                    <section class="previous-budget-section">
                                        <QInput
                                            v-for="(commissionDate, index) in projectCommissionDates"
                                            :key="index"
                                            v-model="commissionDate.amountEarnedPreviousEdition"
                                            :label="commissions.find(obj => obj.id === commissionDates.find(obj => obj.id === commissionDate.commissionDate)?.commission)?.acronym + ' *'"
                                            filled
                                            type="number"
                                            min="0"
                                            :rules="projectReEdition ? [ val => val && val.length > 0 || t('forms.fill-field')] : []"
                                        />
                                    </section>
                                </fieldset>

                                <QInput
                                    v-model="projectBudget.budgetPreviousEdition"
                                    :label="t('project.budget-previous-edition') + ' *'"
                                    :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                    aria-required="true"
                                    filled
                                    lazy-rules
                                    type="number"
                                    min="0"
                                />

                                <QSeparator/>
                            </section>

                            <QInput
                                v-model="projectBudget.targetAudience"
                                :label="t('project.target-audience') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                aria-required="true"
                                filled
                                lazy-rules
                                type="textarea"
                            />

                            <QInput
                                v-model="projectBudget.amountStudentsAudience"
                                :label="t('project.target-students-amount') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field'), val => val && correctAudienceAmount || t('forms.correct-amount-audience')]"
                                aria-required="true"
                                filled
                                lazy-rules
                                type="number"
                                min="0"
                            />

                            <QInput
                                v-model="projectBudget.amountAllAudience"
                                :label="t('project.target-all-amount') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field'), val => val && correctAudienceAmount || t('forms.correct-amount-audience')]"
                                aria-required="true"
                                filled
                                lazy-rules
                                type="number"
                                min="0"
                            />

                            <QInput
                                v-model="projectBudget.ticketPrice"
                                :label="t('project.ticket-price') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                aria-required="true"
                                filled
                                lazy-rules
                                type="number"
                                min="0"
                            />

                            <QInput
                                v-model="projectBudget.individualCost"
                                :label="t('project.individual-cost') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                aria-required="true"
                                filled
                                lazy-rules
                                type="number"
                                min="0"
                            />

                            <QSeparator/>

                            <section class="asked-budget">
                                <fieldset class="asked-budget-fieldset">
                                    <legend class="title-5">{{ t('project.amounts-asked') }} :</legend>
                                    <section class="asked-budget-section">
                                        <QInput
                                            v-for="(commissionDate, index) in projectCommissionDates"
                                            :key="index"
                                            v-model="commissionDate.amountAsked"
                                            :label="commissions.find(obj => obj.id === commissionDates.find(obj => obj.id === commissionDate.commissionDate)?.commission)?.acronym + ' *'"
                                            filled
                                            type="number"
                                            min="0"
                                            inputmode="numeric"
                                            :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                        />
                                    </section>
                                </fieldset>
                            </section>

                            <section class="form-page-navigation">
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
                        :done="done4"
                        :name="4"
                        :title="t('project.goals-title')"
                        icon="mdi-flag-checkered"
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

                            <section class="form-page-navigation">
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
                        :done="done5"
                        :name="5"
                        :title="t('project.documents')"
                        icon="mdi-file-document-outline"
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
                                        :hint="t('project.document-hint') + (document.isMultiple ? (' ' + t('project.document-hint-multiple')) : '')"
                                        :label="document.description + (document.isRequiredInProcess ? ' *' : '')"
                                        :max-files="document.isMultiple ? (MAX_FILES - documentUploads.filter(obj => obj.document === document.document).length) :
                                            (1 - documentUploads.filter(obj => obj.document === document.document).length)"
                                        :max-file-size="MAX_FILE_SIZE"
                                        :multiple="document.isMultiple"
                                        :rules="document.isRequiredInProcess ? [val => val || t('forms.select-document')] : []"
                                        append
                                        clearable
                                        filled
                                        lazy-rules
                                        use-chips
                                        counter
                                        :disable="document.isMultiple && documentUploads.filter(obj => obj.document === document.document).length >= MAX_FILES ||
                                            !document.isMultiple && documentUploads.filter(obj => obj.document === document.document).length === 1"
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
                                                >{{ `${t('project.document.download-template')} "${document.description}".` }}</a></span>
                                        </p>
                                    </div>

                                    <div class="document-input-group">
                                        <div class="document-input variant-space-3">
                                            <div class="document-input-list">
                                                <div
                                                    class="document-item"
                                                    v-for="uploadedDocument in documentUploads.filter(obj => obj.document === document.document)"
                                                    :key="uploadedDocument.id"
                                                >
                                                    <p @click="onGetFile(uploadedDocument.pathFile, uploadedDocument.name)">
                                                        <i
                                                            class="bi bi-file-earmark"
                                                            aria-hidden="true"
                                                        ></i>
                                                        {{ uploadedDocument.name }}
                                                        <i
                                                            class="bi bi-eye"
                                                            aria-hidden="true"
                                                        ></i>
                                                    </p>
                                                    <button
                                                        type="button"
                                                        @click="onDeleteDocumentUpload(uploadedDocument.id ? uploadedDocument.id : 0)"
                                                    >
                                                        <i class="bi bi-x-lg"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section class="form-page-navigation">
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
                        :done="done6"
                        :name="6"
                        :title="t('recap')"
                        icon="mdi-check"
                    >
                        <QForm
                            @submit.prevent="onSubmitProject"
                        >
                            <h3 class="title-2">{{ t('recap') }}</h3>

                            <section class="recap-sections">
                                <!-- BASIC INFOS -->
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
                                            <p>{{ projectBasicInfos.name }}</p>
                                        </div>

                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.planned-start-date') }}</p>
                                            <p>
                                                {{
                                                    projectBasicInfos.plannedStartDate.split('-').reverse().join('/')
                                                }}
                                            </p>
                                        </div>

                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.planned-end-date') }}</p>
                                            <p>{{ projectBasicInfos.plannedEndDate.split('-').reverse().join('/') }}</p>
                                        </div>

                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.location') }}</p>
                                            <p>{{ projectBasicInfos.location }}</p>
                                        </div>

                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.other-first-name') }}</p>
                                            <p>{{ projectBasicInfos.otherFirstName }}</p>
                                        </div>

                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.other-last-name') }}</p>
                                            <p>{{ projectBasicInfos.otherLastName }}</p>
                                        </div>

                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.other-email') }}</p>
                                            <p>{{ projectBasicInfos.otherEmail }}</p>
                                        </div>

                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.other-phone') }}</p>
                                            <p>{{ projectBasicInfos.otherPhone }}</p>
                                        </div>
                                    </section>
                                </section>

                                <!-- COMMISSION CHOICE -->
                                <section class="recap-section">
                                    <div class="recap-section-title">
                                        <h4 class="title-3">{{ t('project.commission-choice') }}</h4>
                                        <QBtn
                                            :label="t('modify')"
                                            icon="bi-pencil"
                                            @click="() => step = 2"
                                        />
                                    </div>

                                    <section class="recap-chips">
                                        <QChip
                                            v-for="(commissionDate, index) in projectStore.projectCommissionDates"
                                            :key="index"
                                        >
                                            {{
                                                commissionDatesLabels.find(obj => obj.value === commissionDate.commissionDate)?.label
                                            }}
                                        </QChip>
                                    </section>
                                </section>

                                <!-- BUDGET -->
                                <section class="recap-section">
                                    <div class="recap-section-title">
                                        <h4 class="title-3">{{ t('project.budget') }}</h4>
                                        <QBtn
                                            :label="t('modify')"
                                            icon="bi-pencil"
                                            @click="() => step = 3"
                                        />
                                    </div>

                                    <section class="flex-section">
                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.re-edition') }}</p>
                                            <p>
                                                {{
                                                    projectStore.projectCommissionDates.find(obj => obj.isFirstEdition === false) ? t('yes') : t('no')
                                                }}
                                            </p>
                                        </div>

                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.target-audience') }}</p>
                                            <p>{{ projectBudget.targetAudience }}</p>
                                        </div>

                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.target-students-amount') }}</p>
                                            <p>{{ projectBudget.amountStudentsAudience }}</p>
                                        </div>

                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.target-all-amount') }}</p>
                                            <p>{{ projectBudget.amountAllAudience }}</p>
                                        </div>

                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.ticket-price') }}</p>
                                            <p>{{ projectBudget.ticketPrice + CURRENCY }}</p>
                                        </div>

                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.individual-cost') }}</p>
                                            <p>{{ projectBudget.individualCost + CURRENCY }}</p>
                                        </div>

                                        <div
                                            v-for="(commissionDate, index) in projectStore.projectCommissionDates"
                                            :key="index"
                                            class="display-row"
                                        >
                                            <p class="row-title">
                                                {{
                                                    `${t('project.amount-asked')}
                                                        (${commissions.find(obj => obj.id === commissionDates.find(obj => obj.commission === commissionDate.commissionDate)?.commission)?.acronym})`
                                                }}
                                            </p>
                                            <p>{{ commissionDate.amountAsked + CURRENCY }}</p>
                                        </div>

                                        <section
                                            v-if="projectStore.projectCommissionDates.find(obj => obj.isFirstEdition === false)"
                                            class="flex-section"
                                        >
                                            <h5 class="title-4">{{ t('project.previous-edition') }}</h5>

                                            <div
                                                v-for="(commissionDate, index) in projectStore.projectCommissionDates"
                                                :key="index"
                                                class="display-row"
                                            >
                                                <p class="row-title">
                                                    {{
                                                        `${t('project.previous-asked')}
                                                        (${commissions.find(obj => obj.id === commissionDates.find(obj => obj.commission === commissionDate.commissionDate)?.commission)?.acronym})`
                                                    }}
                                                </p>
                                                <p>{{ commissionDate.amountAskedPreviousEdition + CURRENCY }}</p>
                                            </div>

                                            <div
                                                v-for="(commissionDate, index) in projectStore.projectCommissionDates"
                                                :key="index"
                                                class="display-row"
                                            >
                                                <p class="row-title">
                                                    {{
                                                        `${t('project.previous-earned')}
                                                        (${commissions.find(obj => obj.id === commissionDates.find(obj => obj.commission === commissionDate.commissionDate)?.commission)?.acronym})`
                                                    }}
                                                </p>
                                                <p>{{ commissionDate.amountEarnedPreviousEdition + CURRENCY }}</p>
                                            </div>

                                            <div class="display-row">
                                                <p class="row-title">{{ t('project.budget-previous-edition') }}</p>
                                                <p>{{ projectBudget.budgetPreviousEdition + CURRENCY }}</p>
                                            </div>
                                        </section>
                                    </section>
                                </section>

                                <!-- GOALS -->
                                <section class="recap-section">
                                    <div class="recap-section-title">
                                        <h4 class="title-3">{{ t('project.goals') }}</h4>
                                        <QBtn
                                            :label="t('modify')"
                                            icon="bi-pencil"
                                            @click="() => step = 4"
                                        />
                                    </div>

                                    <section class="flex-section">
                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.goals-title') }}</p>
                                            <p>{{ projectGoals.goals }}</p>
                                        </div>

                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.summary') }}</p>
                                            <p>{{ projectGoals.summary }}</p>
                                        </div>

                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.planned-activities') }}</p>
                                            <p>{{ projectGoals.plannedActivities }}</p>
                                        </div>

                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.prevention-safety') }}</p>
                                            <p>{{ projectGoals.preventionSafety }}</p>
                                        </div>

                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.marketing-campaign') }}</p>
                                            <p>{{ projectGoals.marketingCampaign }}</p>
                                        </div>
                                    </section>
                                </section>

                                <!-- DOCUMENTS -->
                                <section class="recap-section">
                                    <div class="recap-section-title">
                                        <h4 class="title-3">{{ t('project.documents') }}</h4>
                                        <QBtn
                                            :label="t('modify')"
                                            icon="bi-pencil"
                                            @click="() => step = 5"
                                        />
                                    </div>

                                    <div class="info-panel info-panel-warning">
                                        <i
                                            class="bi bi-exclamation-lg"
                                            aria-hidden="true"
                                        ></i>
                                        <p>{{ t('project.document.verify') }}</p>
                                    </div>

                                    <section class="flex-section">
                                        <div
                                            class="display-row"
                                            v-for="(document, index) in processDocuments"
                                            :key="index"
                                        >
                                            <p class="row-title">{{ document.description }}</p>
                                            <p class="paragraph">
                                                <ul role="list">
                                                    <li
                                                        v-for="uploadedDocument in documentUploads.filter(obj => obj.document === document.document)"
                                                        :key="uploadedDocument.id"
                                                        @click="onGetFile(uploadedDocument.pathFile, uploadedDocument.name)"
                                                    >
                                                        {{ uploadedDocument.name }}
                                                    </li>
                                                </ul>
                                            </p>
                                        </div>
                                    </section>
                                </section>
                            </section>


                            <section class="form-page-navigation">
                                <QBtn
                                    :label="t('back')"
                                    icon="bi-chevron-left"
                                    @click="step = 5"
                                />
                                <QBtn
                                    :label="t('project.validate')"
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

<style lang="scss">
@import '@/assets/styles/forms.scss';
</style>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';

.project-re-edition {
    margin-top: 1rem;
}

.previous-budget, .asked-budget, .previous-budget-section, .asked-budget-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.q-checkbox {
    margin: 0 0 1rem 0;
}

section > .q-separator {
    margin: 0 0 2rem 0;
}

.q-separator {
    margin: 1rem 0 2rem 0;
}

h3 {
    margin-bottom: 1rem;
}

.flex-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

h5 {
    margin: 1.5rem 0 0.5rem 0;
}

.recap-section {
    margin-bottom: 2rem;
}

.recap-section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h4 {
        margin: 2rem 0 1rem 0;
    }
}

.flex-section .document-input {
    margin-bottom: 0;
}
</style>
