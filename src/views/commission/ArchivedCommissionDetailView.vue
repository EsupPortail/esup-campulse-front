<script lang="ts" setup>
import {useRoute} from 'vue-router'
import TableManagedProjects from '@/components/project/TableManagedProjects.vue'
import {onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import axios from 'axios'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import useCommissions from '@/composables/useCommissions'
import useUtility from '@/composables/useUtility'
import FormProjectSearch from '@/components/form/FormProjectSearch.vue'
import {useProjectStore} from '@/stores/useProjectStore'
// import CommissionExport from '@/components/commissions/CommissionExport.vue'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const {getCommission, commission} = useCommissions()
const {dynamicTitle} = useUtility()
const route = useRoute()
const projectStore = useProjectStore()

const commissionId = ref<number>(parseInt(route.params.id as string))
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
                message: catchHTTPError(error.response)
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
        await projectStore.getProjectCommissionFunds(true, commissionId.value)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
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
                    <FormProjectSearch @on-clear-search="onClearSearch" />
                </div>
                <TableManagedProjects
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
