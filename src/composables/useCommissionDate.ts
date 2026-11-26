import {computed, ref} from 'vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import type {CreateCommission, ManagedCommission, UpdateCommission} from '#/commission'
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
    name: '',
    scheduledTime: '',
    building: '',
    room: '',
    address: ''
  }
}

// État partagé entre la vue et les composants CommissionDate.
const updateCommissions = ref<UpdateCommission[]>([])
const newCommission = ref<CreateCommission>(createEmptyCommission())

export default function useCommissionDate() {
  const {t} = useI18n()
  const {loading, notify} = useQuasar()
  const commissionStore = useCommissionStore()
  const fundStore = useFundStore()
  const {postCommission, updateCommission} = useCommissionFund()
  const {catchHTTPError} = useErrors()
  const {arraysAreEqual, fromDateIsAnterior} = useUtil()

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

  function findOriginalCommission(commissionId: number): ManagedCommission | undefined {
    return commissionStore.managedCommissions?.results.find(commission => commission.id === commissionId)
  }

  function toUpdateCommission(commission: ManagedCommission): UpdateCommission {
    return {
      id: commission.id,
      name: commission.name,
      commissionDate: commission.commissionDate,
      submissionDate: commission.submissionDate,
      isOpenToProjects: commission.isOpenToProjects,
      scheduledTime: commission.scheduledTime,
      building: commission.building,
      room: commission.room,
      address: commission.address,
      funds: commission.funds.map(fund => fund.pk),
      datesAreLegal: fromDateIsAnterior(commission.submissionDate, commission.commissionDate, true),
      open: false
    }
  }

  async function loadCommissions(): Promise<void> {
    await fundStore.getFunds()
    await commissionStore.getManagedCommissions()
    await commissionStore.getCommissionFunds()
    updateCommissions.value = (commissionStore.managedCommissions?.results ?? []).map(toUpdateCommission)
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
    const original = findOriginalCommission(commission.id)
    if (!original) return false

    return commission.name !== original.name
      || commission.commissionDate !== original.commissionDate
      || commission.submissionDate !== original.submissionDate
      || commission.isOpenToProjects !== original.isOpenToProjects
      || commission.scheduledTime !== original.scheduledTime
      || commission.building !== original.building
      || commission.room !== original.room
      || commission.address !== original.address
      || !arraysAreEqual(commission.funds, original.funds.map(fund => fund.pk))
  }

  function canUpdateCommission(commission: UpdateCommission): boolean {
    return commission.datesAreLegal && commission.funds.length > 0 && hasCommissionChanges(commission)
  }

  function checkCommissionDates(commission: UpdateCommission): void {
    commission.datesAreLegal = fromDateIsAnterior(
      commission.submissionDate,
      commission.commissionDate,
      true
    )
  }

  async function loadCommissionDates(): Promise<boolean> {
    return withLoading(loadCommissions)
  }

  async function onUpdateCommission(commission: UpdateCommission): Promise<void> {
    const original = findOriginalCommission(commission.id)
    if (!original || !hasCommissionChanges(commission)) return

    await withLoading(async () => {
      await updateCommission(commission, original)
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
    newCommissionDatesAreLegal,
    canSubmitNewCommission,
    canUpdateCommission,
    checkCommissionDates,
    loadCommissionDates,
    onUpdateCommission,
    onDeleteCommission,
    onAddCommission
  }
}
