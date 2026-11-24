<script lang="ts" setup>
import {nextTick, onMounted, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {onBeforeRouteLeave, useRoute} from 'vue-router'
import useSubmitProject from '@/composables/useSubmitProject'
import InfoProcessDocuments from '@/components/documents/InfoProcessDocuments.vue'
import ProjectComments from '@/components/project/projectDetail/ProjectComments.vue'
import ProjectRecap from '@/components/project/ProjectRecap.vue'
import SubmitProjectBasicInfosStep from '@/components/project/submitProject/SubmitProjectBasicInfosStep.vue'
import SubmitProjectCommissionStep from '@/components/project/submitProject/SubmitProjectCommissionStep.vue'
import SubmitProjectBudgetStep from '@/components/project/submitProject/SubmitProjectBudgetStep.vue'
import SubmitProjectGoalsStep from '@/components/project/submitProject/SubmitProjectGoalsStep.vue'
import SubmitProjectDocumentsStep from '@/components/project/submitProject/SubmitProjectDocumentsStep.vue'

const {t} = useI18n()
const route = useRoute()
const {
  step,
  projectId,
  projectReEdition,
  isLoaded,
  applicant,
  associationId,
  projectInfos,
  projectCategory,
  projectBudget,
  projectCommission,
  projectCommissionFunds,
  projectCommissionFundsDetail,
  projectGoals,
  commissionLabels,
  commissionFunds,
  funds,
  fundsLabels,
  associationUserLabels,
  datesAreLegal,
  correctAudienceAmount,
  CURRENCY,
  profileStore,
  projectStore,
  init,
  loadCommissionData,
  loadProjectBudget,
  loadProjectGoals,
  onCommissionChange,
  submitBasicInfos,
  submitCommission,
  submitBudget,
  submitGoals,
  submitDocuments,
  submitProjectForValidation,
  downloadUploadedDocument,
  goToStep,
  resetForm
} = useSubmitProject()

onMounted(async () => {
  await init(Number.parseInt(route.params.projectId as string))
})

watch(step, async nextStep => {
  await nextTick()
  document.getElementById('stepper')?.scrollIntoView(true)
  if (nextStep === 2) await loadCommissionData()
  if (nextStep === 3) await loadProjectBudget()
  if (nextStep === 4) loadProjectGoals()
})

onBeforeRouteLeave(resetForm)
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
          animated
        >
          <QStep
            :name="1"
            :title="t('project.general-infos')"
            icon="bi-card-text"
          >
            <SubmitProjectBasicInfosStep
              v-model:project-infos="projectInfos"
              v-model:project-category="projectCategory"
              :project-category-labels="projectStore.projectCategoryLabels"
              :association-user-labels="associationUserLabels"
              :applicant="applicant"
              :dates-are-legal="datesAreLegal"
              :user="profileStore.user"
              @submit="submitBasicInfos(2)"
            />
          </QStep>

          <QStep
            :name="2"
            :title="t('project.commission-choice')"
            icon="bi-calendar"
          >
            <SubmitProjectCommissionStep
              v-model:project-commission="projectCommission"
              v-model:project-commission-funds="projectCommissionFunds"
              :commission-labels="commissionLabels"
              :funds-labels="fundsLabels"
              @submit="submitCommission(3)"
              @back="submitCommission(1)"
              @commission-change="onCommissionChange"
            />
          </QStep>

          <QStep
            :name="3"
            :title="t('project.budget')"
            icon="bi-piggy-bank"
          >
            <SubmitProjectBudgetStep
              v-model:project-budget="projectBudget"
              v-model:project-re-edition="projectReEdition"
              v-model:project-commission-funds-detail="projectCommissionFundsDetail"
              :funds="funds"
              :commission-funds="commissionFunds"
              :currency="CURRENCY"
              :correct-audience-amount="correctAudienceAmount"
              @submit="submitBudget(4)"
              @back="submitBudget(2)"
            />
          </QStep>

          <QStep
            :name="4"
            :title="t('project.goals-title')"
            icon="bi-flag"
          >
            <SubmitProjectGoalsStep
              v-model:project-goals="projectGoals"
              @submit="submitGoals(5)"
              @back="submitGoals(3)"
            />
          </QStep>

          <QStep
            :name="5"
            :title="t('project.documents')"
            icon="bi-file-earmark"
          >
            <SubmitProjectDocumentsStep
              :association-id="associationId"
              @submit="submitDocuments(6)"
              @back="submitDocuments(4)"
            />
          </QStep>

          <QStep
            :name="6"
            :title="t('recap')"
            icon="bi-check-lg"
          >
            <ProjectRecap
              view="submitProject"
              @submit-project="submitProjectForValidation()"
              @change-step="goToStep"
              @get-file="downloadUploadedDocument"
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
