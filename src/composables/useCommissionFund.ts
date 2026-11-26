import type {SelectLabelFund} from '#/commission'
import {useCommissionStore} from '@/stores/useCommissionStore'
import {useFundStore} from '@/stores/useFundStore'
import {useProjectStore} from '@/stores/useProjectStore'
import * as commissionService from '@/services/CommissionService'
import useUtil from '@/composables/useUtil'

async function createCommissionFunds(commissionId: number, funds: number[]): Promise<void> {
  await Promise.all(funds.map((fund) =>
    commissionService.postCommissionFund({
      commission: commissionId,
      fund
    })
  ))
}

async function syncCommissionFunds(commissionId: number, funds: number[], originalFunds: number[]): Promise<void> {
  const {arraysAreEqual} = useUtil()
  if (arraysAreEqual(originalFunds, funds)) return

  const newFundsToPost = funds.filter(fund => !originalFunds.includes(fund))
  const oldFundsToDelete = originalFunds.filter(fund => !funds.includes(fund))

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
    createCommissionFunds,
    syncCommissionFunds
  }
}
