<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import type {Fund} from '#/fund'
import type {CommissionFund} from '#/commission'
import type {ProjectCommissionFundBase} from '#/project'
import useUtil from '@/composables/useUtil'

const {t} = useI18n()
const {isFilledValue} = useUtil()

const projectCommissionFundsDetail = defineModel<ProjectCommissionFundBase[]>(
  'projectCommissionFundsDetail',
  {required: true}
)

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
  <section class="flex-column">
    <h4>{{ t('project.amounts-asked') }}</h4>
    <QInput
      v-for="commissionFund in projectCommissionFundsDetail"
      :key="commissionFund.id"
      v-model="commissionFund.amountAsked"
      :data-test="fundAcronym(commissionFund.commissionFund) + '-amount-asked-input'"
      :label="fundAcronym(commissionFund.commissionFund) + ' *'"
      :rules="[
        val => isFilledValue(val) || t('forms.required-project-budget'),
        val => Number(val) > 0 || t('forms.greater-than-zero')
      ]"
      :shadow-text="` ${currency}`"
      color="commission"
      filled
      inputmode="numeric"
      type="number"
    />
  </section>
</template>
