<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import useSubmitProject from '@/composables/useSubmitProject'
import useUtility from '@/composables/useUtility'
import {useProjectStore} from '@/stores/useProjectStore'
import {useQuasar} from 'quasar'
import {useRoute} from 'vue-router'
import {useUserStore} from '@/stores/useUserStore'
import useCommissions from '@/composables/useCommissions'
import useProjectDocuments from '@/composables/useProjectDocuments'

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
    initProjectGoals
}
    = useSubmitProject()
const {
    getDocumentTypes,
    initProcessProjectDocuments,
    processProjectDocuments,
    postProjectDocuments
} = useProjectDocuments()
const {fromDateIsAnterior, CURRENCY} = useUtility()
const {
    getCommissions,
    commissions,
    getCommissionDates,
    commissionDatesLabels,
    commissionDates
} = useCommissions()
const {loading, notify} = useQuasar()
const projectStore = useProjectStore()
const userStore = useUserStore()
const route = useRoute()

onMounted(async () => {
    loading.show
    initApplicant()
    if (route.params.projectId) newProject.value = false
    await onGetProjectDetail()
    if (applicant.value === 'association') {
        associationName.value = userStore.user?.associations.find(obj => obj.id === parseInt(route.params.associationId as string))?.name
    }
    await onGetProjectCategories()
    loading.hide
})

const step = ref(1)
const done1 = ref(false)
const done2 = ref(false)
const done3 = ref(false)
const done4 = ref(false)
const done5 = ref(false)
const done6 = ref(false)

watch(() => step.value === 2, async () => {
    await onGetCommissionDates()
})
watch(() => step.value === 3, async () => {
    await onGetProjectBudget()
})
watch(() => step.value === 4, async () => {
    await onGetProjectGoals()
})
watch(() => step.value === 5, async () => {
    await onGetProjectDocuments()
})

// REFS
const applicant = ref<'association' | 'user' | undefined>()

const associationName = ref<string | undefined>('')

const newProject = ref<boolean>(true)

const projectReEdition = ref<boolean>(false)

// INIT APPLICANT STATUS BASED ON ROUTER
const initApplicant = () => {
    if (route.name === 'SubmitProjectAssociation') {
        projectBasicInfos.value.association = parseInt(route.params.associationId as string)
        applicant.value = 'association'
    } else {
        projectBasicInfos.value.user = userStore.user?.id as number
        applicant.value = 'user'
    }
}
watch(() => userStore.user, initApplicant)

// CHECKING IF PROJECT BASIC INFOS DATES ARE LEGAL
const datesAreLegal = ref<boolean>(false)
watch(() => projectBasicInfos.value.plannedStartDate, () => {
    datesAreLegal.value = fromDateIsAnterior(projectBasicInfos.value.plannedStartDate, projectBasicInfos.value.plannedEndDate)
})
watch(() => projectBasicInfos.value.plannedEndDate, () => {
    datesAreLegal.value = fromDateIsAnterior(projectBasicInfos.value.plannedStartDate, projectBasicInfos.value.plannedEndDate)
})

