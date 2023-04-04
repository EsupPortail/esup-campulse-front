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
    projectBudget,
    postNewProject
}
    = useSubmitProject()
const {fromDateIsAnterior} = useUtility()
const {getCommissions, commissions} = useCommissions()
const {loading, notify} = useQuasar()
const projectStore = useProjectStore()
const userStore = useUserStore()
const route = useRoute()

onMounted(async () => {
    loading.show
    initApplicant()
    await onGetProjectCategories()
    await onGetCommissions()
    loading.hide
})

const step = ref(1)
const done1 = ref(false)
const done2 = ref(false)
const done3 = ref(false)

const applicant = ref<'association' | 'user' | undefined>()

const projectReEdition = ref<boolean>(false)

const datesAreLegal = ref<boolean>(false)
watch(() => projectBasicInfos.value.plannedStartDate, () => {
    datesAreLegal.value = fromDateIsAnterior(projectBasicInfos.value.plannedStartDate, projectBasicInfos.value.plannedEndDate)
})
watch(() => projectBasicInfos.value.plannedEndDate, () => {
    datesAreLegal.value = fromDateIsAnterior(projectBasicInfos.value.plannedStartDate, projectBasicInfos.value.plannedEndDate)
})

const initApplicant = () => {
    if (route.name === 'SubmitProjectAssociation') {
        projectBasicInfos.value.association = parseInt(route.params.id as string)
        applicant.value = 'association'
    } else {
        projectBasicInfos.value.user = userStore.user?.id as number
        applicant.value = 'user'
    }
}
watch(() => userStore.user, initApplicant)

async function onGetProjectCategories() {
    try {
        await projectStore.getProjectCategories()
    } catch {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

async function onGetCommissions() {
    try {
        await getCommissions()
    } catch {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

async function onSubmitBasicInfos() {
    try {
        await postNewProject()
        done2.value = true
        step.value = 3
    } catch {
        notify({
            type: 'negative',
            message: t('notifications.negative.project-creation-error')
        })
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
                <div class="q-pa-md">
                    <QStepper
                        ref="stepper"
                        v-model="step"
                        animated
                        header-nav
                    >
                        <QStep
                            :done="done1"
                            :name="1"
                            :title="t('project.before-start')"
                            icon="mdi-information-outline"
                        >
                            <h3 class="title-3">{{ t('project.before-start') }}</h3>

                            <p>
                                Vous êtes sur le point de commencer une demande de subventionnement en tant que
                                représentant ou représentante de l'association X.
                            </p>
                            <p>
                                Avant de débuter la procédure, assurez-vous de disposer des documents suivants
                                numérisés :
                            </p>
                            <ul>
                                <li>...</li>
                            </ul>

                            <section class="form-page-navigation">
                                <QBtn
                                    :label="t('continue')"
                                    icon-right="bi-check2"
                                    @click="() => { done1 = true; step = 2 }"
                                />
                            </section>
                        </QStep>

                        <QStep
                            :done="done2"
                            :name="2"
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
                                    v-model="projectBasicInfos.categories"
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

                        <QStep
                            :done="done3"
                            :name="3"
                            :title="t('project.budget')"
                            icon="mdi-hand-coin-outline"
                        >
                            <QForm>
                                <div class="title-help-section">
                                    <h3 class="title-3">{{ t('project.budget') }}</h3>
                                    <QIcon
                                        name="mdi-information-outline"
                                    >
                                        <QTooltip>
                                            {{ t('project.budget-form-help') }}
                                        </QTooltip>
                                    </QIcon>
                                </div>
                                <QCheckbox
                                    v-model="projectReEdition"
                                    :label="t('project.re-edition')"
                                />

                                <section
                                    v-if="projectReEdition"
                                    class="project-re-edition"
                                >
                                    <h4 class="title-4">{{ t('project.previous-edition') }}</h4>

                                    <fieldset class="previous-budget">
                                        <legend class="title-5">{{ t('project.previous-demands') }} :</legend>
                                        <section class="previous-budget-section">
                                            <div
                                                v-for="commission in commissions"
                                                :key="commission.id"
                                            >
                                                <QInput
                                                    v-if="applicant === 'association'"
                                                    v-model="projectBudget.amountsPreviousEdition"
                                                    :label="t('project.commission-amount-earned') + ' ' + commission.acronym"
                                                    filled
                                                    type="number"
                                                />
                                            </div>
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
                    </QStepper>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="sass">
@import '@/assets/styles/forms.scss'
</style>

<style lang="sass" scoped>
h3
    padding: 1.5rem 0 1rem 0

.project-re-edition
    margin-top: 1rem

.previous-budget-section
    display: flex
    flex-direction: column
    gap: 1rem

.title-help-section
    display: flex
    align-items: center
    gap: 0.5rem
</style>