import {computed, ref} from 'vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import type {CommissionFilters, CreateCommission, ManagedCommission, UpdateCommission} from '#/commission'
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
    editionDate: '',
    funds: [],
    isOpenToProjects: false,
    name: '',
    scheduledTime: '',
    building: '',
    room: '',
    address: ''
  }
}

function editionDateIsValid(submissionDate: string, editionDate: string, commissionDate: string): boolean {
  return !!submissionDate && !!editionDate && !!commissionDate
    && editionDate > submissionDate
    && editionDate <= commissionDate
}

// État partagé entre la vue et les composants CommissionDate.
const updateCommissions = ref<UpdateCommission[]>([])
const newCommission = ref<CreateCommission>(createEmptyCommission())

export default function useCommissionDate() {
  const {t} = useI18n()
  const {loading, notify} = useQuasar()
  const commissionStore = useCommissionStore()
  const fundStore = useFundStore()
  const {
    createCommission,
    updateCommission,
    searchCommissionFilters,
    commissionPaginationCurrent
  } = useCommissionFund()
  const {catchHTTPError} = useErrors()
  const {arraysAreEqual, fromDateIsAnterior} = useUtil()

  const newCommissionDatesAreLegal = computed(() => fromDateIsAnterior(
    newCommission.value.submissionDate,
    newCommission.value.commissionDate,
    false
  ))
  const newCommissionEditionDateIsLegal = computed(() => editionDateIsValid(
    newCommission.value.submissionDate,
    newCommission.value.editionDate,
    newCommission.value.commissionDate
  ))
  const canSubmitNewCommission = computed<boolean>(() => !!newCommission.value.name
    && !!newCommission.value.submissionDate
    && !!newCommission.value.commissionDate
    && !!newCommission.value.editionDate
    && newCommissionDatesAreLegal.value
    && newCommissionEditionDateIsLegal.value
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
      editionDate: commission.editionDate,
      isOpenToProjects: commission.isOpenToProjects,
      scheduledTime: commission.scheduledTime,
      building: commission.building,
      room: commission.room,
      address: commission.address,
      funds: commission.funds.map(fund => fund.pk),
      datesAreLegal: fromDateIsAnterior(commission.submissionDate, commission.commissionDate, true),
      editionDateIsLegal: editionDateIsValid(
        commission.submissionDate,
        commission.editionDate,
        commission.commissionDate
      ),
      open: false
    }
  }

  function cleanDate(date: string | null): string | null {
    if (!date) return null
    return date.replace(/\//g, '-')
  }

  function commissionsFilters(): Partial<CommissionFilters> {
    const search = searchCommissionFilters.value
    return {
      isArchived: false,
      funds: search.funds,
      commissionDateAfter: cleanDate(search.commissionDate.from),
      commissionDateBefore: cleanDate(search.commissionDate.to),
      editionDateAfter: cleanDate(search.editionDate.from),
      editionDateBefore: cleanDate(search.editionDate.to),
      submissionDateAfter: cleanDate(search.submissionDate.from),
      submissionDateBefore: cleanDate(search.submissionDate.to),
      name: search.name,
      page: commissionPaginationCurrent.value,
      pageSize: 10
    }
  }

  async function loadCommissions(): Promise<void> {
    await fundStore.getFunds()
    await commissionStore.getManagedCommissions(commissionsFilters())
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
      || commission.editionDate !== original.editionDate
      || commission.isOpenToProjects !== original.isOpenToProjects
      || commission.scheduledTime !== original.scheduledTime
      || commission.building !== original.building
      || commission.room !== original.room
      || commission.address !== original.address
      || !arraysAreEqual(commission.funds, original.funds.map(fund => fund.pk))
  }

  function canUpdateCommission(commission: UpdateCommission): boolean {
    return commission.datesAreLegal
      && commission.editionDateIsLegal
      && commission.funds.length > 0
      && hasCommissionChanges(commission)
  }

  function checkCommissionDates(commission: UpdateCommission): void {
    commission.datesAreLegal = fromDateIsAnterior(
      commission.submissionDate,
      commission.commissionDate,
      true
    )
    commission.editionDateIsLegal = editionDateIsValid(
      commission.submissionDate,
      commission.editionDate,
      commission.commissionDate
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
      await createCommission(newCommission.value)
      newCommission.value = createEmptyCommission()
      await loadCommissions()
    }, () => t('notifications.positive.new-commission-date'))
  }

  return {
    updateCommissions,
    newCommission,
    newCommissionDatesAreLegal,
    newCommissionEditionDateIsLegal,
    canSubmitNewCommission,
    canUpdateCommission,
    checkCommissionDates,
    loadCommissionDates,
    onUpdateCommission,
    onDeleteCommission,
    onAddCommission
  }
}
