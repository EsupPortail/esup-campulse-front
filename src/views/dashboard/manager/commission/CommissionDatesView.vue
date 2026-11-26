<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from 'vue'
import CommissionDateCreateForm from '@/components/commission/commissionDates/CommissionDateCreateForm.vue'
import CommissionDate from '@/components/commission/commissionDates/CommissionDate.vue'
import CommissionSearchForm from '@/components/commission/CommissionSearchForm.vue'
import GlobalPagination from '@/components/global/GlobalPagination.vue'
import useCommissionDate from '@/composables/useCommissionDate'
import useCommissionFund from '@/composables/useCommissionFund'
import {useCommissionStore} from '@/stores/useCommissionStore'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
const {
  updateCommissions,
  newCommission,
  newCommissionDatesAreLegal,
  newCommissionEditionDateIsLegal,
  canSubmitNewCommission,
  loadCommissionDates: onGetCommissions,
  onAddCommission
} = useCommissionDate()
const {
  openCommissionSearch,
  clearCommissionSearch,
  commissionPaginationCurrent
} = useCommissionFund()
const commissionStore = useCommissionStore()

const newCommissionForm = ref<InstanceType<typeof CommissionDateCreateForm> | null>(null)

onMounted(onGetCommissions)

onUnmounted(() => {
  openCommissionSearch.value = false
  commissionPaginationCurrent.value = 1
  clearCommissionSearch()
})

async function onResetCommissionsPage(): Promise<void> {
  commissionPaginationCurrent.value = 1
  await onGetCommissions()
}

async function onSubmitNewCommission(): Promise<void> {
  if (await onAddCommission()) newCommissionForm.value?.resetForm()
}
</script>

<template>
  <section class="dashboard-section">
    <h2>
      <i
        aria-hidden="true"
        class="bi bi-calendar-check"
      ></i>
      {{ t('commission.ongoing-or-to-come') }}
    </h2>
    <div class="dashboard-section-container">
      <div class="container flex-column">
        <CommissionSearchForm
          :fields="{
            name: true,
            commissionDate: true,
            submissionDate: true,
            editionDate: true,
            funds: true
          }"
          @clear="clearCommissionSearch"
          @search="onResetCommissionsPage"
        />
        <div class="padding-top">
          <CommissionDate
            v-for="(commission, index) in updateCommissions"
            :key="commission.id"
            v-model="updateCommissions[index]"
          />
        </div>
        <GlobalPagination
          v-model="commissionPaginationCurrent"
          :count="commissionStore.managedCommissions?.count"
          :total-pages="commissionStore.managedCommissions?.totalPages"
          @change="onGetCommissions"
        />
      </div>
    </div>
  </section>

  <section class="dashboard-section">
    <h2>
      <i
        aria-hidden="true"
        class="bi bi-calendar-plus"
      ></i>
      {{ t('commission.add-new-date') }}
    </h2>
    <div class="dashboard-section-container">
      <div class="container">
        <CommissionDateCreateForm
          ref="newCommissionForm"
          v-model="newCommission"
          :can-submit="canSubmitNewCommission"
          :dates-are-legal="newCommissionDatesAreLegal"
          :edition-date-is-legal="newCommissionEditionDateIsLegal"
          @submit="onSubmitNewCommission"
        />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/dashboard";
@import "@/assets/styles/forms";
</style>
