import type {
  Commission,
  CommissionBase,
  CreateCommission,
  ManagedCommission,
  PostCommission,
  SearchCommissionFilters,
  SelectLabelFund,
  UpdateCommission
} from '#/commission'
import {useCommissionStore} from '@/stores/useCommissionStore'
import {useFundStore} from '@/stores/useFundStore'
import {useProjectStore} from '@/stores/useProjectStore'
import * as commissionService from '@/services/CommissionService'
import useUtil from '@/composables/useUtil'
import {ref} from 'vue'

const openCommissionSearch = ref<boolean>(false)

const commissionPaginationCurrent = ref<number>(1)

const searchCommissionFilters = ref<SearchCommissionFilters>({
  name: '',
  commissionDate: {from: null, to: null},
  submissionDate: {from: null, to: null},
  editionDate: {from: null, to: null},
  funds: []
})

async function postCommission(commission: CreateCommission) {
  const data: PostCommission = {
    commissionDate: commission.commissionDate,
    submissionDate: commission.submissionDate,
    isOpenToProjects: commission.isOpenToProjects,
    name: commission.name,
    scheduledTime: commission.scheduledTime,
    building: commission.building,
    room: commission.room,
    address: commission.address
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

async function updateCommission(commission: UpdateCommission, original: ManagedCommission) {
  const commissionId = commission.id
  let dataToPatch: Partial<CommissionBase> = {}

  if (commission.name !== original.name)
    dataToPatch = Object.assign(dataToPatch, {name: commission.name})
  if (commission.commissionDate !== original.commissionDate)
    dataToPatch = Object.assign(dataToPatch, {commissionDate: commission.commissionDate})
  if (commission.submissionDate !== original.submissionDate)
    dataToPatch = Object.assign(dataToPatch, {submissionDate: commission.submissionDate})
  if (commission.isOpenToProjects !== original.isOpenToProjects)
    dataToPatch = Object.assign(dataToPatch, {isOpenToProjects: commission.isOpenToProjects})
  if (commission.scheduledTime !== original.scheduledTime)
    dataToPatch = Object.assign(dataToPatch, {scheduledTime: commission.scheduledTime})
  if (commission.building !== original.building)
    dataToPatch = Object.assign(dataToPatch, {building: commission.building})
  if (commission.room !== original.room)
    dataToPatch = Object.assign(dataToPatch, {room: commission.room})
  if (commission.address !== original.address)
    dataToPatch = Object.assign(dataToPatch, {address: commission.address})
  if (Object.entries(dataToPatch).length) {
    await commissionService.patchCommission(commissionId, dataToPatch)
  }

  const {arraysAreEqual} = useUtil()
  const originalFunds = original.funds.map(fund => fund.pk)
  if (arraysAreEqual(originalFunds, commission.funds)) return

  const newFundsToPost = commission.funds.filter(fund => !originalFunds.includes(fund))
  const oldFundsToDelete = originalFunds.filter(fund => !commission.funds.includes(fund))

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

  function clearCommissionSearch() {
    searchCommissionFilters.value.name = ''
    searchCommissionFilters.value.commissionDate = {from: null, to: null}
    searchCommissionFilters.value.submissionDate = {from: null, to: null}
    searchCommissionFilters.value.editionDate = {from: null, to: null}
    searchCommissionFilters.value.funds = []
  }

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
    updateCommission,
    openCommissionSearch,
    searchCommissionFilters,
    clearCommissionSearch,
    commissionPaginationCurrent
  }
}
