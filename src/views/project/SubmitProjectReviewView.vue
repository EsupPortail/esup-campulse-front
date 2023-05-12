<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import axios from 'axios'
import useProjectDocuments from '@/composables/useProjectDocuments'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import {onMounted, ref, watch} from 'vue'
import type {ProjectReview, ProjectReviewAssociation} from '#/project'
//import useSubmitProject from '@/composables/useSubmitProject'
import useCommissions from '@/composables/useCommissions'
import {useUserStore} from '@/stores/useUserStore'
import {useProjectStore} from '@/stores/useProjectStore'
import {useRoute} from 'vue-router'
import useUtility from '@/composables/useUtility'
import {useAssociationStore} from '@/stores/useAssociationStore'
import useSubmitProject from '@/composables/useSubmitProject'
import useAssociation from '@/composables/useAssociation'

const {t} = useI18n()
const {catchHTTPError} = useErrors()
const {loading, notify} = useQuasar()
const userStore = useUserStore()
const projectStore = useProjectStore()
const associationStore = useAssociationStore()
const route = useRoute()
const {CURRENCY, formatDate, fromDateIsAnterior, phoneRegex} = useUtility()
const {
    getDocuments,
    initProcessProjectDocuments,
    processDocuments
} = useProjectDocuments()
const {patchProjectReview} = useSubmitProject()
const {
    getCommissions,
    getCommissionDates,
    initCommissionDatesLabels,
    commissionDatesLabels
} = useCommissions()

onMounted(async () => {
    loading.show()
    await onGetDocumentTypes()
    await onGetProjectReview()
    await onGetCommissionDates()
    await onGetAssociationDetails()
    loading.hide()
})

const step = ref(1)
const done1 = ref(false)
//const done2 = ref(false)
//const done3 = ref(false)
//const done4 = ref(false)
//const done5 = ref(false)
//const done6 = ref(false)

const projectReview = ref<ProjectReview>(
    {
        id: null,
        name: '',
        otherFirstName: '',
        otherLastName: '',
        otherEmail: '',
        otherPhone: '',
        user: null,
        association: null,
        outcome: '',
        income: '',
        realStartDate: '',
        realEndDate: '',
        realLocation: '',
        organizerName: '',
        organizerPhone: '',
        organizerEmail: '',
        review: '',
        impactStudents: '',
        description: '',
        difficulties: '',
        improvements: ''
    }
)

const association = ref<ProjectReviewAssociation>(
    {
        address: '',
        phone: '',
        email: '',
        presidentNames: '',
        presidentPhone: '',
        presidentEmail: ''
    }
)

const initProjectReviewValues = () => {
    loading.show()
    if (projectStore.projectReview && projectStore.project) {
        projectReview.value.id = projectStore.projectReview.id
        projectReview.value.name = projectStore.projectReview.name
        projectReview.value.outcome = projectStore.projectReview.outcome ?
            projectStore.projectReview.outcome.toString() : '0'
        projectReview.value.income = projectStore.projectReview.income ?
            projectStore.projectReview.income.toString() : '0'
        projectReview.value.association = projectStore.projectReview.association
        projectReview.value.user= projectStore.projectReview.user
        projectReview.value.realStartDate = formatDate(projectStore.projectReview.realStartDate ??
            projectStore.project.plannedStartDate) as string
        projectReview.value.realEndDate = formatDate(projectStore.projectReview.realEndDate ??
            projectStore.project.plannedEndDate) as string
        projectReview.value.realLocation = projectStore.projectReview.realLocation ?? projectStore.project.plannedLocation
        projectReview.value.otherFirstName = projectStore.projectReview.otherFirstName ?? projectStore.project.otherFirstName
        projectReview.value.otherLastName = projectStore.projectReview.otherLastName ?? projectStore.project.otherLastName
        projectReview.value.otherEmail = projectStore.projectReview.otherEmail ?? projectStore.project.otherEmail
        projectReview.value.otherPhone = projectStore.projectReview.otherPhone ?? projectStore.project.otherPhone
    }
    loading.hide()
}
watch(() => projectStore.projectReview, initProjectReviewValues)

const initAssociationValues = () => {
    loading.show()
    if (associationStore.association) {
        association.value.address = associationStore.association.address as string
        association.value.phone = associationStore.association.phone as string
        association.value.email = associationStore.association.email as string
        association.value.presidentNames = associationStore.association.presidentNames as string
        association.value.presidentPhone = associationStore.association.presidentPhone as string
    }
    loading.hide()
}
watch(() => associationStore.association, initAssociationValues)

const isSite = () => {
    let isSite = false
    if (userStore.user?.associations.find(obj => obj.id === projectReview.value.association)?.isSite) isSite = true
    return isSite
}

const applicant = () => {
    if (projectReview.value.user) return `${userStore.user?.firstName} ${userStore.user?.lastName}`
    else return userStore.user?.associations.find(obj => obj.id === projectReview.value.association)?.name
}

