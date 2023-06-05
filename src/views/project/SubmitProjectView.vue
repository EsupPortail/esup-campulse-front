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
import useUsers from '@/composables/useUsers'
import FormProjectRecap from '@/components/form/FormProjectRecap.vue'

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
    getDocuments,
    initProcessProjectDocuments,
    processDocuments,
    uploadDocuments,
    initDocumentUploads,
    documentUploads,
    deleteDocumentUpload,
    getFile
} = useProjectDocuments()
const {initInfosToPatch, updateUserInfos, infosToPatch} = useUsers()
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
    // If the applicant is an association and the person trying to submit project is not a member of the association,
    // redirect to 404
    if (applicant.value === 'association') {
        const association = userStore.user?.associations.find(obj => obj.id === parseInt(route.params.associationId as string))
        if (association) {
            associationName.value = association.name
            associationId.value = association.id
            initIsSite()
        } else await router.push({name: '404'})
    }

    initSelfBearer()

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
const associationId = ref<number>()

const newProject = ref<boolean>(true)

const projectReEdition = ref<boolean>(false)
watch(() => projectStore.projectCommissionDates.length, () => {
    if (projectStore.projectCommissionDates.find(obj => obj.isFirstEdition === false)) projectReEdition.value = true
})

const isSite = ref<boolean>(false)

const selfBearer = ref<'yes' | 'no'>('yes')

const initSelfBearer = () => {
    if (!newProject.value && projectBasicInfos.value.otherFirstName) {
        selfBearer.value = 'no'
    }
}

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
    datesAreLegal.value = fromDateIsAnterior(projectBasicInfos.value.plannedStartDate, projectBasicInfos.value.plannedEndDate)
})
watch(() => projectBasicInfos.value.plannedEndDate, () => {
    datesAreLegal.value = fromDateIsAnterior(projectBasicInfos.value.plannedStartDate, projectBasicInfos.value.plannedEndDate)
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
            await projectStore.getProjectDetail(parseInt(route.params.projectId as string))
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
        const file = await getFile(uploadedDocument.pathFile as string)
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(file)
        link.download = uploadedDocument.name as string
        document.body.appendChild(link)
        link.click()
        link.remove()
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
    if (!projectCommissionDatesModel.value.length) {
        try {
            await getCommissions()
            await getCommissionDates(true, undefined, undefined)
            initCommissionDatesLabels(isSite.value)
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
        await getCommissionDates(true, undefined, undefined)
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
            if (selfBearer.value === 'yes' && projectBasicInfos.value.otherFirstName) {
                projectBasicInfos.value.otherFirstName = ''
                projectBasicInfos.value.otherLastName = ''
                projectBasicInfos.value.otherEmail = ''
            }
            await patchProjectBasicInfos()
        }
        // For individual project bearer
        initInfosToPatch(userStore.user)
        if (Object.entries(infosToPatch).length) {
            await updateUserInfos(userStore.user, false)
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
            await uploadDocuments(parseInt(route.params.associationId as string))
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
                                stack-label
                                use-chips
                            />
                            <fieldset v-if="applicant === 'association'">
                                <legend class="title-3">{{ t('project.bearer-identity') }}</legend>
                                <p class="paragraph">{{ t('project.i-am-bearer') }} <strong>{{ associationName }}</strong> :</p>
                                <div class="q-gutter-sm radio-btn">
                                    <QRadio
                                        v-model="selfBearer"
                                        val="yes"
                                        :label="t('yes')"
                                    />
                                    <QRadio
                                        v-model="selfBearer"
                                        val="no"
                                        :label="t('no')"
                                    />
                                </div>
                                <fieldset v-if="selfBearer === 'no'">
                                    <legend class="self-bearer">Saisir les informations de la personne référente à contacter :</legend>
                                    <QInput
                                        v-model="projectBasicInfos.otherFirstName"
                                        :label="t('project.other-first-name') + ' *'"
                                        clearable
                                        filled
                                        lazy-rules
                                        aria-required="true"
                                        :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                    />
                                    <QInput
                                        v-model="projectBasicInfos.otherLastName"
                                        :label="t('project.other-last-name') + ' *'"
                                        clearable
                                        filled
                                        lazy-rules
                                        aria-required="true"
                                        :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                    />
                                    <QInput
                                        v-model="projectBasicInfos.otherEmail"
                                        :label="t('project.other-email') + ' *'"
                                        :rules="[(val, rules) => rules.email(val) || t('forms.required-email')]"
                                        class="no-rules"
                                        clearable
                                        filled
                                        lazy-rules
                                        aria-required="true"
                                    />
                                </fieldset>
                            </fieldset>
                            <fieldset v-else>
                                <div class="info-panel info-panel-warning">
                                    <i
                                        class="bi bi-info"
                                        aria-hidden="true"
                                    ></i>
                                    <p>{{ t('address.verify')}}</p>
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

                            <section class="btn-group">
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
                                            :label="commissions.find(obj => obj.id === commissionDates
                                                .find(obj => obj.id === commissionDate.commissionDate)?.commission)?.acronym + ' *'"
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
                                            v-for="(commissionDate, index) in projectCommissionDates"
                                            :key="index"
                                            v-model="commissionDate.amountEarnedPreviousEdition"
                                            :label="commissions.find(obj => obj.id === commissionDates
                                                .find(obj => obj.id === commissionDate.commissionDate)?.commission)?.acronym + ' *'"
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

                                <QSeparator/>
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
                                reactive-rules
                                min="0"
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

                            <QSeparator/>

                            <section class="asked-budget">
                                <fieldset class="asked-budget-fieldset">
                                    <legend class="title-5">{{ t('project.amounts-asked') }} :</legend>
                                    <section class="asked-budget-section">
                                        <QInput
                                            v-for="(commissionDate, index) in projectCommissionDates"
                                            :key="index"
                                            v-model="commissionDate.amountAsked"
                                            :label="commissions.find(obj => obj.id === commissionDates
                                                .find(obj => obj.id === commissionDate.commissionDate)?.commission)?.acronym + ' *'"
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
                                                        <i class="bi bi-x-lg"></i>
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
                        :done="done6"
                        :name="6"
                        :title="t('recap')"
                        icon="mdi-check"
                    >
                        <FormProjectRecap
                            @submit-project="onSubmitProject"
                            @change-step="newStep => step = newStep"
                            @get-file="uploadDocument => onGetFile(uploadDocument)"
                            view="submitProject"
                        />
                    </QStep>
                </QStepper>
            </div>
        </div>
    </section>
</template>

<style lang="scss">
@import '@/assets/styles/forms.scss';
</style>

<style lang="sass" scoped>
@import '@/assets/_variables.scss'

.q-input, .q-select
  padding: 1rem

.display-row
    width: 100%
    margin: 0 1rem

legend, p, h3
    padding: 0 1rem

legend
    margin-top: 1.5rem

.radio-btn
    padding-left: 0.5rem

.paragraph
    margin-bottom: 0.5rem

.self-bearer
    font-size: 1rem
</style>


