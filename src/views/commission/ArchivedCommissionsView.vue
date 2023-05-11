<script lang="ts" setup>
import {onMounted} from 'vue'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useErrors from '@/composables/useErrors'
import axios from 'axios'
import {useProjectStore} from '@/stores/useProjectStore'
import useCommissions from '@/composables/useCommissions'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import DashboardProjectCommissionsManagement from '@/components/dashboard/DashboardProjectCommissionsManagement.vue'


const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const projectStore = useProjectStore()
const {
    getCommissionDates,
    initCommissionDatesLabels,
    commissionDates,
    getCommissions
} = useCommissions()
const associationStore = useAssociationStore()
const userManagerStore = useUserManagerStore()

onMounted(async () => {
    loading.show()
    await onGetCommissionDates()
    await onGetProjects(commissionDates.value.map(commissionDate => commissionDate.id))
    await onGetApplicants()
    loading.hide()
})

const onChangeCommissionDate = async (commission: number) => {
    loading.show()
    if (commission) {
        await onGetProjects([commission])
    } else {
        await onGetProjects(commissionDates.value.map(commissionDate => commissionDate.id))
    }
    loading.hide()
}

async function onGetCommissionDates() {
    try {
        await getCommissions()
        await getCommissionDates(false, false, true)
        initCommissionDatesLabels(undefined)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

async function onGetProjects(commissionsDates: number[]) {
    try {
        if (commissionsDates.length) {
            await projectStore.getProjects(undefined, commissionsDates)
        } else {
            projectStore.projects = []
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

async function onGetApplicants() {
    try {
        if (projectStore.projects.length) {
            if (projectStore.projects.find(obj => obj.association !== null)) {
                await associationStore.getAssociationNames(true, false)
            }
            if (projectStore.projects.find(obj => obj.user !== null)) {
                await userManagerStore.getUsers('validated')
            }
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

</script>

<template>
    <section class="dashboard-section">
        <div class="form-container">
            <div class="form">
                <DashboardProjectCommissionsManagement
                    :projects="projectStore.projects"
                    @change-commission-date="onChangeCommissionDate"
                />
            </div>
        </div>
    </section>
</template>

<style lang="scss">
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';
</style>
