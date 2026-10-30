<script lang="ts" setup>
import {useRoute} from 'vue-router'
import ProjectListTable from '@/components/project/projectList/ProjectListTable.vue'
import {onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import axios from 'axios'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useError'
import useCommissions from '@/composables/useCommissionFund'
import FormProjectSearch from '@/components/project/FormProjectSearch.vue'
import {useProjectStore} from '@/stores/useProjectStore'
// import CommissionExport from '@/components/commissions/CommissionExport.vue'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const {getCommission, commission} = useCommissions()
const {dynamicTitle} = useUtil()
const route = useRoute()
const projectStore = useProjectStore()

const commissionId = ref<number>(Number.parseInt(route.params.id as string))
const commissionName = ref<string>('')

onMounted(async () => {
  loading.show()
  await onGetCommission()
  loading.hide()
})

async function onGetCommission() {
  try {
    await getCommission(commissionId.value)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      notify({
        type: 'negative',
        message: await catchHTTPError(error.response)
      })
    }
  }
}

const initCommissionName = () => {
  dynamicTitle.value = commission.value?.name
  commissionName.value = commission.value?.name ?? ''
}
watch(() => commission.value, initCommissionName)


async function onClearSearch() {
  loading.show()
  try {
    // Reset projects
    await projectStore.getManagedProjects(commissionId.value)
    await projectStore.getProjectCommissionFunds({filter: 'commission', commissionId: commissionId.value})
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

</script>


<template>
  <section class="dashboard-section">
    <div class="dashboard-section-container">
      <div class="container-lg flex-column">
        <div class="container padding-top padding-bottom">
          <FormProjectSearch @on-clear-search="onClearSearch"/>
        </div>
        <ProjectListTable
          :commission-id="commissionId"
          :commission-name="commissionName"
          :flat="false"
          :title="t('project.archived-projects')"
          project-status="all"
        />
        <!--
<CommissionExport
:commission-id="commissionId"
:commission-name="commissionName"
/>
-->
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';

.form {
  width: 80% !important;
}
</style>
