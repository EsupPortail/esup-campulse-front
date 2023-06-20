<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import axios from 'axios'
import useProjectDocuments from '@/composables/useProjectDocuments'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import {onMounted, ref, watch} from 'vue'
import {useUserStore} from '@/stores/useUserStore'
import {useProjectStore} from '@/stores/useProjectStore'
import {useRoute} from 'vue-router'
import useUtility from '@/composables/useUtility'
import FormProjectDocumentUploads from '@/components/form/FormProjectDocumentUploads.vue'
import FormUserAddress from '@/components/form/FormUserAddress.vue'
import useSubmitReview from '@/composables/useSubmitReview'
import ProjectRecapCommissions from '@/components/project/ProjectRecapCommissions.vue'
import InfoProcessDocuments from '@/components/infoPanel/InfoProcessDocuments.vue'
import ProjectReviewRecap from '@/components/project/ProjectReviewRecap.vue'

const {t} = useI18n()
const {catchHTTPError} = useErrors()
const {loading, notify} = useQuasar()
const userStore = useUserStore()
const projectStore = useProjectStore()
const route = useRoute()
const {CURRENCY, fromDateIsAnterior} = useUtility()
const {
    uploadDocuments
} = useProjectDocuments()
const {
    projectReview,
    initProjectReview,
    patchProjectReview
} = useSubmitReview()

onMounted(async () => {
    loading.show()
    await onGetProjectReview()
    initApplicant()
    loading.hide()
})

const step = ref(1)

const applicant = ref<string | undefined>('')

const initApplicant = () => {
    if (projectReview.value.user) applicant.value = `${userStore.user?.firstName} ${userStore.user?.lastName}`
    else applicant.value = userStore.user?.associations.find(obj => obj.id === projectReview.value.association)?.name
}

const datesAreLegal = ref<boolean>(false)
const checkIfDatesAreLegal = () => {
    datesAreLegal.value = fromDateIsAnterior(projectReview.value.realStartDate, projectReview.value.realEndDate, true)
}
watch(() => projectReview.value.realStartDate, checkIfDatesAreLegal)
watch(() => projectReview.value.realEndDate, checkIfDatesAreLegal)


