import {createTestingPinia} from '@pinia/testing'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {config} from '@vue/test-utils'
import {createPinia, setActivePinia} from 'pinia'
import {useUserStore} from '@/stores/useUserStore'
import useCommissions from '@/composables/useCommissions'
import {useAxios} from '@/composables/useAxios'
import {_commissionDates, _commissionFunds} from '~/fixtures/commissions.mock'
import type {SelectCommissionDateLabel} from '#/commissions'
import {_generalManager} from '~/fixtures/user.mock'

vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))

setActivePinia(createPinia())

config.global.plugins = [
    createTestingPinia({
        createSpy: vi.fn()
    })
]

let userStore = useUserStore()

describe('useCommissions', () => {
    beforeEach(() => {
        userStore = useUserStore()
    })

    afterEach(() => {
        vi.restoreAllMocks()
        commissionFunds.value = []
        commissionDates.value = []
        commissionDatesLabels.value = []
    })

    const {
        getCommissionFunds,
        commissionFunds,
        getCommissionDates,
        commissionDates,
        initCommissionDatesLabels,
        commissionDatesLabels
    } = useCommissions()
    const {axiosPublic} = useAxios()
    const mockedPublicAxios = vi.mocked(axiosPublic, true)

    describe('getCommissionFunds', () => {
        it('should call API (get) and store data in ref commissions', async () => {
            mockedPublicAxios.get.mockResolvedValueOnce({data: _commissionFunds})
            await getCommissionFunds()
            expect(axiosPublic.get).toHaveBeenCalledOnce()
            expect(axiosPublic.get).toHaveBeenCalledWith('/commissions/funds/')
            expect(commissionFunds.value).toEqual(_commissionFunds)
        })
    })

    describe('getCommissionDates', () => {
        afterEach(() => {
            vi.restoreAllMocks()
        })

        describe('if all params are set to true', () => {
            it('should call API (get) with onlyNext and onlyActive params set to true', async () => {
                mockedPublicAxios.get.mockResolvedValueOnce({data: _commissionDates})
                await getCommissionDates(true, true, true)
                expect(axiosPublic.get).toHaveBeenCalledOnce()
                const url = '/commissions/commission_dates?only_next=true&active_projects=true&managed_commissions=true'
                expect(axiosPublic.get).toHaveBeenCalledWith(url)
                expect(commissionDates.value).toEqual(_commissionDates)
            })
        })
        describe('if all params are set to false', () => {
            it('should call API (get)', async () => {
                mockedPublicAxios.get.mockResolvedValueOnce({data: _commissionDates})
                await getCommissionDates(false, false, false)
                expect(axiosPublic.get).toHaveBeenCalledOnce()
                const url = '/commissions/commission_dates?only_next=false&active_projects=false&managed_commissions=false'
                expect(axiosPublic.get).toHaveBeenCalledWith(url)
                expect(commissionDates.value).toEqual(_commissionDates)
            })
        })
        describe('if all params are set to undefined', () => {
            it('should call API (get)', async () => {
                mockedPublicAxios.get.mockResolvedValueOnce({data: _commissionDates})
                await getCommissionDates(undefined, undefined, undefined)
                expect(axiosPublic.get).toHaveBeenCalledOnce()
                const url = '/commissions/commission_dates'
                expect(axiosPublic.get).toHaveBeenCalledWith(url)
                expect(commissionDates.value).toEqual(_commissionDates)
            })
        })
    })

    describe('initCommissionDatesLabels', () => {
        beforeEach(() => {
            commissionFunds.value = _commissionFunds
            commissionDates.value = _commissionDates
        })

        afterEach(() => {
            commissionFunds.value = []
            commissionDates.value = []
        })

        describe('if commissions are site', () => {
            it('should create labels for each commissionDate', () => {
                initCommissionDatesLabels(true)
                const _test: SelectCommissionDateLabel[] = []
                commissionDates.value.forEach((commissionDate) => {
                    const commission = commissionFunds.value.find(obj => obj.id === commissionDate.commission)
                    if (commission) {
                        _test.push({
                            value: commissionDate.id,
                            label: `${commission.acronym} (${commissionDate.commissionDate.split('-').reverse().join('/')})`,
                            commission: commission.id as number
                        })
                    }
                })
                expect(commissionDatesLabels.value).toEqual(_test)
            })
        })

        describe('if commissions are not site', () => {
            it('should create labels only for non site commissionDates', () => {
                initCommissionDatesLabels(false)
                const _test: SelectCommissionDateLabel[] = []
                commissionDates.value.forEach((commissionDate) => {
                    const commission = commissionFunds.value.find(obj => obj.id === commissionDate.commission)
                    if (commission && !commission.isSite) {
                        _test.push({
                            value: commissionDate.id,
                            label: `${commission.acronym} (${commissionDate.commissionDate.split('-').reverse().join('/')})`,
                            commission: commission.id as number
                        })
                    }
                })
                expect(commissionDatesLabels.value).toEqual(_test)
            })
        })

        describe('if we need to get customized commission dates', () => {
            it('should create labels based on the commissions of a user (manager)', () => {
                userStore.user = _generalManager
                initCommissionDatesLabels(undefined)
                const _test: SelectCommissionDateLabel[] = []
                commissionDates.value.forEach((commissionDate) => {
                    const commission = commissionFunds.value.find(obj => obj.id === commissionDate.commission)
                    _test.push({
                        value: commissionDate.id,
                        label: `${commission?.acronym} (${commissionDate.commissionDate.split('-').reverse().join('/')})`,
                        commission: commission?.id as number
                    })
                })
                expect(commissionDatesLabels.value).toEqual(_test)
            })
        })
    })
})
