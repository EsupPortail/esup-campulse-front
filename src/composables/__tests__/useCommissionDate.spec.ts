import {createPinia, setActivePinia} from 'pinia'
import {computed, nextTick, ref} from 'vue'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import type {CreateCommission, ManagedCommission, UpdateCommission} from '#/commission'
import type {PaginatedList} from '#/global'
import useCommissionDate, {createCommission, editionDateIsValid, hasCommissionInfos} from '@/composables/useCommissionDate'
import * as commissionService from '@/services/CommissionService'
import {useCommissionStore} from '@/stores/useCommissionStore'
import {_commissionFundData, _commissions, _managedCommissions} from '~/fixtures/commission.mock'

vi.mock('vue-i18n', async importOriginal => ({
  ...await importOriginal<typeof import('vue-i18n')>(),
  useI18n: () => ({t: (key: string) => key})
}))
vi.mock('quasar', () => ({
  useQuasar: () => ({loading: {show: vi.fn(), hide: vi.fn()}, notify: vi.fn()})
}))
vi.mock('@/services/CommissionService', () => ({
  createCommission: vi.fn(),
  createCommissionFund: vi.fn(),
  deleteCommissionFund: vi.fn(),
  getCommissions: vi.fn(),
  getManagedCommissions: vi.fn(),
  getCommissionFunds: vi.fn(),
  getFunds: vi.fn(),
  deleteCommission: vi.fn(),
  updateCommission: vi.fn()
}))

setActivePinia(createPinia())

const newCommission: CreateCommission = {
  commissionDate: '2026-02-20',
  submissionDate: '2026-02-01',
  editionDate: '2026-02-10',
  isOpenToProjects: true,
  name: 'Commission de test',
  funds: [1],
  scheduledTime: '',
  building: '',
  room: '',
  address: ''
}

describe('editionDateIsValid', () => {
  it('accepts a date after submission and up to the commission date', () => {
    expect(editionDateIsValid('2026-01-01', '2026-01-02', '2026-01-03')).toBe(true)
    expect(editionDateIsValid('2026-01-01', '2026-01-03', '2026-01-03')).toBe(true)
  })

  it('rejects a date equal to submission, after commission or missing', () => {
    expect(editionDateIsValid('2026-01-01', '2026-01-01', '2026-01-03')).toBe(false)
    expect(editionDateIsValid('2026-01-01', '2026-01-04', '2026-01-03')).toBe(false)
    expect(editionDateIsValid('', '2026-01-02', '2026-01-03')).toBe(false)
    expect(editionDateIsValid('2026-01-01', '', '2026-01-03')).toBe(false)
    expect(editionDateIsValid('2026-01-01', '2026-01-02', '')).toBe(false)
  })
})

describe('hasCommissionInfos', () => {
  const emptyInfos = {scheduledTime: '', building: '', room: '', address: ''}

  it('detects a commission with optional information filled in', () => {
    expect(hasCommissionInfos(emptyInfos)).toBe(false)
    expect(hasCommissionInfos({...emptyInfos, scheduledTime: '13:00'})).toBe(true)
    expect(hasCommissionInfos({...emptyInfos, building: 'Esplanade'})).toBe(true)
    expect(hasCommissionInfos({...emptyInfos, room: 'Salle B'})).toBe(true)
    expect(hasCommissionInfos({...emptyInfos, address: '1 rue René Descartes'})).toBe(true)
  })
})

describe('createCommission', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(commissionService.createCommission).mockResolvedValue(_commissions[1])
  })

  it('omits empty optional information fields from the payload', async () => {
    await createCommission(newCommission)

    expect(commissionService.createCommission).toHaveBeenCalledWith({
      commissionDate: '2026-02-20',
      submissionDate: '2026-02-01',
      editionDate: '2026-02-10',
      isOpenToProjects: true,
      name: 'Commission de test'
    })
  })

  it('sends optional information fields when they are filled', async () => {
    await createCommission({
      ...newCommission,
      scheduledTime: '13:00:00',
      building: 'Esplanade',
      room: 'Salle B',
      address: '1 rue René Descartes'
    })

    expect(commissionService.createCommission).toHaveBeenCalledWith({
      commissionDate: '2026-02-20',
      submissionDate: '2026-02-01',
      editionDate: '2026-02-10',
      isOpenToProjects: true,
      name: 'Commission de test',
      scheduledTime: '13:00',
      building: 'Esplanade',
      room: 'Salle B',
      address: '1 rue René Descartes'
    })
  })
})

describe('canUpdateCommission', () => {
  const original: ManagedCommission = {
    ...structuredClone(_managedCommissions[1]),
    editionDate: '2099-10-09',
    scheduledTime: '09:00:00',
    building: '',
    room: '',
    address: '',
    funds: [_commissionFundData[0], _commissionFundData[1]]
  }
  const editable: UpdateCommission = {
    id: original.id,
    name: original.name,
    commissionDate: original.commissionDate,
    submissionDate: original.submissionDate,
    editionDate: original.editionDate,
    isOpenToProjects: original.isOpenToProjects,
    scheduledTime: '09:00',
    building: '',
    room: '',
    address: '',
    funds: [1, 2],
    datesAreLegal: false,
    editionDateIsLegal: false,
    open: false
  }

  beforeEach(() => {
    const commissions: PaginatedList<ManagedCommission> = {
      count: 1,
      totalPages: 1,
      currentPage: 1,
      range: {start: 1, end: 1},
      next: null,
      previous: null,
      results: [original]
    }
    useCommissionStore().commissions = commissions
  })

  it('allows an update when an optional field changes', () => {
    const {canUpdateCommission} = useCommissionDate()

    expect(canUpdateCommission({...editable, building: 'Esplanade'})).toBe(true)
    expect(canUpdateCommission({...editable, room: 'Salle B'})).toBe(true)
    expect(canUpdateCommission({...editable, address: '1 rue René Descartes'})).toBe(true)
    expect(canUpdateCommission({...editable, scheduledTime: '14:00'})).toBe(true)
  })

  it('detects a change when the API omits the optional fields', () => {
    const commissionStore = useCommissionStore()
    if (!commissionStore.commissions) return
    commissionStore.commissions.results[0] = {
      ...original,
      scheduledTime: undefined as unknown as string,
      building: undefined as unknown as string,
      room: undefined as unknown as string,
      address: undefined as unknown as string
    }
    const {canUpdateCommission} = useCommissionDate()

    expect(canUpdateCommission({...editable, building: 'Esplanade'})).toBe(true)
  })

  it('reacts to an optional field mutation', async () => {
    const {canUpdateCommission} = useCommissionDate()
    const model = ref<UpdateCommission>({...editable})
    const canUpdate = computed(() => canUpdateCommission(model.value))

    expect(canUpdate.value).toBe(false)
    model.value.building = 'Esplanade'
    await nextTick()

    expect(canUpdate.value).toBe(true)
  })
})