// GET DATA FOR STEP 1
async function onGetProjectDetail() {
    try {
        if (!newProject.value) {
            await projectStore.getProjectDetail(parseInt(route.params.projectId as string))
            initProjectBasicInfos()
        }
    } catch {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

async function onGetProjectCategories() {
    try {
        await projectStore.getProjectCategoryNames()
        if (!newProject.value) {
            await projectStore.getProjectCategories()
            initProjectCategories()
        }
    } catch {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

// GET DATA FOR STEP 2
async function onGetCommissionDates() {
    if (!projectCommissionDatesModel.value.length) {
        try {
            await getCommissions()
            await getCommissionDates()
            if (!newProject.value) {
                await projectStore.getProjectCommissionDates()
                initProjectCommissionDatesModel()
            }
        } catch {
            notify({
                type: 'negative',
                message: t('notifications.negative.loading-error')
            })
        }
    }
}

// GET DATA FOR STEP 3
async function onGetProjectBudget() {
    if (!projectCommissionDatesModel.value.length) {
        try {
            await getCommissions()
            await getCommissionDates()
            await projectStore.getProjectCommissionDates()
        } catch {
            notify({
                type: 'negative',
                message: t('notifications.negative.loading-error')
            })
        }
    }
    initProjectCommissionDates()
    initProjectBudget()
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
    } catch {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

// SUBMIT STEP 1
async function onSubmitBasicInfos() {
    try {
        if (newProject.value) {
            await postNewProject()
        } else {
            await patchProjectBasicInfos()
        }
        if (projectStore.project) {
            await updateProjectCategories()
            done1.value = true
            step.value = 2
        }
    } catch {
        notify({
            type: 'negative',
            message: t('notifications.negative.project-creation-error')
        })
    }
}

// SUBMIT STEP 2
async function onSubmitCommissionDates() {
    if (projectStore.project) {
        try {
            await updateProjectCommissionDates()
            done2.value = true
            step.value = 3
        } catch {
            notify({
                type: 'negative',
                message: t('notifications.negative.commission-dates-error')
            })
        }
    }
}

// SUBMIT STEP 3
async function onSubmitBudget() {
    if (projectStore.project) {
        try {
            await patchProjectBudget()
            await patchProjectCommissionDates(!projectReEdition.value)
            done3.value = true
            step.value = 4

        } catch {
            notify({
                type: 'negative',
                message: t('notifications.negative.commission-dates-error')
            })
        }
    }
}

// SUBMIT STEP 4
async function onSubmitGoals() {
    if (projectStore.project) {
        try {
            await patchProjectGoals()
            done4.value = true
            step.value = 5

        } catch {
            notify({
                type: 'negative',
                message: t('notifications.negative.commission-dates-error')
            })
        }
    }
}

// SUBMIT STEP 5
async function onSubmitDocuments() {
    if (projectStore.project) {
        try {
            loading.show
            await postProjectDocuments(parseInt(route.params.associationId as string))
            loading.hide
            done5.value = true
            step.value = 6
        } catch {
            notify({
                type: 'negative',
                message: t('notifications.negative.commission-dates-error')
            })
        }
    }
}

// SUBMIT STEP 6
async function onSubmitProject() {
    if (projectStore.project) {
        try {
            //
            done6.value = true
        } catch {
            notify({
                type: 'negative',
                message: t('notifications.negative.commission-dates-error')
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
                        {{
                            `${t('project.info-panel-status')}
                            ${(applicant === 'association' ? t('project.info-panel-status-association') + ' ' + associationName : t('project.info-panel-status-individual'))}.`
                        }}
                    </p>
                    <p>
                        Avant de débuter la procédure, assurez-vous de disposer des documents suivants numérisés :
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
                        :done="done1"
                        :name="1"
                        :title="t('project.general-infos')"
                        icon="mdi-card-text-outline"
                    >
                        <QForm
                            @submit.prevent="onSubmitBasicInfos"
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
                            @submit.prevent="onSubmitCommissionDates"
                        >
                            <h3 class="title-2">{{ t('project.commission-choice') }}</h3>

                            <div class="info-panel">
                                <i
                                    aria-hidden="true"
                                    class="bi bi-exclamation-lg"
                                ></i>
                                <p>
                                    Attention, vous ne pouvez choisir qu'une seule date par commission.
                                </p>
                            </div>

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
                                    @click="step = 1"
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
                            @submit.prevent="onSubmitBudget"
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
                                            :label="commissions.find(obj => obj.id === commissionDates.find(obj => obj.id === commissionDate.commissionDate)?.commission)?.acronym"
                                            filled
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
                                            :label="commissions.find(obj => obj.id === commissionDates.find(obj => obj.id === commissionDate.commissionDate)?.commission)?.acronym"
                                            filled
                                            type="number"
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
                                v-model="projectBudget.typeTargetAudience"
                                :label="t('project.target-audience-type') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                aria-required="true"
                                filled
                                lazy-rules
                                type="textarea"
                            />

                            <QInput
                                v-model="projectBudget.amountTargetAudience"
                                :label="t('project.target-audience-amount') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                aria-required="true"
                                filled
                                lazy-rules
                                type="number"
                            />

                            <QInput
                                v-model="projectBudget.amountStudentsTargetAudience"
                                :label="t('project.target-audience-amount-students') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                aria-required="true"
                                filled
                                lazy-rules
                                type="number"
                            />

                            <QInput
                                v-model="projectBudget.ticketPrice"
                                :label="t('project.ticket-price') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                aria-required="true"
                                filled
                                lazy-rules
                                type="number"
                            />

                            <QInput
                                v-model="projectBudget.individualCost"
                                :label="t('project.individual-cost') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                aria-required="true"
                                filled
                                lazy-rules
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
                                            :label="commissions.find(obj => obj.id === commissionDates.find(obj => obj.id === commissionDate.commissionDate)?.commission)?.acronym"
                                            filled
                                            type="number"
                                        />
                                    </section>
                                </fieldset>
                            </section>

                            <section class="form-page-navigation">
                                <QBtn
                                    :label="t('back')"
                                    icon="bi-chevron-left"
                                    @click="step = 2"
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
                            @submit.prevent="onSubmitGoals"
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
                                    @click="step = 3"
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
                            @submit.prevent="onSubmitDocuments"
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
                                <QFile
                                    v-for="(projectDocument, index) in processProjectDocuments"
                                    :key="index"
                                    v-model="projectDocument.pathFile"
                                    :accept="projectDocument.mimeTypes.join(', ')"
                                    :aria-required="projectDocument.isRequiredInProcess"
                                    :hint="t('project.document-hint') + (projectDocument.isMultiple ? (' ' + t('project.document-hint-multiple')) : '')"
                                    :label="projectDocument.label + (projectDocument.isRequiredInProcess ? ' *' : '')"
                                    :max-files="projectDocument.isMultiple ? 10 : 1"
                                    :multiple="projectDocument.isMultiple"
                                    :rules="projectDocument.isRequiredInProcess ? [val => val || t('forms.select-document')] : []"
                                    append
                                    clearable
                                    counter
                                    filled
                                    lazy-rules
                                    use-chips
                                >
                                    <template v-slot:prepend>
                                        <QIcon name="mdi-paperclip"/>
                                    </template>
                                </QFile>
                            </section>

                            <section class="form-page-navigation">
                                <QBtn
                                    :label="t('back')"
                                    icon="bi-chevron-left"
                                    @click="step = 3"
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
                                                commissionDatesLabels.find(obj => obj.value === commissionDate.commissionDate).label
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
                                            <p class="row-title">{{ t('project.target-audience-type') }}</p>
                                            <p>{{ projectBudget.typeTargetAudience }}</p>
                                        </div>

                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.target-audience-amount') }}</p>
                                            <p>{{ projectBudget.amountTargetAudience }}</p>
                                        </div>

                                        <div class="display-row">
                                            <p class="row-title">{{ t('project.target-audience-amount-students') }}</p>
                                            <p>{{ projectBudget.amountStudentsTargetAudience }}</p>
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

                                    <div class="document-input-group">
                                        <div class="document-input variant-space-1">
                                            <div class="document-input-header">
                                                <h4>
                                                    PV de la dernière AGO
                                                </h4>
                                                <p>
                                                    <button>
                                                        <i class="bi bi-info-circle"></i>
                                                    </button>
                                                </p>
                                                <button>
                                                    <i class="bi bi-plus"></i>
                                                </button>
                                            </div>
                                            <div class="document-input-list">
                                                <div class="document-item">
                                                    <p>
                                                        <i
                                                            aria-hidden="true"
                                                            class="bi bi-file-earmark"
                                                        ></i>
                                                        <a
                                                            href="/"
                                                            target="_blank"
                                                        >
                                                            cert_scol_membre1.pdf
                                                            <i
                                                                aria-hidden="true"
                                                                class="bi bi-eye"
                                                            ></i>
                                                        </a>
                                                    </p>
                                                    <button>
                                                        <i class="bi bi-x-lg"></i>
                                                    </button>
                                                </div>
                                                <div class="document-item">
                                                    <p>
                                                        <i
                                                            aria-hidden="true"
                                                            class="bi bi-file-earmark"
                                                        ></i>
                                                        <a
                                                            href="/"
                                                            target="_blank"
                                                        >
                                                            cert_scol_membre2.pdf
                                                            <i
                                                                aria-hidden="true"
                                                                class="bi bi-eye"
                                                            ></i>
                                                        </a>
                                                    </p>
                                                    <button>
                                                        <i class="bi bi-x-lg"></i>
                                                    </button>
                                                </div>
                                                <div class="document-item">
                                                    <p>
                                                        <i
                                                            aria-hidden="true"
                                                            class="bi bi-file-earmark"
                                                        ></i>
                                                        <a
                                                            href="/"
                                                            target="_blank"
                                                        >
                                                            cert_scol_membre3.pdf
                                                            <i
                                                                aria-hidden="true"
                                                                class="bi bi-eye"
                                                            ></i>
                                                        </a>
                                                    </p>
                                                    <button disabled>
                                                        <i class="bi bi-x-lg"></i>
                                                    </button>
                                                </div>
                                            </div>

                                            <div class="document-input">
                                                <div class="document-input-header">
                                                    <h4>
                                                        Certificat de scolarité des membres élus (1 document par membre)
                                                    </h4>
                                                    <p>
                                                        <button>
                                                            <i class="bi bi-info-circle"></i>
                                                        </button>
                                                    </p>
                                                    <button>
                                                        <i class="bi bi-plus"></i>
                                                    </button>
                                                </div>
                                                <!-- <div class="document-input-list"></div> -->
                                            </div>

                                            <div class="document-input">
                                                <div class="document-input-header">
                                                    <h4>
                                                        Certificat envoyé par le tribunal judiciaire
                                                    </h4>
                                                    <!-- <p>
                                                        <button>
                                                            <i class="bi bi-info-circle"></i>
                                                        </button>
                                                    </p> -->
                                                    <button disabled>
                                                        <i class="bi bi-plus"></i>
                                                    </button>
                                                </div>
                                                <!-- <div class="document-input-list"></div> -->
                                            </div>
                                        </div>
                                    </div>
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

<style lang="sass">
@import '@/assets/styles/forms.scss'
</style>

<style lang="sass" scoped>
@import '@/assets/_variables.scss'

.project-re-edition
    margin-top: 1rem

.previous-budget, .asked-budget, .previous-budget-section, .asked-budget-section
    display: flex
    flex-direction: column
    gap: 1rem

.q-checkbox
    margin: 0 0 1rem 0

section > .q-separator
    margin: 0 0 2rem 0

.q-separator
    margin: 1rem 0 2rem 0

h3
    margin-bottom: 1rem

.flex-section
    display: flex
    flex-direction: column
    gap: 1.5rem

h5
    margin: 1.5rem 0 0.5rem 0

.recap-section-title
    display: flex
    align-items: center
    justify-content: space-between

    h4
        margin: 2rem 0 1rem 0
</style>