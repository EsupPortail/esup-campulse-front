<script lang="ts" setup>
import CommissionListCard from '@/components/commission/CommissionListCard.vue'
import {useQuasar} from 'quasar'
import {useCommissionStore} from '@/stores/useCommissionStore'
import type {CommissionFilters} from '#/commission'
import {onMounted} from 'vue'
import useUtil from '@/composables/useUtil'
import {useRoute} from 'vue-router'


const {loading} = useQuasar()
const route = useRoute()
const commissionStore = useCommissionStore()
const {dynamicTitle} = useUtil()

async function onGetCommissions() {
  loading.show()
  dynamicTitle.value = route.meta.title as string
  const filters: Partial<CommissionFilters> = {
    onlyWithActiveProjects: false,
  }
  await commissionStore.getManagedCommissions(filters)
  loading.hide()
}

onMounted(onGetCommissions)
</script>

<template>
  <div class="container-lg">
    <CommissionListCard
      v-for="commission in commissionStore.commissions?.results"
      :key="`commission-${commission.id}`"
      :archived="true"
      :commission="commission"
      :heading-level="2"
    />
    <p v-if="!commissionStore.commissions?.results.length">Aucune commission archivée.</p>
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
