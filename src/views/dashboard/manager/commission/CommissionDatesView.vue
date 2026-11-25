<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import CommissionDateCreateForm from '@/components/commission/commissionDates/CommissionDateCreateForm.vue'
import CommissionDate from '@/components/commission/commissionDates/CommissionDate.vue'
import useCommissionDate from '@/composables/useCommissionDate'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
const {
  updateCommissions,
  newCommission,
  newCommissionDatesAreLegal,
  canSubmitNewCommission,
  loadCommissionDates,
  onAddCommission
} = useCommissionDate()

const newCommissionForm = ref<InstanceType<typeof CommissionDateCreateForm> | null>(null)

onMounted(loadCommissionDates)

async function onSubmitNewCommission(): Promise<void> {
  if (await onAddCommission()) newCommissionForm.value?.resetValidation()
}
</script>

<template>
  <div class="dashboard-section">
    <h2>
      <i
        aria-hidden="true"
        class="bi bi-calendar-check"
      ></i>
      {{ t('commission.ongoing-or-to-come') }}
    </h2>
    <div class="dashboard-section-container">
      <div class="container">
        <CommissionDate
          v-for="(commission, index) in updateCommissions"
          :key="commission.id"
          v-model="updateCommissions[index]"
        />
      </div>
    </div>
  </div>

  <CommissionDateCreateForm
    ref="newCommissionForm"
    v-model="newCommission"
    :can-submit="canSubmitNewCommission"
    :dates-are-legal="newCommissionDatesAreLegal"
    @submit="onSubmitNewCommission"
  />
</template>

<style lang="scss" scoped>
@import "@/assets/styles/dashboard";
@import "@/assets/styles/forms";
</style>
