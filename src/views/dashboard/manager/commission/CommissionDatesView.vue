<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import CommissionDatesList from '@/components/commission/commissionDates/CommissionDatesList.vue'
import NewCommissionDateForm from '@/components/commission/commissionDates/NewCommissionDateForm.vue'
import useCommissionDate from '@/composables/useCommissionDate'

const {
  updateCommissions,
  newCommission,
  fundsLabels,
  newCommissionDatesAreLegal,
  canSubmitNewCommission,
  checkCommissionDates,
  loadCommissionDates,
  onUpdateCommission,
  onDeleteCommission,
  onAddCommission
} = useCommissionDate()

const newCommissionForm = ref<InstanceType<typeof NewCommissionDateForm> | null>(null)

onMounted(loadCommissionDates)

async function onSubmitNewCommission(): Promise<void> {
  if (await onAddCommission()) newCommissionForm.value?.resetValidation()
}
</script>

<template>
  <CommissionDatesList
    :commissions="updateCommissions"
    :funds-labels="fundsLabels"
    @dates-change="checkCommissionDates"
    @update-commission-date="onUpdateCommission"
    @delete-commission-date="onDeleteCommission"
  />

  <NewCommissionDateForm
    ref="newCommissionForm"
    v-model="newCommission"
    :funds-labels="fundsLabels"
    :can-submit="canSubmitNewCommission"
    :dates-are-legal="newCommissionDatesAreLegal"
    @submit="onSubmitNewCommission"
  />
</template>
