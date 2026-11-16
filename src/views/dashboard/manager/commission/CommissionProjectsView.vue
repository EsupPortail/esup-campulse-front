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

const route = useRoute()
const {loading, notify} = useQuasar()
const commissionStore = useCommissionStore()
const {catchHTTPError} = useError()
const {reverseDate, dynamicTitle} = useUtil()

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
  dynamicTitle.value = commissionStore.commission?.name
})
</script>

<template>
  <div class="dashboard-section">
    <div class="dashboard-section-container">
      <div class="container-lg flex-column">
        <dl>
          <GlobalDefinition title="Date de commission">
            {{ reverseDate(commissionStore.commission?.commissionDate) }}
          </GlobalDefinition>
          <GlobalDefinition title="Date de soumission">
            {{ reverseDate(commissionStore.commission?.submissionDate) }}
          </GlobalDefinition>
          <GlobalDefinition title="Financeurs">
            <QChip
              v-for="fund in commissionStore.commission?.funds"
              :key="`fund-${fund.id}`"
              color="commission"
              outline
            >
              {{ fund.acronym }}
            </QChip>
          </GlobalDefinition>
          <GlobalDefinition title="Projets soumis">
            {{ commissionStore.commission?.submittedProjectsCount ?? 0 }}
          </GlobalDefinition>
          <GlobalDefinition title="En attente de validation">
            {{ commissionStore.commission?.processingProjectsCount ?? 0 }}
          </GlobalDefinition>
          <GlobalDefinition title="En attente de modification">
            {{ commissionStore.commission?.standbyProjectsCount ?? 0 }}
          </GlobalDefinition>
          <GlobalDefinition title="Bilan en retard">
            {{ commissionStore.commission?.overdueReviewCount ?? 0 }}
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
}
</style>