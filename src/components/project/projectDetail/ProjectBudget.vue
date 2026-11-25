<script lang="ts" setup>
import useProject from '@/composables/useProject'
import {useProjectStore} from '@/stores/useProjectStore'
import {useI18n} from 'vue-i18n'
import useCommissionFund from '@/composables/useCommissionFund'
import useUtil from '@/composables/useUtil'
import GlobalDefinition from '@/components/global/GlobalDefinition.vue'
import {computed, onMounted} from 'vue'
import axios from 'axios'
import {useRoute} from 'vue-router'
import {useQuasar} from 'quasar'
import useError from '@/composables/useError'

const {t} = useI18n()
const {projectBudget} = useProject()
const {commissionFundLabel} = useCommissionFund()
const {CURRENCY} = useUtil()
const projectStore = useProjectStore()
const route = useRoute()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useError()

const projectReEdition = computed<boolean>(() => {
  return projectStore.project?.projectCommissionFunds.some(obj => !obj.isFirstEdition)
})

const projectId = computed<number>(() => {
  return parseInt(route.params.projectId as string)
})

async function onGetData() {
  try {
    await projectStore.getProjectCommissionFunds({
      filter: 'project',
      projectId: projectId.value,
    })
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      notify({
        type: 'negative',
        message: await catchHTTPError(error.response)
      })
    }
  }
}

onMounted(async () => {
  loading.show()
  await onGetData()
  loading.hide()
})
</script>

<template>
  <div class="flex-column">
    <GlobalDefinition :title="t('project.re-edition')">
      {{
        projectReEdition ? t('yes') : t('no')
      }}
    </GlobalDefinition>
    <GlobalDefinition
      v-if="projectReEdition"
      :title="t('project.budget-previous-edition')"
    >
      {{ projectBudget.budgetPreviousEdition + CURRENCY }}
    </GlobalDefinition>
    <GlobalDefinition :title="t('project.target-audience')">{{ projectBudget.targetAudience }}</GlobalDefinition>
    <div class="grid">
      <GlobalDefinition :title="t('project.target-students-amount')">
        {{
          projectBudget.amountStudentsAudience
        }}
      </GlobalDefinition>
      <GlobalDefinition :title="t('project.target-all-amount')">{{ projectBudget.amountAllAudience }}</GlobalDefinition>
    </div>
    <div class="grid">
      <GlobalDefinition :title="t('project.ticket-price')">
        {{ projectBudget.ticketPrice + CURRENCY }}
      </GlobalDefinition>

      <GlobalDefinition :title="t('project.student-ticket-price')">
        {{ projectBudget.studentTicketPrice + CURRENCY }}
      </GlobalDefinition>

      <GlobalDefinition :title="t('project.individual-cost')">
        {{ projectBudget.individualCost + CURRENCY }}
      </GlobalDefinition>
    </div>


    <div
      v-for="projectCommissionFund in projectStore.projectCommissionFunds"
      :key="projectCommissionFund.id"
      class="flex-column padding-top"
    >
      <h3>{{ commissionFundLabel(projectCommissionFund.commissionFund) }}</h3>

      <div
        v-if="projectReEdition"
        class="flex-row"
      >
        <GlobalDefinition :title="t('project.previous-asked')">
          {{ projectCommissionFund.amountAskedPreviousEdition + CURRENCY }}
        </GlobalDefinition>

        <GlobalDefinition :title="t('project.previous-earned')">
          {{ projectCommissionFund.amountEarnedPreviousEdition + CURRENCY }}
        </GlobalDefinition>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms";

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 2rem;
}
</style>
