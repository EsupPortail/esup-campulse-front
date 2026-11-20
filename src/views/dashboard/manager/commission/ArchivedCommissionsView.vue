<script lang="ts" setup>
import CommissionSearchForm from '@/components/commission/CommissionSearchForm.vue'
import ProjectCommissionListCard from '@/components/commission/ProjectCommissionListCard.vue'
import {useQuasar} from 'quasar'
import {useCommissionStore} from '@/stores/useCommissionStore'
import type {CommissionFilters} from '#/commission'
import {onMounted, onUnmounted} from 'vue'
import {useI18n} from 'vue-i18n'
import useCommissionFund from '@/composables/useCommissionFund'
import useUtil from '@/composables/useUtil'
import {useRoute} from 'vue-router'


const {loading} = useQuasar()
const {t} = useI18n()
const route = useRoute()
const commissionStore = useCommissionStore()
const {
  openCommissionSearch,
  searchCommissionFilters,
  clearCommissionSearch,
  commissionPaginationCurrent
} = useCommissionFund()
const {dynamicTitle} = useUtil()

function cleanDate(date: string | null): string | null {
  if (!date) return null
  return date.replace(/\//g, '-')
}

async function onGetCommissions() {
  loading.show()
  dynamicTitle.value = route.meta.title as string
  const search = searchCommissionFilters.value
  const filters: Partial<CommissionFilters> = {
    onlyWithActiveProjects: false,
    funds: search.funds,
    commissionDateAfter: cleanDate(search.commissionDate.from),
    commissionDateBefore: cleanDate(search.commissionDate.to),
    editionDateAfter: cleanDate(search.editionDate.from),
    editionDateBefore: cleanDate(search.editionDate.to),
    submissionDateAfter: cleanDate(search.submissionDate.from),
    submissionDateBefore: cleanDate(search.submissionDate.to),
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

onMounted(onGetCommissions)

onUnmounted(() => {
  openCommissionSearch.value = false
  commissionPaginationCurrent.value = 1
  clearCommissionSearch()
})
</script>

<template>
  <div class="container-lg">
    <section class="flex-column">
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
      <ProjectCommissionListCard
        v-for="commission in commissionStore.commissions?.results"
        :key="`commission-${commission.id}`"
        :archived="true"
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
      <p v-if="!commissionStore.commissions?.results.length">{{ t('commission.no-archived-commission') }}</p>
      <div class="flex-row-center">
        <QBtn
          :label="t('commission.on-going')"
          :to="{name: 'ManageProjects'}"
          class="btn-lg"
          color="commission"
          icon="bi-arrow-left"
        />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';

.section {
  background-color: #f5f5f5;
}

p {
  padding: 1rem;
}

.container-lg {
  padding: 3rem 1rem;
}
</style>
