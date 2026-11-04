<script lang="ts" setup>
import GlobalTab from '@/components/global/GlobalTab.vue'
import type {Tab} from '#/global'
import ProjectListTable from '@/components/project/projectList/ProjectListTable.vue'
import CommissionListCard from '@/components/commission/CommissionListCard.vue'
import {ref, watch} from 'vue'
import {useQuasar} from 'quasar'
import {useCommissionStore} from '@/stores/useCommissionStore'
import useProject from '@/composables/useProject'
import type {CommissionFilters} from '#/commission'

const {dashboardTab} = useProject()
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

const showClosedCommissions = ref<boolean>(false)

async function onGetCommissions() {
  loading.show()
  const filters: Partial<CommissionFilters> = {}
  if (!showClosedCommissions.value) {
    filters.isOpenToProjects = true
  }
  //await commissionStore.getManagedCommissions(filters)
  await commissionStore.getCommissions(filters)
  loading.hide()
}

watch(() => dashboardTab.value, async () => {
  if (dashboardTab.value === 1) {
    await onGetCommissions()
  }
})
</script>

<template>
  <div class="section">
    <div class="container-lg">
      <GlobalTab
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
            <div>
              <QToggle
                v-model="showClosedCommissions"
                color="commission"
                label="Voir les commissions non ouvertes"
                @update:model-value="onGetCommissions"
              />
            </div>
            <CommissionListCard
              v-for="commission in commissionStore.commissions?.results"
              :key="`commission-${commission.id}`"
              :commission="commission"
              :heading-level="2"
            />
          </section>
        </template>
      </GlobalTab>
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
