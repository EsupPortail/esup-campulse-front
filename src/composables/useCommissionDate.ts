import {computed, ref} from 'vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import type {Commission, CreateCommission, UpdateCommission} from '#/commission'
import useCommissionFund from '@/composables/useCommissionFund'
import useErrors from '@/composables/useError'
import useUtil from '@/composables/useUtil'
import * as commissionService from '@/services/CommissionService'
import {useCommissionStore} from '@/stores/useCommissionStore'
import {useFundStore} from '@/stores/useFundStore'

function createEmptyCommission(): CreateCommission {
  return {
    commissionDate: '',
    submissionDate: '',
    funds: [],
    isOpenToProjects: false,
    name: ''
  }
}

export default function useCommissionDate() {
  const {t} = useI18n()
  const {loading, notify} = useQuasar()
  const commissionStore = useCommissionStore()
  const fundStore = useFundStore()
  const {postCommission, updateCommission} = useCommissionFund()
  const {catchHTTPError} = useErrors()
  const {arraysAreEqual, fromDateIsAnterior} = useUtil()

  const updateCommissions = ref<UpdateCommission[]>([])
  const newCommission = ref<CreateCommission>(createEmptyCommission())

  const fundsLabels = computed(() => fundStore.fundLabels)
  const newCommissionDatesAreLegal = computed(() => fromDateIsAnterior(
    newCommission.value.submissionDate,
    newCommission.value.commissionDate,
    false
  ))
  const canSubmitNewCommission = computed<boolean>(() => !!newCommission.value.name
    && !!newCommission.value.submissionDate
    && !!newCommission.value.commissionDate
    && newCommissionDatesAreLegal.value
    && newCommission.value.funds.length > 0)

  function toUpdateCommission(commission: Commission): UpdateCommission {
    const funds = commissionStore.commissionFunds
      .filter(commissionFund => commissionFund.commission === commission.id)
      .map(commissionFund => commissionFund.fund)

    return {
      id: commission.id,
      oldName: commission.name,
      newName: commission.name,
      oldCommissionDate: commission.commissionDate,
      newCommissionDate: commission.commissionDate,
      oldSubmissionDate: commission.submissionDate,
      newSubmissionDate: commission.submissionDate,
      datesAreLegal: fromDateIsAnterior(commission.submissionDate, commission.commissionDate, true),
      oldFunds: funds,
      newFunds: [...funds],
      oldIsOpenToProjects: commission.isOpenToProjects,
      newIsOpenToProjects: commission.isOpenToProjects,
      open: false
    }
  }

  async function loadCommissions(): Promise<void> {
    await fundStore.getFunds()
    await commissionStore.getManagedCommissions()
    await commissionStore.getCommissionFunds()
    updateCommissions.value = (commissionStore.commissions?.results ?? []).map(toUpdateCommission)
  }

  async function withLoading(action: () => Promise<void>, successMessage?: () => string): Promise<boolean> {
    loading.show()
    try {
      await action()
      if (successMessage) {
        notify({
          type: 'positive',
          message: successMessage()
        })
      }
      return true
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        notify({
          type: 'negative',
          message: await catchHTTPError(error.response)
        })
      }
      return false
    } finally {
      loading.hide()
    }
  }

  function hasCommissionChanges(commission: UpdateCommission): boolean {
    return commission.newName !== commission.oldName
      || commission.newCommissionDate !== commission.oldCommissionDate
      || commission.newSubmissionDate !== commission.oldSubmissionDate
      || commission.newIsOpenToProjects !== commission.oldIsOpenToProjects
      || !arraysAreEqual(commission.newFunds, commission.oldFunds)
  }

  function checkCommissionDates(commission: UpdateCommission): void {
    commission.datesAreLegal = fromDateIsAnterior(
      commission.newSubmissionDate,
      commission.newCommissionDate,
      true
    )
  }

  async function loadCommissionDates(): Promise<boolean> {
    return withLoading(loadCommissions)
  }

  async function onUpdateCommission(commission: UpdateCommission): Promise<void> {
    if (!hasCommissionChanges(commission)) return
    await withLoading(async () => {
      await updateCommission(commission)
      await loadCommissions()
    }, () => t('notifications.positive.commission-date-modified'))
  }

  async function onDeleteCommission(commissionId: number): Promise<void> {
    await withLoading(async () => {
      await commissionService.deleteCommission(commissionId)
      await loadCommissions()
    }, () => t('notifications.positive.commission-date-deleted'))
  }

  async function onAddCommission(): Promise<boolean> {
    return withLoading(async () => {
      await postCommission(newCommission.value)
      newCommission.value = createEmptyCommission()
      await loadCommissions()
    }, () => t('notifications.positive.new-commission-date'))
  }

  return {
    updateCommissions,
    newCommission,
    fundsLabels,
    newCommissionDatesAreLegal,
    canSubmitNewCommission,
    checkCommissionDates,
    loadCommissionDates,
    onUpdateCommission,
    onDeleteCommission,
    onAddCommission
  }
}
