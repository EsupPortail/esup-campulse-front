import {ref} from 'vue'
import type {ProjectCommissionFund} from '#/project'
import useCommissions from '@/composables/useCommissions'
import {useAxios} from '@/composables/useAxios'

interface ProjectCommissionFundLabel {
    value: number,
    label: string
}

const projectCommissionFundLabels = ref<ProjectCommissionFundLabel[]>([])

export default function () {

    const {getFunds, getCommissionFunds, funds, commissionFunds} = useCommissions()
    const {axiosAuthenticated} = useAxios()

    const initProjectCommissionFundLabels = async (projectCommissionFunds: ProjectCommissionFund[], action: 'validate' | 'reject') => {
        projectCommissionFundLabels.value = []
        await getFunds()
        await getCommissionFunds()
        projectCommissionFunds.forEach(projectCommissionFund => {
            if (projectCommissionFund.isValidatedByAdmin === null ||
                projectCommissionFund.isValidatedByAdmin && action !== 'validate' ||
                !projectCommissionFund.isValidatedByAdmin && action !== 'reject') {
                projectCommissionFundLabels.value.push({
                    value: projectCommissionFund.commissionFund as number,
                    label: funds.value.find(obj => obj.id ===
                        (commissionFunds.value.find(obj => obj.id === projectCommissionFund.commissionFund)?.fund))?.acronym as string,
                })
            }
        })
    }

    async function validateProjectCommissionFund(project: number, commissionFund: number) {
        await axiosAuthenticated.patch(`/projects/${project}/commission_funds/${commissionFund}`, {
            commissionFundId: commissionFund,
            projectId: project,
            isValidatedByAdmin: true
        })
    }

    async function rejectProjectCommissionFund(project: number, commissionFund: number) {
        await axiosAuthenticated.patch(`/projects/${project}/commission_funds/${commissionFund}`, {
            commissionFundId: commissionFund,
            projectId: project,
            isValidatedByAdmin: false
        })
    }


    return {
        projectCommissionFundLabels,
        initProjectCommissionFundLabels,
        validateProjectCommissionFund,
        rejectProjectCommissionFund
    }
}
