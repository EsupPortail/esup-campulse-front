import {ref} from 'vue'
import type {ProjectCommissionFund} from '#/project'
import useCommissions from '@/composables/useCommissionFund'
import {useAxios} from '@/composables/useAxios'
import {useProfileStore} from '@/stores/useProfileStore'

interface ProjectCommissionFundLabel {
  value: number,
  label: string
}

const projectCommissionFundLabels = ref<ProjectCommissionFundLabel[]>([])

const dashboardTab = ref<number>(0)

export default function () {

  const {getFunds, getCommissionFunds, funds, commissionFunds} = useCommissions()
  const {axiosAuthenticated} = useAxios()
  const userStore = useProfileStore()

  const initProjectCommissionFundLabels = async (projectCommissionFunds: ProjectCommissionFund[], action: 'validate' | 'reject') => {
    projectCommissionFundLabels.value = []
    await getFunds()
    await getCommissionFunds()
    projectCommissionFunds.forEach(projectCommissionFund => {
      const fund = commissionFunds.value.find(obj => obj.id === projectCommissionFund.commissionFund)?.fund
      const isMemberOfFund = userStore.userFunds?.includes(fund)
      if (!isMemberOfFund) return
      const isValidatedByAdmin = projectCommissionFund.isValidatedByAdmin
      if (isValidatedByAdmin === null ||
        isValidatedByAdmin && action !== 'validate' ||
        !isValidatedByAdmin && action !== 'reject') {
        projectCommissionFundLabels.value.push({
          value: projectCommissionFund.commissionFund as number,
          label: funds.value.find(obj => obj.id === fund)?.acronym as string,
        })
      }
    })
  }

  async function validateProjectCommissionFund(project: number, commissionFund: number) {
    const url = `/projects/${project}/commission_funds/${commissionFund}`
    await axiosAuthenticated.patch(url, {
      commissionFundId: commissionFund,
      projectId: project,
      isValidatedByAdmin: true
    })
  }

  async function rejectProjectCommissionFund(project: number, commissionFund: number) {
    const url = `/projects/${project}/commission_funds/${commissionFund}`
    await axiosAuthenticated.patch(url, {
      commissionFundId: commissionFund,
      projectId: project,
      isValidatedByAdmin: false
    })
  }

  const canManageProjectCommissionFund = (commissionFund: number): boolean => {
    const fund = commissionFunds.value.find(obj => obj.id === commissionFund)?.fund
    const fundInstitution = funds.value.find(obj => obj.id === fund)?.institution
    const isMemberOfFundInstitution = userStore.user?.groups
      .find(obj => obj.institutionId === fundInstitution)
    return !!isMemberOfFundInstitution
  }

  async function patchAmountAsked(project: number, commissionFund: number, amountEarned: number) {
    const url = `/projects/${project}/commission_funds/${commissionFund}`
    await axiosAuthenticated.patch(url, {
      projectId: project,
      commissionFundId: commissionFund,
      amountEarned
    })
  }


  return {
    projectCommissionFundLabels,
    initProjectCommissionFundLabels,
    validateProjectCommissionFund,
    rejectProjectCommissionFund,
    canManageProjectCommissionFund,
    patchAmountAsked,
    dashboardTab
  }
}
