<script lang="ts" setup>
import {useProjectStore} from '@/stores/useProjectStore'
import axios from 'axios'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useError'
import {computed, onMounted, watch} from 'vue'
import useUtility from '@/composables/useUtil'
import {useCommissionStore} from '@/stores/useCommissionStore'
import {useFundStore} from '@/stores/useFundStore'
import useCommissionFund from '@/composables/useCommissionFund'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const {CURRENCY} = useUtility()
const {commissionFundLabel} = useCommissionFund()

const projectStore = useProjectStore()
const commissionStore = useCommissionStore()
const fundStore = useFundStore()

const props = defineProps<{
  view: 'projectRecap' | 'submitProjectReview' | 'projectReviewRecap'
}>()

const projectCommissionLabel = computed(() => {
  return commissionStore.commissionLabels
    .find(x => x.value === projectStore.projectCommission)?.label
})

onMounted(async () => {
  await onGetProjectCommissions()
})

watch(() => projectStore.project, async () => {
  await onGetProjectCommissions()
})

async function onGetProjectCommissions() {
  if (projectStore.project) {
    loading.show()
    try {
      await commissionStore.getAllCommissions()
      await commissionStore.getCommissionFunds()
      await fundStore.getFunds()
      await projectStore.getProjectCommissionFunds({filter: 'project', projectId: projectStore.project?.id})
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        notify({
          type: 'negative',
          message: await catchHTTPError(error.response)
        })
      }
    }
    loading.hide()
  }
}
</script>

<template>
  <div
    v-if="props.view === 'projectRecap' || props.view === 'projectReviewRecap'"
    class="flex-column"
  >
    <div class="display-row">
      <h4>{{ t('project.commission-choice') }}</h4>
      <p>{{ projectCommissionLabel }}</p>
    </div>

    <div class="display-row">
      <h4>{{ t('commission.funds') }}</h4>
      <p>
        <QChip
          v-for="projectCommissionFund in projectStore.projectCommissionFunds"
          :key="projectCommissionFund.id"
          color="commission"
          outline
        >
          {{
            commissionFundLabel(projectCommissionFund.commissionFund)
          }}
        </QChip>
      </p>
    </div>

    <div v-if="props.view === 'projectReviewRecap'">
      <div
        v-for="projectCommissionFund in projectStore.projectCommissionFunds"
        :key="projectCommissionFund.id"
        class="flex-column"
      >
        <div class="display-row">
          <h4>
            {{
              t('project.amount-asked') + ' (' + commissionFundLabel(projectCommissionFund.commissionFund) + ')'
            }}
          </h4>
          <p>{{ projectCommissionFund.amountAsked + CURRENCY }}</p>
        </div>

        <div class="display-row">
          <h4>
            {{
              t('project.amount-earned') + ' (' + commissionFundLabel(projectCommissionFund.commissionFund) + ')'
            }}
          </h4>
          <p>{{ projectCommissionFund.amountEarned + CURRENCY }}</p>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="props.view === 'submitProjectReview'"
    class="flex-column"
  >
    <QInput
      v-model="projectCommissionLabel"
      :label="t('project.commission-choice')"
      filled
      readonly
    />
    <div
      v-for="projectCommissionFund in projectStore.projectCommissionFunds"
      :key="projectCommissionFund.id"
      class="flex-column"
    >
      <h4>{{ commissionFundLabel(projectCommissionFund.commissionFund) }}</h4>
      <QInput
        v-model="projectCommissionFund.amountAsked"
        :label="t('project.amount-asked') + ' (' + commissionFundLabel(projectCommissionFund.commissionFund) + ')'"
        :shadow-text="` ${CURRENCY}`"
        filled
        readonly
      />
      <QInput
        v-model="projectCommissionFund.amountEarned"
        :label="t('project.amount-earned') + ' (' + commissionFundLabel(projectCommissionFund.commissionFund) + ')'"
        :shadow-text="` ${CURRENCY}`"
        filled
        readonly
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
</style>
