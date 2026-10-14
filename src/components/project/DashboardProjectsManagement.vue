<script lang="ts" setup>
import AtomicTab from '@/components/global/GlobalTab.vue'
import type {Tab} from '#/global'
import ProjectListTable from '@/components/project/projectList/ProjectListTable.vue'
import CommissionListCard from '@/components/commission/CommissionListCard.vue'
import useManageProjects from '@/composables/useManageProject'
import {watch} from 'vue'
import {useQuasar} from 'quasar'
import {useCommissionStore} from '@/stores/useCommissionStore'

const {dashboardTab} = useManageProjects()
const {loading} = useQuasar()
const commissionStore = useCommissionStore()

const tabs: Tab[] = [
  {
    label: 'Gestion par projet',
    slotName: 'projects'
  },
  {
    label: 'Gestion par commission',
    slotName: 'commissions'
  }
]

async function getCommissions() {
  loading.show()
  await commissionStore.getCommissionsForManagers(
    undefined,
    undefined,
    true,
    undefined,
    true
  )
  loading.hide()
}

watch(() => dashboardTab.value, () => {
  if (dashboardTab.value === 1) {
    getCommissions()
  }
})
</script>

<template>
  <div class="section">
    <div class="container-lg">
      <AtomicTab
        v-model:current-tab="dashboardTab"
        :tab-list="tabs"
      >
        <template #projects>
          <section>
            <ProjectListTable/>
          </section>
        </template>
        <template #commissions>
          <section class="flex-column">
            <CommissionListCard
              v-for="commission in commissionStore.commissions?.results"
              :key="`commission-${commission.id}`"
              :commission="commission"
              :heading-level="2"
            />
          </section>
        </template>
      </AtomicTab>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';

.section {
  background-color: #f5f5f5;
}

.container-lg {
  padding: 1rem;
}
</style>
