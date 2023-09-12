import {createTestingPinia} from '@pinia/testing'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {config} from '@vue/test-utils'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {createPinia, setActivePinia} from 'pinia'
import {useAxios} from '@/composables/useAxios'
import {useUserStore} from '@/stores/useUserStore'
import useManageProjects from '@/composables/useManageProjects'
import {_projectCommissionFunds} from '~/fixtures/project.mock'
import useCommissions from '@/composables/useCommissions'
import {_commissionFunds, _funds} from '~/fixtures/commissions.mock'
import {_generalManager, _institutionStudent} from '~/fixtures/user.mock'

vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))

setActivePinia(createPinia())

let userStore = useUserStore()

config.global.plugins = [
    createTestingPinia({
        createSpy: vi.fn()
    })
]

describe('useManageProjects', () => {
    beforeEach(() => {
        userStore = useUserStore()
        funds.value = _funds
        commissionFunds.value = _commissionFunds
    })
    afterEach(() => {
        vi.restoreAllMocks()
        projectCommissionFundLabels.value = []
    })

    const {
        initProjectCommissionFundLabels,
        projectCommissionFundLabels,
        validateProjectCommissionFund,
        rejectProjectCommissionFund,
        canManageProjectCommissionFund,
        patchAmountAsked
    } = useManageProjects()
    const {funds, commissionFunds} = useCommissions()
    const {axiosAuthenticated} = useAxios()

    describe('initProjectCommissionFundLabels', () => {
        const projectCommissionFund = _projectCommissionFunds[0]
        afterEach(() => {
            projectCommissionFund.isValidatedByAdmin = false
        })
        describe('if the project commission fund is not validated by admin yet', () => {
            describe('if the manager validates the funding', () => {
                it('should init the corresponding label', async () => {
                    await initProjectCommissionFundLabels([projectCommissionFund], 'validate')
                    expect(projectCommissionFundLabels.value).toEqual([{
                        label: funds.value
                            .find(obj => obj.id === (commissionFunds.value
                                .find(obj => obj.id === projectCommissionFund.commissionFund)?.fund))?.acronym,
                        value: projectCommissionFund.commissionFund
                    }])
                })
            })
            describe('if the manager refuses the funding', () => {
                it('should init nothing', async () => {
                    await initProjectCommissionFundLabels([projectCommissionFund], 'reject')
                    expect(projectCommissionFundLabels.value).toEqual([])
                })
            })
        })
        describe('if the project commission fund is validated by admin', () => {
            beforeEach(() => {
                projectCommissionFund.isValidatedByAdmin = true
            })
            describe('if the manager validates the funding', () => {
                it('should init nothing', async () => {
                    await initProjectCommissionFundLabels([projectCommissionFund], 'validate')
                    expect(projectCommissionFundLabels.value).toEqual([])
                })
            })
            describe('if the manager refuses the funding', () => {
                it('should init the corresponding label', async () => {
                    await initProjectCommissionFundLabels([projectCommissionFund], 'reject')
                    expect(projectCommissionFundLabels.value).toEqual([{
                        label: funds.value
                            .find(obj => obj.id === (commissionFunds.value
                                .find(obj => obj.id === projectCommissionFund.commissionFund)?.fund))?.acronym,
                        value: projectCommissionFund.commissionFund
                    }])
                })
            })
        })
    })

    describe('validateProjectCommissionFunds', () => {
        it('should patch a project commission fund with passed arguments', async () => {
            await validateProjectCommissionFund(1, 2)
            const url = '/projects/1/commission_funds/2'
            const data = {
                commissionFundId: 2,
                projectId: 1,
                isValidatedByAdmin: true
            }
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith(url, data)
        })
    })

    describe('rejectProjectCommissionFunds', () => {
        it('should patch a project commission fund with passed arguments', async () => {
            await rejectProjectCommissionFund(1, 2)
            const url = '/projects/1/commission_funds/2'
            const data = {
                commissionFundId: 2,
                projectId: 1,
                isValidatedByAdmin: false
            }
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith(url, data)
        })
    })

    describe('canManageProjectCommissionFund', () => {
        afterEach(() => {
            userStore.user = undefined
        })
        describe('if the authenticated user is a corresponding fund member', () => {
            it('should return true', () => {
                userStore.user = _generalManager
                expect(canManageProjectCommissionFund(1)).toBeTruthy()
            })
        })
        describe('if the authenticated user is not a corresponding fund member', () => {
            it('should return false', () => {
                userStore.user = _institutionStudent
                expect(canManageProjectCommissionFund(1)).toBeFalsy()
            })
        })
    })

    describe('patchAmountAsked', () => {
        it('should patch a project commission fund with passed arguments', async () => {
            await patchAmountAsked(1, 2, 100)
            const url = '/projects/1/commission_funds/2'
            const data = {
                commissionFundId: 2,
                projectId: 1,
                amountEarned: 100
            }
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith(url, data)
        })
    })
})
