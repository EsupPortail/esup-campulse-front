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
    initProjectCommissionDates
}
    = useSubmitProject()
const {fromDateIsAnterior} = useUtility()
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

watch(() => step.value === 2, async () => {
    await onGetCommissionDates()
})
watch(() => step.value === 3, async () => {
    await onGetProjectBudget()
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
            initProjectCommissionDates()
        } catch {
            notify({
                type: 'negative',
                message: t('notifications.negative.loading-error')
            })
        }
    }
    initProjectBudget()
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
</script>

<template>
    <section class="dashboard-section">
        <div class="form-title">
            <h2>
                <i
                    aria-hidden="true"
                    class="bi bi-pencil-square"
                ></i>
                {{ t('project.submit') }}
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
                            <h3 class="title-3">{{ t('project.general-infos') }}</h3>

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
                        icon="mdi-star-check-outline"
                    >
                        <QForm
                            @submit.prevent="onSubmitCommissionDates"
                        >
                            <h3 class="title-3">{{ t('project.commission-choice') }}</h3>

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
                            <h3 class="title-3">{{ t('project.budget') }}</h3>

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
                        <QForm>
                            <h3 class="title-3">{{ t('project.goals-title') }}</h3>

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
                </QStepper>
            </div>
        </div>
    </section>
</template>

<style lang="sass">
@import '@/assets/styles/forms.scss'
</style>

<style lang="sass" scoped>
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
</style>