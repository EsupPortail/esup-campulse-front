<script lang="ts" setup>
import ProjectListTable from '@/components/project/projectList/ProjectListTable.vue'
import {computed, onMounted} from 'vue'
import {useRoute} from 'vue-router'
import axios from 'axios'
import {useQuasar} from 'quasar'
import {useCommissionStore} from '@/stores/useCommissionStore'
import useError from '@/composables/useError'
import GlobalDefinition from '@/components/global/GlobalDefinition.vue'
import useUtil from '@/composables/useUtil'
import {useI18n} from 'vue-i18n'

const route = useRoute()
const {t} = useI18n()
const {loading, notify} = useQuasar()
const commissionStore = useCommissionStore()
const {catchHTTPError} = useError()
const {reverseDate, dynamicTitle, formatDate} = useUtil()

const commissionId = computed<number>(() => {
  return parseInt(route.params.commissionId as string)
})

const archived = computed<boolean>(() => {
  return (route.name as string).includes('Archived')
})

async function onGetCommission() {
  loading.show()
  try {
    await commissionStore.getManagedCommission(commissionId.value)
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

onMounted(async () => {
  await onGetCommission()
  dynamicTitle.value = commissionStore.managedCommission?.name
})
</script>

<template>
  <div class="dashboard-section">
    <div class="dashboard-section-container">
      <div class="container-lg flex-column">
        <dl>
          <GlobalDefinition :title="t('commission.date')">
            {{ reverseDate(commissionStore.managedCommission?.commissionDate) }}
          </GlobalDefinition>
          <GlobalDefinition :title="t('commission.submission-date')">
            {{ reverseDate(commissionStore.managedCommission?.submissionDate) }}
          </GlobalDefinition>
          <GlobalDefinition :title="t('edition-date')">
            {{ reverseDate(formatDate(commissionStore.managedCommission?.editionDate)) }}
          </GlobalDefinition>
          <GlobalDefinition :title="t('commission.funds')">
            <QChip
              v-for="fund in commissionStore.managedCommission?.funds"
              :key="`fund-${fund.id}`"
              color="commission"
              outline
            >
              {{ fund.acronym }}
            </QChip>
          </GlobalDefinition>
          <GlobalDefinition :title="t('commission.submitted-projects-count')">
            {{ commissionStore.managedCommission?.submittedProjectsCount ?? 0 }}
          </GlobalDefinition>
          <GlobalDefinition :title="t('validation-pending')">
            {{ commissionStore.managedCommission?.processingProjectsCount ?? 0 }}
          </GlobalDefinition>
          <GlobalDefinition :title="t('edition-pending')">
            {{ commissionStore.managedCommission?.standbyProjectsCount ?? 0 }}
          </GlobalDefinition>
          <GlobalDefinition :title="t('commission.overdue-reviews-count')">
            {{ commissionStore.managedCommission?.overdueReviewCount ?? 0 }}
          </GlobalDefinition>
        </dl>
        <ProjectListTable
          :archived
          :commission-id="commissionId"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms";
@import "@/assets/styles/dashboard";
@import "@/assets/variables";

dl {
  display: flex;
  gap: 3rem;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>