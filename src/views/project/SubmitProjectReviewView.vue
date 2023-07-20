<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import axios from 'axios'
import useDocumentUploads from '@/composables/useDocumentUploads'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import {onMounted, ref, watch} from 'vue'
import {useUserStore} from '@/stores/useUserStore'
import {useProjectStore} from '@/stores/useProjectStore'
import {useRoute} from 'vue-router'
import useUtility from '@/composables/useUtility'
import FormProjectDocumentUploads from '@/components/form/FormDocumentUploads.vue'
import FormUserAddress from '@/components/form/FormUserAddress.vue'
import useSubmitReview from '@/composables/useSubmitReview'
import ProjectRecapCommissions from '@/components/project/ProjectRecapCommissions.vue'
import InfoProcessDocuments from '@/components/infoPanel/InfoProcessDocuments.vue'
import ProjectReviewRecap from '@/components/project/ProjectReviewRecap.vue'
import InfoFormRequiredFields from '@/components/infoPanel/InfoFormRequiredFields.vue'

const {t} = useI18n()
const {catchHTTPError} = useErrors()
const {loading, notify} = useQuasar()
const userStore = useUserStore()
const projectStore = useProjectStore()
const route = useRoute()
const {CURRENCY, fromDateIsAnterior} = useUtility()
const {
    uploadDocuments
} = useDocumentUploads()
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

        <div class="dashboard-section-container">
            <div class="container">
                <!-- Info panel -->
                <InfoProcessDocuments :processes="['DOCUMENT_PROJECT_REVIEW']"/>

                <QStepper
                    ref="stepper"
                    v-model="step"
                    active-color="commission-bold"
                    animated
                >
                    <!-- BASIC INFOS -->
                    <QStep
                        :name="1"
                        :title="t('project.general-infos')"
                        icon="mdi-card-text-outline"
                    >
                        <QForm
                            class="flex-column"
                            @submit.prevent="onSubmitProjectReviewInfos(2)"
                        >
                            <InfoFormRequiredFields/>
                            <div class="flex-column">
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
                                    :label="t('project.planned-start-date') + ' *'"
                                    :rules="[
                                        val => val && val.length > 0 || t('forms.required-project-startdate'),
                                        val => val && datesAreLegal || t('forms.legal-dates')
                                    ]"
                                    aria-required="true"
                                    bottom-slots
                                    clearable
                                    color="commission"
                                    filled
                                    for="realStartDate"
                                    reactive-rules
                                    type="date"
                                >
                                    <template v-slot:hint>
                                        <p aria-describedby="realStartDate">{{ t('project.real-date-hint') }}</p>
                                    </template>
                                </QInput>
                                <QInput
                                    v-model="projectReview.realEndDate"
                                    :label="t('project.planned-end-date') + ' *'"
                                    :rules="[
                                        val => val && val.length > 0 || t('forms.required-project-enddate'),
                                        val => val && datesAreLegal || t('forms.legal-dates')
                                    ]"
                                    aria-required="true"
                                    bottom-slots
                                    clearable
                                    color="commission"
                                    filled
                                    for="realEndDate"
                                    reactive-rules
                                    type="date"
                                >
                                    <template v-slot:hint>
                                        <p aria-describedby="realEndDate">{{ t('project.real-date-hint') }}</p>
                                    </template>
                                </QInput>
                                <QInput
                                    v-model="projectReview.realLocation"
                                    :label="t('project.planned-location') + ' *'"
                                    :rules="[val => val && val.length > 0 || t('forms.required-project-location')]"
                                    aria-required="true"
                                    bottom-slots
                                    clearable
                                    color="commission"
                                    filled
                                    for="realLocation"
                                    lazy-rules
                                >
                                    <template v-slot:hint>
                                        <p aria-describedby="realLocation">{{ t('project.real-location-hint') }}</p>
                                    </template>
                                </QInput>
                            </div>

                            <div v-if="projectReview.user">
                                <fieldset class="flex-column">
                                    <legend class="title-4">{{ t('address.address') }}</legend>
                                    <div class="info-panel info-panel-warning">
                                        <i
                                            aria-hidden="true"
                                            class="bi bi-info"
                                        ></i>
                                        <p>{{ t('address.verify') }}</p>
                                    </div>
                                    <FormUserAddress
                                        :user="userStore.user"
                                        color="commission"
                                    />
                                </fieldset>
                            </div>

                            <h3>{{ t('commission.commission', 1) }}</h3>
                            <ProjectRecapCommissions :view="'submitProjectReview'"/>

                            <div class="fieldset">
                                <h3>
                                    {{ t('project.outcome') + ' / ' + t('project.income') }}
                                </h3>

                                <QInput
                                    v-model="projectReview.outcome"
                                    :label="t('project.outcome') + ' *'"
                                    :rules="[ val => val && val.length > 0 || t('forms.required-project-outcome')]"
                                    :shadow-text="` ${CURRENCY}`"
                                    aria-required="true"
                                    clearable
                                    color="commission"
                                    filled
                                    inputmode="numeric"
                                    lazy-rules
                                    min="0"
                                    type="number"
                                />

                                <QInput
                                    v-model="projectReview.income"
                                    :label="t('project.income') + ' *'"
                                    :rules="[ val => val && val.length > 0 || t('forms.required-project-income')]"
                                    :shadow-text="` ${CURRENCY}`"
                                    aria-required="true"
                                    clearable
                                    color="commission"
                                    filled
                                    inputmode="numeric"
                                    lazy-rules
                                    min="0"
                                    type="number"
                                />
                            </div>
                            <div class="flex-row-center">
                                <QBtn
                                    :label="t('continue')"
                                    class="btn-lg"
                                    color="commission"
                                    icon="bi-check-lg"
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
                            class="flex-column"
                            @submit.prevent="onSubmitProjectReviewInfos(3)"
                        >
                            <QInput
                                v-model="projectReview.review"
                                :label="t('project.moral-review') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.required-project-moral-review')]"
                                aria-required="true"
                                bottom-slots
                                clearable
                                color="commission"
                                filled
                                for="moralReview"
                                lazy-rules
                                type="textarea"
                            >
                                <template v-slot:hint>
                                    <p aria-describedby="moralReview">{{ t('project.moral-review-hint') }}</p>
                                </template>
                            </QInput>
                            <QInput
                                v-model="projectReview.impactStudents"
                                :label="t('project.impact-students') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.required-project-impact')]"
                                aria-required="true"
                                clearable
                                color="commission"
                                filled
                                lazy-rules
                                type="textarea"
                            />
                            <QInput
                                v-model="projectReview.description"
                                :label="t('project.description') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.required-project-description')]"
                                aria-required="true"
                                bottom-slots
                                clearable
                                color="commission"
                                filled
                                for="description"
                                lazy-rules
                                type="textarea"
                            >
                                <template v-slot:hint>
                                    <p aria-describedby="description">{{ t('project.description-hint') }}</p>
                                </template>
                            </QInput>
                            <QInput
                                v-model="projectReview.difficulties"
                                :label="t('project.difficulties') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.required-project-difficulties')]"
                                aria-required="true"
                                clearable
                                color="commission"
                                filled
                                lazy-rules
                                type="textarea"
                            />
                            <QInput
                                v-model="projectReview.improvements"
                                :label="t('project.improvements') + ' *'"
                                :rules="[ val => val && val.length > 0 || t('forms.required-project-improvements')]"
                                aria-required="true"
                                clearable
                                color="commission"
                                filled
                                lazy-rules
                                type="textarea"
                            />
                            <div class="flex-row-center">
                                <QBtn
                                    :label="t('back')"
                                    class="btn-lg"
                                    color="commission"
                                    icon="bi-chevron-left"
                                    @click="onSubmitProjectReviewInfos(1)"
                                />
                                <QBtn
                                    :label="t('continue')"
                                    class="btn-lg"
                                    color="commission"
                                    icon="bi-check-lg"
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
                            <FormProjectDocumentUploads
                                :association-id="projectReview.association"
                                process="review"
                            />

                            <div class="flex-row-center">
                                <QBtn
                                    :label="t('back')"
                                    class="btn-lg"
                                    color="commission"
                                    icon="bi-chevron-left"
                                    @click="onUploadDocuments(2)"
                                />
                                <QBtn
                                    :label="t('continue')"
                                    class="btn-lg"
                                    color="commission"
                                    icon="bi-check-lg"
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
</style>
