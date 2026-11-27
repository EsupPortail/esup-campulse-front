import {beforeEach, describe, expect, it, vi} from 'vitest'
import type {CreateCommission} from '#/commission'
import {createCommission, editionDateIsValid, hasCommissionInfos} from '@/composables/useCommissionDate'
import * as commissionService from '@/services/CommissionService'
import {_commissions} from '~/fixtures/commission.mock'

vi.mock('@/services/CommissionService', () => ({
  createCommission: vi.fn()
}))

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
