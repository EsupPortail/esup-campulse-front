<script lang="ts" setup>
import useProject from '@/composables/useProject'
import useUtility from '@/composables/useUtil'
import {useProjectStore} from '@/stores/useProjectStore'
import axios from 'axios'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useError'
import {onMounted, watch} from 'vue'
import {useCommissionStore} from '@/stores/useCommissionStore'
import {useFundStore} from '@/stores/useFundStore'
import useCommissionFund from '@/composables/useCommissionFund'

const {t} = useI18n()
const {projectBudget} = useProject()
const {commissionFundLabel} = useCommissionFund()
const {CURRENCY} = useUtility()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()

const projectStore = useProjectStore()
const commissionStore = useCommissionStore()
const fundStore = useFundStore()

const props = defineProps<{
  loadData: boolean
}>()

onMounted(() => {
  if (projectStore.project && props.loadData) getData()
})

watch(() => projectStore.project, async () => {
  if (props.loadData) {
    loading.show()
    await getData()
    loading.hide()
  }
})

async function getData() {
  try {
    await commissionStore.getAllCommissions()
    await commissionStore.getCommissionFunds()
    await projectStore.getProjectCommissionFunds(false, undefined)
    await fundStore.getFunds()
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      notify({
        type: 'negative',
        message: await catchHTTPError(error.response)
      })
    }
  }
}

const projectReEdition = () => {
  return projectStore.projectCommissionFunds.some(obj => obj.isFirstEdition === false)
}
</script>

<template>
  <div class="flex-column">
    <div class="display-row">
      <h4>{{ t('project.re-edition') }}</h4>
      <p>
        {{
          projectReEdition() ? t('yes') : t('no')
        }}
      </p>
    </div>

    <div
      v-if="projectReEdition()"
      class="display-row"
    >
      <h4>{{ t('project.budget-previous-edition') }}</h4>
      <p>{{ projectBudget.budgetPreviousEdition + CURRENCY }}</p>
    </div>

    <div class="display-row">
      <h4>{{ t('project.target-audience') }}</h4>
      <p>{{ projectBudget.targetAudience }}</p>
    </div>

    <div class="display-row">
      <h4>{{ t('project.target-students-amount') }}</h4>
      <p>{{ projectBudget.amountStudentsAudience }}</p>
    </div>

    <div class="display-row">
      <h4>{{ t('project.target-all-amount') }}</h4>
      <p>{{ projectBudget.amountAllAudience }}</p>
    </div>

    <div class="display-row">
      <h4>{{ t('project.ticket-price') }}</h4>
      <p>{{ projectBudget.ticketPrice + CURRENCY }}</p>
    </div>

    <div class="display-row">
      <h4>{{ t('project.student-ticket-price') }}</h4>
      <p>{{ projectBudget.studentTicketPrice + CURRENCY }}</p>
    </div>

    <div class="display-row">
      <h4>{{ t('project.individual-cost') }}</h4>
      <p>{{ projectBudget.individualCost + CURRENCY }}</p>
    </div>

    <div
      v-for="projectCommissionFund in projectStore.projectCommissionFunds"
      :key="projectCommissionFund.id"
      class="flex-column padding-top"
    >
      <h3>{{ commissionFundLabel(projectCommissionFund.commissionFund) }}</h3>

      <div
        v-if="projectReEdition()"
        class="flex-row"
      >
        <div class="display-row">
          <h4>{{ t('project.previous-asked') }}</h4>
          <p>
            {{
              projectCommissionFund.amountAskedPreviousEdition +
                CURRENCY
            }}
          </p>
        </div>

        <div class="display-row">
          <h4>{{ t('project.previous-earned') }}</h4>
          <p>
            {{
              projectCommissionFund.amountEarnedPreviousEdition +
                CURRENCY
            }}
          </p>
        </div>
      </div>

      <div class="flex-row">
        <div class="display-row">
          <h4>{{ t('project.amount-asked') }}</h4>
          <p>{{ projectCommissionFund.amountAsked + CURRENCY }}</p>
        </div>

        <div
          v-if="projectCommissionFund.amountEarned || projectCommissionFund.amountEarned === 0"
          class="display-row"
        >
          <h4>{{ t('project.amount-earned') }}</h4>
          <p>{{ projectCommissionFund.amountEarned + CURRENCY }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
@import "@/assets/_variables.scss";

.flex-row > * {
  width: $fullSize;
}
</style>
