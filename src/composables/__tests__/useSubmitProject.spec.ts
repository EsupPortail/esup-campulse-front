import {createTestingPinia} from '@pinia/testing'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {config} from '@vue/test-utils'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {createPinia, setActivePinia} from 'pinia'
import {useAxios} from '@/composables/useAxios'
import {useProjectStore} from '@/stores/useProjectStore'
import useSubmitProject from '@/composables/useSubmitProject'
import {
    _project,
    _projectBasicInfos,
    _projectBudget,
    _projectCategories,
    _projectCommissionFunds, _projectGoals, _updatedProjectCommissionFunds
} from '~/fixtures/project.mock'
import {useUserStore} from '@/stores/useUserStore'
import {_miscStudent} from '~/fixtures/user.mock'

vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))

vi.mock('@/composable/useUserAssociations', () => ({
    default: () => ({
        updateUserAssociations: vi.fn(),
        deleteUserAssociation: vi.fn(),
        getUserAssociations: vi.fn(),
        patchUserAssociations: vi.fn()
    })
}))

setActivePinia(createPinia())

let projectStore = useProjectStore()
let userStore = useUserStore()

config.global.plugins = [
    createTestingPinia({
        createSpy: vi.fn()
    })
]

describe('useSubmitProject', () => {
    beforeEach(() => {
        projectStore = useProjectStore()
        userStore = useUserStore()
    })

    afterEach(() => {
        vi.restoreAllMocks()
        projectStore.project = undefined
        projectStore.projectCategories = []
        userStore.user = undefined
    })

    const {
        postNewProject,
        projectBasicInfos,
        projectCommissionFunds,
        updateProjectCommission,
        patchProjectBasicInfos,
        projectCategories,
        updateProjectCategories,
        projectBudget,
        patchProjectBudget,
        patchProjectCommissionFunds,
        projectCommissionFundsDetail,
        projectGoals,
        patchProjectGoals,
        submitProject
    } = useSubmitProject()
    const {axiosAuthenticated} = useAxios()

    describe('postNewProject', () => {
        beforeEach(() => {
            const mockedAxios = vi.mocked(axiosAuthenticated, true)
            projectBasicInfos.value = JSON.parse(JSON.stringify(_projectBasicInfos))
            mockedAxios.post.mockResolvedValueOnce({data: {}})
        })

        afterEach(() => {
            userStore.user = undefined
        })

        describe('as an association', () => {
            it('should post the project with the id of the association', async () => {
                await postNewProject(1)
                expect(axiosAuthenticated.post).toHaveBeenCalledOnce()
                expect(axiosAuthenticated.post).toHaveBeenCalledWith('/projects/', {
                    name: 'Projet test',
                    plannedStartDate: '2023-06-15T00:00:00.000Z',
                    plannedEndDate: '2023-06-15T00:00:00.000Z',
                    plannedLocation: 'Strasbourg',
                    association: '1',
                    partnerAssociation: 'Personne'
                })
            })
        })

        describe('as a user', () => {
            it('should post the project with the id of the user', async () => {
                userStore.user = _miscStudent
                await postNewProject(undefined)
                expect(axiosAuthenticated.post).toHaveBeenCalledOnce()
                expect(axiosAuthenticated.post).toHaveBeenCalledWith('/projects/', {
                    name: 'Projet test',
                    plannedStartDate: '2023-06-15T00:00:00.000Z',
                    plannedEndDate: '2023-06-15T00:00:00.000Z',
                    plannedLocation: 'Strasbourg',
                    user: '7',
                    partnerAssociation: 'Personne'
                })
            })
        })
    })
    describe('updateProjectCommission', () => {
        it('should post and delete projectCommissionFunds', async () => {
            projectStore.project = _project
            projectStore.projectCommissionFunds = _projectCommissionFunds
            projectCommissionFunds.value = [1, 2, 4, 5]
            await updateProjectCommission()
            expect(axiosAuthenticated.delete).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.delete).toHaveBeenCalledWith('/projects/1/commission_funds/3')
            expect(axiosAuthenticated.post).toHaveBeenCalledTimes(2)
            expect(axiosAuthenticated.post).toHaveBeenLastCalledWith('/projects/commission_funds', {
                project: 1,
                commissionFund: 5
            })
        })
    })
    describe('patchProjectBasicInfos', () => {
        it('should patch updated infos', async () => {
            const mockedAxios = vi.mocked(axiosAuthenticated, true)
            mockedAxios.patch.mockResolvedValueOnce({data: {}})
            projectBasicInfos.value = JSON.parse(JSON.stringify(_projectBasicInfos))
            projectBasicInfos.value.associationUser = 2
            projectStore.project = _project
            await patchProjectBasicInfos()
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith('/projects/1', {
                associationUser: 2,
                name: 'Projet test',
                plannedEndDate: '2023-06-15T00:00:00.000Z',
                plannedLocation: 'Strasbourg',
                plannedStartDate: '2023-06-15T00:00:00.000Z'
            })
        })
    })
    describe('updateProjectCategories', () => {
        it('should post and delete project categories', async () => {
            projectStore.project = _project
            projectStore.projectCategories = _projectCategories
            projectCategories.value = [1, 4, 5]
            await updateProjectCategories()
            expect(axiosAuthenticated.post).toHaveBeenCalledTimes(2)
            expect(axiosAuthenticated.post).toHaveBeenLastCalledWith('/projects/categories', {
                project: 1,
                category: 5
            })
            expect(axiosAuthenticated.delete).toHaveBeenCalledTimes(2)
            expect(axiosAuthenticated.delete).toHaveBeenLastCalledWith('/projects/1/categories/3')
        })
    })
    describe('patchProjectBudget', () => {
        beforeEach(() => {
            projectStore.project = _project
            projectBudget.value = JSON.parse(JSON.stringify(_projectBudget))
            const mockedAxios = vi.mocked(axiosAuthenticated, true)
            mockedAxios.patch.mockResolvedValueOnce({data: {}})
        })

        describe('if project is a first edition', () => {
            it('should patch updated infos', async () => {
                await patchProjectBudget(true)
                expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
                expect(axiosAuthenticated.patch).toHaveBeenCalledWith('/projects/1', {
                    amountAllAudience: 60,
                    amountStudentsAudience: 50,
                    budgetPreviousEdition: 0,
                    individualCost: 5,
                    targetAudience: 'Tout le monde',
                    ticketPrice: 2,
                    studentTicketPrice: 1
                })
            })
        })
        describe('if project is not a first edition', () => {
            it('should patch updated infos', async () => {
                await patchProjectBudget(false)
                expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
                expect(axiosAuthenticated.patch).toHaveBeenCalledWith('/projects/1', {
                    amountAllAudience: 60,
                    amountStudentsAudience: 50,
                    budgetPreviousEdition: 100,
                    individualCost: 5,
                    targetAudience: 'Tout le monde',
                    ticketPrice: 2,
                    studentTicketPrice: 1
                })
            })
        })
    })
    describe('patchProjectCommissionFunds', () => {
        beforeEach(() => {
            projectCommissionFundsDetail.value = JSON.parse(JSON.stringify(_updatedProjectCommissionFunds))
            projectStore.projectCommissionFunds = _projectCommissionFunds
            projectStore.project = _project
        })

        describe('if project is a first edition', () => {
            it('should patch updated infos', async () => {
                await patchProjectCommissionFunds(true)
                expect(axiosAuthenticated.patch).toHaveBeenCalledTimes(3)
                expect(axiosAuthenticated.patch).toHaveBeenLastCalledWith('/projects/1/commission_funds/4', {
                    amountAskedPreviousEdition: 500,
                    amountEarnedPreviousEdition: 500,
                    amountAsked: 1500,
                    commissionFund: 4
                })
            })
        })
        describe('if project is not a first edition', () => {
            it('should patch updated infos', async () => {
                await patchProjectCommissionFunds(false)
                expect(axiosAuthenticated.patch).toHaveBeenCalledTimes(3)
                expect(axiosAuthenticated.patch).toHaveBeenLastCalledWith('/projects/1/commission_funds/4', {
                    isFirstEdition: false,
                    amountAskedPreviousEdition: 500,
                    amountEarnedPreviousEdition: 500,
                    amountAsked: 1500,
                    commissionFund: 4
                })
            })
        })
    })
    describe('patchProjectGoals', () => {
        it('should patch updated infos', async () => {
            const mockedAxios = vi.mocked(axiosAuthenticated, true)
            mockedAxios.patch.mockResolvedValueOnce({data: {}})
            projectGoals.value = _projectGoals
            projectStore.project = _project
            await patchProjectGoals()
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith('/projects/1', {
                goals: 'Objectifs',
                marketingCampaign: 'Communication',
                plannedActivities: 'Activités',
                preventionSafety: 'Sécurité',
                sustainableDevelopment: 'Développement durable',
                summary: 'Résumé'
            })
        })
    })
    describe('submitProject', () => {
        it('should patch the project status', async () => {
            projectStore.project = _project
            await submitProject()
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith('/projects/1/status', {
                projectStatus: 'PROJECT_PROCESSING'
            })
        })
    })
})
