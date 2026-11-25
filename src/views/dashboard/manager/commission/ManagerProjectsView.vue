<script lang="ts" setup>
import GlobalTab from '@/components/global/GlobalTab.vue'
import type {Tab} from '#/global'
import ProjectListTable from '@/components/project/projectList/ProjectListTable.vue'
import ProjectCommissionListCard from '@/components/commission/ProjectCommissionListCard.vue'
import {onMounted, ref, watch} from 'vue'
import {useQuasar} from 'quasar'
import {useCommissionStore} from '@/stores/useCommissionStore'
import useProject from '@/composables/useProject'
import type {CommissionFilters} from '#/commission'
import {useI18n} from 'vue-i18n'
import CommissionSearchForm from '@/components/commission/CommissionSearchForm.vue'
import useCommissionFund from '@/composables/useCommissionFund'

const {dashboardTab, openProjectSearch, clearProjectSearch} = useProject()
const {
  clearCommissionSearch,
  searchCommissionFilters,
  openCommissionSearch,
  commissionPaginationCurrent
} = useCommissionFund()
const {t} = useI18n()
const {loading} = useQuasar()
const commissionStore = useCommissionStore()

const tabs: Tab[] = [
  {
    label: t('project.manage-by-project'),
    slotName: 'projects'
  },
  {
    label: t('project.manage-by-commission'),
    slotName: 'commissions'
  }
]

const showClosedCommissions = ref<boolean>(false)

function cleanDate(date: string | null): string | null {
  if (!date) return null
  return date.replace(/\//g, '-')
}

async function onGetCommissions() {
  loading.show()
  const search = searchCommissionFilters.value
  const filters: Partial<CommissionFilters> = {
    isArchived: false,
    funds: searchCommissionFilters.value.funds,
    commissionDateAfter: cleanDate(search.commissionDate.from),
    commissionDateBefore: cleanDate(search.commissionDate.to),
    editionDateAfter: cleanDate(search.editionDate.from),
    editionDateBefore: cleanDate(search.editionDate.to),
    submissionDateAfter: cleanDate(search.submissionDate.from),
    submissionDateBefore: cleanDate(search.submissionDate.to),
    withClosedFutureCommissions: showClosedCommissions.value,
    name: search.name,
    page: commissionPaginationCurrent.value,
    pageSize: 10,
  }
  await commissionStore.getManagedCommissions(filters)
  loading.hide()
}

async function onResetCommissionsPage() {
  commissionPaginationCurrent.value = 1
  await onGetCommissions()
}

onMounted(async () => {
  if (dashboardTab.value === 1) {
    await onGetCommissions()
  }
})

watch(() => dashboardTab.value, async () => {
  if (dashboardTab.value === 1) {
    await onGetCommissions()
  }
  openProjectSearch.value = false
  clearProjectSearch()
  openCommissionSearch.value = false
  clearCommissionSearch()
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
            <CommissionSearchForm
              :fields="{
                commissionDate: true,
                submissionDate: true,
                editionDate: true,
                funds: true
              }"
              @clear="clearCommissionSearch"
              @search="onResetCommissionsPage"
            />
            <div>
              <QToggle
                v-model="showClosedCommissions"
                :label="t('commission.show-not-already-opened')"
                color="commission"
                @update:model-value="onResetCommissionsPage"
              />
            </div>
            <ProjectCommissionListCard
              v-for="commission in commissionStore.commissions?.results"
              :key="`commission-${commission.id}`"
              :commission="commission"
              :heading-level="2"
            />
            <div class="flex-row-center">
              <QPagination
                v-if="commissionStore.commissions?.count > 10"
                v-model="commissionPaginationCurrent"
                :max="commissionStore.commissions?.totalPages"
                color="commission"
                @update:model-value="onGetCommissions"
              />
            </div>

            <div class="flex-row-center">
              <QBtn
                :label="t('commission.archived')"
                :to="{name: 'ArchivedCommissions'}"
                class="btn-lg"
                color="commission"
                icon="bi-archive"
              />
            </div>
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
