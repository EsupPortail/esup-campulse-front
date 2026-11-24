<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import type {Fund} from '#/fund'
import type {CommissionFund} from '#/commission'
import type {ProjectBudget, ProjectCommissionFundBase} from '#/project'

const {t} = useI18n()

const projectCommissionFundsDetail = defineModel<ProjectCommissionFundBase[]>(
  'projectCommissionFundsDetail',
  {required: true}
)
const projectBudget = defineModel<ProjectBudget>('projectBudget', {required: true})

const props = defineProps<{
  funds: Fund[],
  commissionFunds: CommissionFund[],
  currency: string
}>()

function fundAcronym(commissionFundId: number): string {
  const commissionFund = props.commissionFunds.find(obj => obj.id === commissionFundId)
  return props.funds.find(obj => obj.id === commissionFund?.fund)?.acronym ?? ''
}
</script>

<template>
  <div class="flex-column">
    <h3>{{ t('project.previous-asked') }}</h3>
    <QInput
      v-for="commissionFund in projectCommissionFundsDetail"
      :key="commissionFund.id"
      v-model="commissionFund.amountAskedPreviousEdition"
      :data-test="fundAcronym(commissionFund.commissionFund) + '-amount-asked-previous-edition-input'"
      :label="fundAcronym(commissionFund.commissionFund) + ' *'"
      :rules="[val => val && val.length > 0 || t('forms.required-project-amount-asked-previous')]"
      :shadow-text="` ${props.currency}`"
      color="commission"
      filled
      inputmode="numeric"
      min="0"
      type="number"
    />
  </div>

  <div class="flex-column">
    <h3>{{ t('project.previous-earned') }}</h3>
    <QInput
      v-for="commissionFund in projectCommissionFundsDetail"
      :key="commissionFund.id"
      v-model="commissionFund.amountEarnedPreviousEdition"
      :data-test="fundAcronym(commissionFund.commissionFund) + '-amount-earned-previous-edition-input'"
      :label="fundAcronym(commissionFund.commissionFund) + ' *'"
      :rules="[val => val && val.length > 0 || t('forms.required-project-amount-earned-previous')]"
      :shadow-text="` ${props.currency}`"
      color="commission"
      filled
      inputmode="numeric"
      min="0"
      type="number"
    />
  </div>

  <QInput
    v-model="projectBudget.budgetPreviousEdition"
    :label="t('project.budget-previous-edition') + ' *'"
    :rules="[val => val && val.length > 0 || t('forms.required-project-budget-previous')]"
    :shadow-text="` ${props.currency}`"
    aria-required="true"
    color="commission"
    filled
    inputmode="numeric"
    lazy-rules
    min="0"
    type="number"
  />

  <QSeparator
    aria-hidden="true"
    class="margin-bottom"
  />
</template>
