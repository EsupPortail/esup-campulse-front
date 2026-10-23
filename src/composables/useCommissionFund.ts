import type {
  Commission,
  CommissionBase,
  CreateCommission,
  PostCommission,
  SelectLabelFund,
  UpdateCommission
} from '#/commission'
import {useCommissionStore} from '@/stores/useCommissionStore'
import {useFundStore} from '@/stores/useFundStore'
import {useProjectStore} from '@/stores/useProjectStore'
import * as commissionService from '@/services/CommissionService'
import useUtil from '@/composables/useUtil'

async function postCommission(commission: CreateCommission) {
  const data: PostCommission = {
    commissionDate: commission.commissionDate,
    submissionDate: commission.submissionDate,
    isOpenToProjects: commission.isOpenToProjects,
    name: commission.name
  }
  const newCommission: Commission = await commissionService.postCommission(data)
  const promises = commission.funds.map((fund) =>
    commissionService.postCommissionFund({
      commission: newCommission.id,
      fund
    })
  )
  await Promise.all(promises)
}

async function updateCommission(commission: UpdateCommission) {
  const commissionId = commission.id
  let dataToPatch: Partial<CommissionBase> = {}

  if (commission.newName !== commission.oldName)
    dataToPatch = Object.assign(dataToPatch, {name: commission.newName})
  if (commission.newCommissionDate !== commission.oldCommissionDate)
    dataToPatch = Object.assign(dataToPatch, {commissionDate: commission.newCommissionDate})
  if (commission.newSubmissionDate !== commission.oldSubmissionDate)
    dataToPatch = Object.assign(dataToPatch, {submissionDate: commission.newSubmissionDate})
  if (commission.newIsOpenToProjects !== commission.oldIsOpenToProjects)
    dataToPatch = Object.assign(dataToPatch, {isOpenToProjects: commission.newIsOpenToProjects})
  if (Object.entries(dataToPatch).length) {
    await commissionService.patchCommission(commissionId, dataToPatch)
  }

  const {arraysAreEqual} = useUtil()
  if (arraysAreEqual(commission.oldFunds, commission.newFunds)) return

  const newFundsToPost = commission.newFunds.filter(x => commission.oldFunds.indexOf(x) === -1)
  const oldFundsToDelete = commission.oldFunds.filter(x => commission.newFunds.indexOf(x) === -1)

  await Promise.all(newFundsToPost.map((fund) =>
    commissionService.postCommissionFund({
      commission: commissionId,
      fund
    })
  ))
  await Promise.all(oldFundsToDelete.map((fund) =>
    commissionService.deleteCommissionFund(commissionId, fund)
  ))
}

export default function useCommissionFund() {

  const commissionStore = useCommissionStore()
  const fundStore = useFundStore()
  const projectStore = useProjectStore()

  const selectedCommissionFundLabels = (commissionId: number, isSite: boolean): SelectLabelFund[] => {
    return commissionStore.commissionFunds.reduce((labels, commissionFund) => {
      if (commissionFund.commission === commissionId) {
        const fund = fundStore.funds.find(obj => obj.id === commissionFund.fund)

        if (isSite || !fund?.isSite) {
          labels.push({
            value: commissionFund.id,
            label: fund?.acronym,
            fund: fund?.id
          })
        }
      }
      return labels
    }, [])
  }

  const commissionFundLabels = (): SelectLabelFund[] => {
    return projectStore.projectCommissionFunds.map(projectCommissionFund => {
      const commissionFund = commissionStore.commissionFunds.find(commissionFund => commissionFund.id === projectCommissionFund.commissionFund)
      const fund = fundStore.funds.find(fund => fund.id === commissionFund.fund)
      return {
        value: projectCommissionFund.commissionFund,
        label: fund?.acronym,
        fund: fund?.id
      }
    })
  }

  const commissionFundLabel = (commissionFund: number) => {
    return fundStore.funds
      .find(fund => fund.id === (commissionStore.commissionFunds
        .find(fund => fund.id === commissionFund)?.fund))?.acronym
  }

  return {
    selectedCommissionFundLabels,
    commissionFundLabels,
    commissionFundLabel,
    postCommission,
    updateCommission
  }
}
