import {createTestingPinia} from '@pinia/testing'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {config} from '@vue/test-utils'
import {createPinia, setActivePinia} from 'pinia'
import {useUserStore} from '@/stores/useUserStore'
import useCommissions from '@/composables/useCommissions'
import {useAxios} from '@/composables/useAxios'
import {_commissionFunds, _commissions, _funds} from '~/fixtures/commissions.mock'
import type {Commission, NewCommission} from '#/commissions'

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
        funds.value = []
        commissions.value = []
    })

    const {
        getFunds,
        funds,
        getCommissionsForManagers,
        commissions,
        getCommissionsForStudents,
        getNextCommission,
        commission,
        getAllCommissions,
        getCommissionFunds,
        commissionFunds,
        postNewCommission,
        updateCommission,
        deleteCommission
    } = useCommissions()
    const {axiosPublic, axiosAuthenticated} = useAxios()
    const mockedPublicAxios = vi.mocked(axiosPublic, true)
    const mockedAuthAxios = vi.mocked(axiosAuthenticated, true)

    describe('getFunds', () => {
        it('should call API (get) and store data in ref commissions', async () => {
            mockedPublicAxios.get.mockResolvedValueOnce({data: _funds})
            await getFunds()
            expect(axiosPublic.get).toHaveBeenCalledOnce()
            expect(axiosPublic.get).toHaveBeenCalledWith('/commissions/funds/names')
            expect(funds.value).toEqual(_funds)
        })
    })

    describe('getCommissionsForManagers', () => {
        afterEach(() => {
            vi.restoreAllMocks()
        })

        describe('if all params are set to true', () => {
            it('should call API (get) with params params set to true', async () => {
                mockedPublicAxios.get.mockResolvedValueOnce({data: _commissions})
                await getCommissionsForManagers(true, true, true, true, true)
                expect(axiosPublic.get).toHaveBeenCalledOnce()
                const url = '/commissions/?with_active_projects=true&only_with_active_projects=true&is_open_to_projects=true&is_site=true&managed_projects=true'
                expect(axiosPublic.get).toHaveBeenCalledWith(url)
                expect(commissions.value).toEqual(_commissions)
            })
        })
        describe('if all params are set to false', () => {
            it('should call API (get)', async () => {
                mockedPublicAxios.get.mockResolvedValueOnce({data: _commissions})
                await getCommissionsForManagers(false, false, false, false, false)
                expect(axiosPublic.get).toHaveBeenCalledOnce()
                const url = '/commissions/?with_active_projects=false&only_with_active_projects=false&is_open_to_projects=false&is_site=false&managed_projects=false'
                expect(axiosPublic.get).toHaveBeenCalledWith(url)
                expect(commissions.value).toEqual(_commissions)
            })
        })
        describe('if all params are set to undefined', () => {
            it('should call API (get)', async () => {
                mockedPublicAxios.get.mockResolvedValueOnce({data: _commissions})
                await getCommissionsForManagers(undefined, undefined, undefined, undefined, undefined)
                expect(axiosPublic.get).toHaveBeenCalledOnce()
                const url = '/commissions/'
                expect(axiosPublic.get).toHaveBeenCalledWith(url)
                expect(commissions.value).toEqual(_commissions)
            })
        })
    })
    describe('getCommissionsForStudents', () => {
        describe('if all params are set to true', () => {
            it('should get commissions that are open to projects and site', async () => {
                mockedPublicAxios.get.mockResolvedValueOnce({data: _commissions})
                await getCommissionsForStudents(true, true)
                expect(axiosPublic.get).toHaveBeenCalledOnce()
                expect(axiosPublic.get).toHaveBeenCalledWith('/commissions/?is_open_to_projects=true&is_site=true')
                expect(commissions.value).toEqual(_commissions)
            })
        })
        describe('if all params are set to false', () => {
            it('should get commissions that are closed to projects and not site', async () => {
                mockedPublicAxios.get.mockResolvedValueOnce({data: _commissions})
                await getCommissionsForStudents(false, false)
                expect(axiosPublic.get).toHaveBeenCalledOnce()
                expect(axiosPublic.get).toHaveBeenCalledWith('/commissions/?is_open_to_projects=false&is_site=false')
                expect(commissions.value).toEqual(_commissions)
            })
        })
        describe('if all params are set to undefined', () => {
            it('should get all commissions', async () => {
                mockedPublicAxios.get.mockResolvedValueOnce({data: _commissions})
                await getCommissionsForStudents(undefined, undefined)
                expect(axiosPublic.get).toHaveBeenCalledOnce()
                expect(axiosPublic.get).toHaveBeenCalledWith('/commissions/')
            })
        })
    })
    describe('getNextCommission', () => {
        it('should get commissions open to projects and assign the first item to state', async () => {
            mockedPublicAxios.get.mockResolvedValueOnce({data: _commissions})
            await getNextCommission()
            expect(axiosPublic.get).toHaveBeenCalledOnce()
            expect(axiosPublic.get).toHaveBeenCalledWith('/commissions/?is_open_to_projects=true')
            expect(commission.value).toEqual(_commissions[0])
        })
    })
    describe('getAllCommissions', () => {
        it('should get all commissions with no params', async () => {
            mockedPublicAxios.get.mockResolvedValueOnce({data: _commissions})
            await getAllCommissions()
            expect(axiosPublic.get).toHaveBeenCalledOnce()
            expect(axiosPublic.get).toHaveBeenCalledWith('/commissions/')
        })
    })
    describe('getCommissionFunds', () => {
        it('should get all commissionFunds', async () => {
            mockedPublicAxios.get.mockResolvedValueOnce({data: _commissionFunds})
            await getCommissionFunds()
            expect(axiosPublic.get).toHaveBeenCalledOnce()
            expect(axiosPublic.get).toHaveBeenCalledWith('/commissions/funds')
            expect(commissionFunds.value).toEqual(_commissionFunds)
        })
    })
    describe('postNewCommission', () => {
        it('should post a new commission and associated commission funds', async () => {
            const newCommission: NewCommission = {
                commissionDate: '2023-06-16',
                submissionDate: '2023-06-01',
                isOpenToProjects: true,
                name: 'Nouvelle commission',
                datesAreLegal: true,
                commission: 1,
                funds: [1, 2, 3]
            }
            const response: Commission = {
                id: 1,
                commissionDate: '2023-06-16',
                submissionDate: '2023-06-01',
                isOpenToProjects: true,
                name: 'Nouvelle commission'
            }
            mockedAuthAxios.post.mockResolvedValueOnce({data: response})
            await postNewCommission(newCommission)
            expect(axiosAuthenticated.post).toHaveBeenCalledTimes(4)
            expect(axiosAuthenticated.post).toHaveBeenCalledWith('/commissions/', {
                commissionDate: newCommission.commissionDate,
                submissionDate: newCommission.submissionDate,
                isOpenToProjects: newCommission.isOpenToProjects,
                name: newCommission.name
            })
            expect(axiosAuthenticated.post).toHaveBeenLastCalledWith('/commissions/funds', {
                commission: response.id,
                fund: 3
            })
        })
    })
    describe('updateCommission', () => {
        it('should patch updated infos and post or delete updated funds', async () => {
            const updatedCommission = {
                id: 1,
                oldName: 'Commission',
                newName: 'Commission mise à jour',
                oldCommissionDate: '2023-06-20',
                newCommissionDate: '2023-06-21',
                oldSubmissionDate: '2023-05-31',
                newSubmissionDate: '2023-06-01',
                datesAreLegal: true,
                oldFunds: [1, 2, 3],
                newFunds: [1, 4, 5],
                oldIsOpenToProjects: false,
                newIsOpenToProjects: true,
                open: true
            }
            await updateCommission(updatedCommission)
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith('/commissions/1', {
                name: 'Commission mise à jour',
                commissionDate: '2023-06-21',
                submissionDate: '2023-06-01',
                isOpenToProjects: true
            })
            expect(axiosAuthenticated.post).toHaveBeenCalledTimes(2)
            expect(axiosAuthenticated.post).toHaveBeenLastCalledWith('/commissions/funds', {
                commission: 1,
                fund: 5
            })
            expect(axiosAuthenticated.delete).toHaveBeenCalledTimes(2)
            expect(axiosAuthenticated.delete).toHaveBeenLastCalledWith('/commissions/1/funds/3')
        })
    })
    describe('deleteCommission', () => {
        it('should delete commission', async () => {
            await deleteCommission(1)
            expect(axiosAuthenticated.delete).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.delete).toHaveBeenCalledWith('/commissions/1')
        })
    })
})
