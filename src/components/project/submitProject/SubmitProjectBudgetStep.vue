<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import type {Fund} from '#/fund'
import type {CommissionFund} from '#/commission'
import type {ProjectBudget, ProjectCommissionFundBase} from '#/project'
import useUtil from '@/composables/useUtil'
import SubmitProjectPreviousAmounts from '@/components/project/submitProject/SubmitProjectPreviousAmounts.vue'
import SubmitProjectAskedAmounts from '@/components/project/submitProject/SubmitProjectAskedAmounts.vue'

const {t} = useI18n()
const {isFilledValue} = useUtil()

const projectBudget = defineModel<ProjectBudget>('projectBudget', {required: true})
const projectReEdition = defineModel<boolean>('projectReEdition', {required: true})
const projectCommissionFundsDetail = defineModel<ProjectCommissionFundBase[]>(
  'projectCommissionFundsDetail',
  {required: true}
)

defineProps<{
  funds: Fund[],
  commissionFunds: CommissionFund[],
  currency: string,
  correctAudienceAmount: boolean
}>()

const emit = defineEmits<{
  submit: [],
  back: []
}>()
</script>

<template>
  <QForm
    class="flex-column"
    @submit.prevent="emit('submit')"
  >
    <QCheckbox
      v-model="projectReEdition"
      :label="t('project.re-edition')"
      color="commission"
    />

    <SubmitProjectPreviousAmounts
      v-if="projectReEdition"
      v-model:project-budget="projectBudget"
      v-model:project-commission-funds-detail="projectCommissionFundsDetail"
      :funds="funds"
      :commission-funds="commissionFunds"
      :currency="currency"
    />

    <QInput
      v-model="projectBudget.targetAudience"
      :label="t('project.target-audience') + ' *'"
      :rules="[val => val && val.length > 0 || t('forms.required-project-audience')]"
      aria-required="true"
      color="commission"
      filled
      reactive-rules
      type="textarea"
    />

    <QInput
      v-model="projectBudget.amountStudentsAudience"
      :label="t('project.target-students-amount') + ' *'"
      :rules="[val => isFilledValue(val) || t('forms.required-project-amount-students-audience'),
               val => isFilledValue(val) && correctAudienceAmount || t('forms.correct-amount-audience')]"
      aria-required="true"
      color="commission"
      filled
      inputmode="numeric"
      min="0"
      reactive-rules
      type="number"
    />

    <QInput
      v-model="projectBudget.amountAllAudience"
      :label="t('project.target-all-amount') + ' *'"
      :rules="[val => isFilledValue(val) || t('forms.required-project-amount-audience'),
               val => !isFilledValue(val) || Number(val) !== 0
                 || t('forms.required-project-amount-all-audience-not-null'),
               val => isFilledValue(val) && correctAudienceAmount || t('forms.correct-amount-audience')]"
      aria-required="true"
      color="commission"
      filled
      inputmode="numeric"
      lazy-rules
      min="1"
      type="number"
    />

    <QInput
      v-model="projectBudget.ticketPrice"
      :label="t('project.ticket-price') + ' *'"
      :rules="[val => isFilledValue(val) || t('forms.required-project-ticket')]"
      :shadow-text="` ${currency}`"
      aria-required="true"
      color="commission"
      filled
      inputmode="numeric"
      lazy-rules
      min="0"
      type="number"
    />

    <QInput
      v-model="projectBudget.studentTicketPrice"
      :label="t('project.student-ticket-price') + ' *'"
      :rules="[val => isFilledValue(val) || t('forms.required-project-ticket')]"
      :shadow-text="` ${currency}`"
      aria-required="true"
      color="commission"
      filled
      inputmode="numeric"
      lazy-rules
      min="0"
      type="number"
    />

    <QInput
      v-model="projectBudget.individualCost"
      :label="t('project.individual-cost') + ' *'"
      :rules="[val => isFilledValue(val) || t('forms.required-project-individual-cost'),
               val => !isFilledValue(val) || Number(val) !== 0
                 || t('forms.required-project-individual-cost-not-null')]"
      :shadow-text="` ${currency}`"
      aria-required="true"
      color="commission"
      filled
      inputmode="numeric"
      lazy-rules
      min="1"
      type="number"
    />

    <QSeparator
      aria-hidden="true"
      class="margin-bottom"
    />

    <SubmitProjectAskedAmounts
      v-model:project-commission-funds-detail="projectCommissionFundsDetail"
      :funds="funds"
      :commission-funds="commissionFunds"
      :currency="currency"
    />

    <div class="flex-row-center padding-top padding-bottom">
      <QBtn
        :label="t('back')"
        class="btn-lg"
        color="commission"
        icon="bi-chevron-left"
        @click="emit('back')"
      />
      <QBtn
        :label="t('continue')"
        class="btn-lg"
        color="commission"
        icon="bi-check2"
        type="submit"
      />
    </div>
  </QForm>
</template>