const datesAreLegal = ref<boolean>(false)
const checkIfDatesAreLegal = () => {
    datesAreLegal.value = fromDateIsAnterior(projectReview.value.realStartDate, projectReview.value.realEndDate)
}

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
async function onSubmitProjectReviewInfos(nextStep: number, association: ProjectReviewAssociation | undefined) {
    try {
        await patchProjectReview(projectReview.value, association)
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
                        :done="done1"
                        :name="1"
                        :title="t('project.general-infos')"
                        icon="mdi-card-text-outline"
                    >
                        <QForm
                            @submit.prevent="onSubmitProjectReviewInfos(2, association)"
                        >
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

                            <QSeparator/>

                            <fieldset>
                                <legend class="title-3">{{ t('project.general-infos') }}</legend>
                                <div class="display-row">
                                    <p class="row-title">{{ t('project.name') }}</p>
                                    <p>{{ projectReview.name }}</p>
                                </div>
                                <QInput
                                    v-model="projectReview.realStartDate"
                                    :label="t('project.planned-start-date') + ' *'"
                                    :rules="[
                                        val => val && val.length > 0 || t('forms.fill-field'),
                                        val => val && datesAreLegal || t('forms.legal-dates')
                                    ]"
                                    aria-required="true"
                                    filled
                                    lazy-rules
                                    type="date"
                                    :hint="t('project.real-date-hint')"
                                    clearable
                                    @update:model-value="checkIfDatesAreLegal"
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
                                    lazy-rules
                                    type="date"
                                    :hint="t('project.real-date-hint')"
                                    @update:model-value="checkIfDatesAreLegal"
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
                            <fieldset>
                                <legend class="title-3">{{ t('project.contact-infos') }}</legend>
                                <h4 class="title-4">{{ t('project.applicant') }}</h4>
                                <div class="display-row">
                                    <p class="row-title">{{ projectReview.association ? t('association.labels.name') : t('project.individual-project-bearer') }}</p>
                                    <p>{{ applicant() }}</p>
                                </div>
                                <div class="display-row">
                                    TODO : adresse du porteur individuel
                                    <p class="row-title">{{ t('association.labels.address') }}</p>
                                    <p>{{ association.address }}</p>
                                </div>
                                <div class="display-row">
                                    <p class="row-title">{{ projectReview.association ? t('association.labels.phone') : t('user.phone') }}</p>
                                    <p>{{ projectReview.association ? association.phone : userStore.user?.phone }}</p>
                                </div>
                                <div class="display-row">
                                    <p class="row-title">{{ projectReview.association ? t('association.labels.mail') : t('user.mail') }}</p>
                                    <p>{{ projectReview.association ? association.email : userStore.user?.email }}</p>
                                </div>
                                <div v-if="projectReview.association">
                                    <QInput
                                        v-model="association.presidentNames"
                                        :label="t('association.labels.president-name')"
                                        :rules="[val => val && val.length > 0 || t('forms.fill-field')]"
                                        filled
                                        lazy-rules
                                        clearable
                                    />
                                    <QInput
                                        v-model="association.presidentPhone"
                                        :label="t('association.labels.president-phone')"
                                        :rules="association.presidentPhone ? [val => phoneRegex.test(val) || t('forms.required-phone')] : []"
                                        clearable
                                        filled
                                        type="tel"
                                        class="no-rules"
                                    />
                                    <!--                                <QInput
                                        v-model="association.presidentEmail"
                                        :label="t('association.labels.president-mail')"
                                        :rules="association.presidentEmail ? [(val, rules) => rules.email(val) || t('forms.required-email')] : []"
                                        clearable
                                        filled
                                        type="email"
                                    />-->
                                    <QInput
                                        v-model="projectReview.otherFirstName"
                                        :label="t('project.other-first-name')"
                                        filled
                                        lazy-rules
                                        clearable
                                        class="no-rules"
                                    />
                                    <QInput
                                        v-model="projectReview.otherLastName"
                                        :label="t('project.other-last-name')"
                                        filled
                                        lazy-rules
                                        clearable
                                        class="no-rules"
                                    />
                                    <QInput
                                        v-model="projectReview.otherEmail"
                                        :label="t('project.other-email')"
                                        filled
                                        lazy-rules
                                        clearable
                                        type="mail"
                                        class="no-rules"
                                        :rules="projectReview.otherEmail ? [(val, rules) => rules.email(val) || t('forms.required-email')] : []"
                                    />
                                    <QInput
                                        v-model="projectReview.otherPhone"
                                        :label="t('project.other-phone')"
                                        :rules="projectReview.otherPhone ? [val => phoneRegex.test(val) || t('forms.required-phone')] : []"
                                        clearable
                                        filled
                                        type="tel"
                                        class="no-rules"
                                    />
                                </div>
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

                    <!-- COMMISSION CHOICE -->

                    <!-- BUDGET -->

                    <!-- GOALS -->

                    <!-- DOCUMENTS -->

                    <!-- RECAP -->
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

.q-form, fieldset
    display: flex
    flex-direction: column
    gap: 1rem

.display-row
    width: 100%

.no-rules
    padding-bottom: 20px
</style>
