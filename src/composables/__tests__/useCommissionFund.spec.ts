import {createPinia, setActivePinia} from 'pinia'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import useCommissionFund from '@/composables/useCommissionFund'
import * as commissionService from '@/services/CommissionService'

vi.mock('@/services/CommissionService', () => ({
  postCommissionFund: vi.fn(),
  deleteCommissionFund: vi.fn()
}))

setActivePinia(createPinia())

describe('useCommissionFund', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates every fund link for a new commission', async () => {
    const {createCommissionFunds} = useCommissionFund()

    await createCommissionFunds(7, [1, 3])

    expect(commissionService.postCommissionFund).toHaveBeenCalledTimes(2)
    expect(commissionService.postCommissionFund).toHaveBeenNthCalledWith(1, {commission: 7, fund: 1})
    expect(commissionService.postCommissionFund).toHaveBeenNthCalledWith(2, {commission: 7, fund: 3})
  })

  it('only posts added funds and deletes removed funds', async () => {
    const {syncCommissionFunds} = useCommissionFund()

    await syncCommissionFunds(7, [2, 3], [1, 2])

    expect(commissionService.postCommissionFund).toHaveBeenCalledTimes(1)
    expect(commissionService.postCommissionFund).toHaveBeenCalledWith({commission: 7, fund: 3})
    expect(commissionService.deleteCommissionFund).toHaveBeenCalledTimes(1)
    expect(commissionService.deleteCommissionFund).toHaveBeenCalledWith(7, 1)
  })

  it('does nothing when funds are unchanged', async () => {
    const {syncCommissionFunds} = useCommissionFund()

    await syncCommissionFunds(7, [1, 2], [1, 2])

    expect(commissionService.postCommissionFund).not.toHaveBeenCalled()
    expect(commissionService.deleteCommissionFund).not.toHaveBeenCalled()
  })
})
