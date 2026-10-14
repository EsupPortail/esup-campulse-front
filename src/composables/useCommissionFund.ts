import type {SelectLabelFund} from '#/commission'
import {useCommissionStore} from '@/stores/useCommissionStore'
import {useFundStore} from '@/stores/useFundStore'
import {useProjectStore} from '@/stores/useProjectStore'


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
    commissionFundLabel
  }
}