// Get project review and infos about the project (project commission dates...)
async function onGetProjectReview() {
    try {
        await projectStore.getProjectDetail(parseInt(route.params.projectId as string))
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

// Submit step 1 & 2 (basic infos about applicant and project)
async function onSubmitProjectReviewInfos(nextStep: number) {
    loading.show()
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
    loading.hide()
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
                <InfoProcessDocuments :process="'DOCUMENT_PROJECT_REVIEW'"/>

                <QStepper
                    ref="stepper"
                    v-model="step"
                    animated
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
                            <div class="fieldset">
                                <h3 class="title-2">{{ t('project.general-infos') }}</h3>
                                <QInput
                                    v-model="applicant"
                                    :label="t('project.applicant')"
                                    filled
                                    readonly
                                />
                                <QInput
                                    v-model="projectReview.name"
                                    :label="t('project.name')"
                                    filled
                                    readonly
                                />
                                <QInput
                                    v-model="projectReview.realStartDate"
                                    :hint="t('project.real-date-hint')"
                                    :label="t('project.planned-start-date') + ' *'"
                                    :rules="[
                                        val => val && val.length > 0 || t('forms.fill-field'),
                                        val => val && datesAreLegal || t('forms.legal-dates')
                                    ]"
                                    aria-required="true"
                                    clearable
                                    filled
                                    reactive-rules
                                    type="date"
                                />
                                <QInput
                                    v-model="projectReview.realEndDate"
                                    :hint="t('project.real-date-hint')"
                                    :label="t('project.planned-end-date') + ' *'"
                                    :rules="[
                                        val => val && val.length > 0 || t('forms.fill-field'),
                                        val => val && datesAreLegal || t('forms.legal-dates')
                                    ]"
                                    aria-required="true"
                                    clearable
                                    filled
                                    reactive-rules
                                    type="date"
                                />
                                <QInput
                                    v-model="projectReview.realLocation"
                                    :hint="t('project.real-location-hint')"
                                    :label="t('project.planned-location') + ' *'"
                                    :rules="[val => val && val.length > 0 || t('forms.fill-field')]"
                                    aria-required="true"
                                    clearable
                                    filled
                                    lazy-rules
                                />
                            </div>

                            <div v-if="projectReview.user">
                                <QSeparator/>
                                <div class="fieldset individual-bearer">
                                    <h4 class="title-3">{{ t('address.address') }}</h4>
                                    <div class="info-panel info-panel-warning">
                                        <i
                                            aria-hidden="true"
                                            class="bi bi-info"
                                        ></i>
                                        <p>{{ t('address.verify') }}</p>
                                    </div>
                                    <FormUserAddress :user="userStore.user"/>
                                </div>
                            </div>

                            <QSeparator/>

                            <h4 class="title-3">{{ t('commissions') }}</h4>
                            <ProjectRecapCommissions :view="'submitProjectReview'"/>

                            <QSeparator/>

                            <div class="fieldset">
                                <h4 class="title-3">
                                    {{ t('project.outcome') + ' / ' + t('project.income') }}
                                </h4>

                                <QInput
                                    v-model="projectReview.outcome"
                                    :label="t('project.outcome') + ' *'"
                                    :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                    :shadow-text="` ${CURRENCY}`"
                                    aria-required="true"
                                    clearable
                                    filled
                                    inputmode="numeric"
                                    lazy-rules
                                    min="0"
                                    type="number"
                                />

                                <QInput
                                    v-model="projectReview.income"
                                    :label="t('project.income') + ' *'"
                                    :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                    :shadow-text="` ${CURRENCY}`"
                                    aria-required="true"
                                    clearable
                                    filled
                                    inputmode="numeric"
                                    lazy-rules
                                    min="0"
                                    type="number"
                                />
                            </div>
                            <div class="btn-group">
                                <QBtn
                                    :label="t('continue')"
                                    icon-right="bi-check-lg"
                                    type="submit"
                                />
                            </div>
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
                            <div>
                                <h4 class="title-3">{{ t('project.review') }}</h4>

                                <QInput
                                    v-model="projectReview.review"
                                    :hint="t('project.moral-review-hint')"
                                    :label="t('project.moral-review') + ' *'"
                                    :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                    aria-required="true"
                                    clearable
                                    filled
                                    lazy-rules
                                    type="textarea"
                                />
                                <QInput
                                    v-model="projectReview.impactStudents"
                                    :label="t('project.impact-students') + ' *'"
                                    :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                    aria-required="true"
                                    clearable
                                    filled
                                    lazy-rules
                                    type="textarea"
                                />
                                <QInput
                                    v-model="projectReview.description"
                                    :hint="t('project.description-hint')"
                                    :label="t('project.description') + ' *'"
                                    :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                    aria-required="true"
                                    clearable
                                    filled
                                    lazy-rules
                                    type="textarea"
                                />
                                <QInput
                                    v-model="projectReview.difficulties"
                                    :label="t('project.difficulties') + ' *'"
                                    :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                    aria-required="true"
                                    clearable
                                    filled
                                    lazy-rules
                                    type="textarea"
                                />
                                <QInput
                                    v-model="projectReview.improvements"
                                    :label="t('project.improvements') + ' *'"
                                    :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                    aria-required="true"
                                    clearable
                                    filled
                                    lazy-rules
                                    type="textarea"
                                />
                            </div>
                            <div class="btn-group">
                                <QBtn
                                    :label="t('back')"
                                    icon="bi-chevron-left"
                                    @click="onSubmitProjectReviewInfos(1)"
                                />
                                <QBtn
                                    :label="t('continue')"
                                    icon-right="bi-check-lg"
                                    type="submit"
                                />
                            </div>
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

                            <div class="btn-group">
                                <QBtn
                                    :label="t('back')"
                                    icon="bi-chevron-left"
                                    @click="onUploadDocuments(2)"
                                />
                                <QBtn
                                    :label="t('continue')"
                                    icon-right="bi-check-lg"
                                    type="submit"
                                />
                            </div>
                        </QForm>
                    </QStep>

                    <!-- RECAP -->
                    <QStep
                        :name="4"
                        :title="t('recap')"
                        icon="mdi-check"
                    >
                        <ProjectReviewRecap
                            :view="'submitProjectReview'"
                            @change-step="newStep => step = newStep"
                        />
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

.q-form, .fieldset {
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
    margin: 0;
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

