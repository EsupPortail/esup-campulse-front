import {createPinia, setActivePinia} from 'pinia'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {useAxios} from '@/composables/useAxios'
import {useProjectStore} from '@/stores/useProjectStore'
import {
    _documentUploads,
    _project,
    _projectCategories,
    _projectCategoryNames,
    _projectCommissionDates,
    _projects
} from '~/fixtures/project.mock'


vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))

setActivePinia(createPinia())
let projectStore = useProjectStore()

describe('Project store', () => {
    const {axiosPublic, axiosAuthenticated} = useAxios()
    const mockedPublicAxios = vi.mocked(axiosPublic, true)
    const mockedAuthAxios = vi.mocked(axiosAuthenticated, true)

    beforeEach(() => {
        projectStore = useProjectStore()
    })
    afterEach(() => {
        vi.restoreAllMocks()
        projectStore.project = undefined
        projectStore.projectCategoryNames = []
        projectStore.projectCategories = []
        projectStore.projectCommissionDates = []
    })

    describe('getProjectCategoryNames', () => {
        it('should make an API call (GET) and store data', async () => {
            mockedPublicAxios.get.mockResolvedValueOnce({data: _projectCategoryNames})
            await projectStore.getProjectCategoryNames()
            expect(axiosPublic.get).toHaveBeenCalledOnce()
            expect(axiosPublic.get).toHaveBeenCalledWith('/projects/categories/names')
            expect(projectStore.projectCategoryNames).toEqual(_projectCategoryNames)
        })
    })

    describe('getProjectCategories', () => {
        it('should make an API call (GET) and store data', async () => {
            projectStore.project = _project
            mockedAuthAxios.get.mockResolvedValueOnce({data: _projectCategories})
            await projectStore.getProjectCategories()
            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith('/projects/1/categories')
            expect(projectStore.projectCategories).toEqual(_projectCategories)
        })
    })

    describe('getProjectDetail', () => {
        it('should make an API call (GET) and store data', async () => {
            mockedAuthAxios.get.mockResolvedValueOnce({data: _project})
            await projectStore.getProjectDetail(1)
            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith('/projects/1')
            expect(projectStore.project).toEqual(_project)
        })
    })

    describe('getProjectCommissionDates', () => {
        describe('as manager', () => {
            it('should make an API call (get) to get all project commission dates and if needed get the dates of a specific commission', async () => {
                mockedAuthAxios.get.mockResolvedValueOnce({data: _projectCommissionDates})
                await projectStore.getProjectCommissionDates(true, 1)
                expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
                expect(axiosAuthenticated.get).toHaveBeenCalledWith('/projects/commission_dates?commission_id=1')
                expect(projectStore.projectCommissionDates).toEqual(_projectCommissionDates)
            })
        })

        describe('not as manager', () => {
            it('should make an API call (get) on another route to get project commission dates linked to a user / association', async () => {
                projectStore.project = _project
                mockedAuthAxios.get.mockResolvedValueOnce({data: _projectCommissionDates})
                await projectStore.getProjectCommissionDates(false, undefined)
                expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
                expect(axiosAuthenticated.get).toHaveBeenCalledWith('/projects/1/commission_dates')
                expect(projectStore.projectCommissionDates).toEqual(_projectCommissionDates)
            })
        })
    })

    describe('getProjectDocuments', () => {
        it('should make an API call (get) and store documents data', async () => {
            projectStore.project = _project
            mockedAuthAxios.get.mockResolvedValueOnce({data: _documentUploads})
            await projectStore.getProjectDocuments()
            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith('/documents/uploads?project_id=1')
            expect(projectStore.projectDocuments).toEqual(_documentUploads)
        })
    })

    describe('getProjects', () => {
        describe('if archived projects and commission dates are selected', () => {
            it('should make an API call specifying archived statuses and commissionDates', async () => {
                mockedAuthAxios.get.mockResolvedValueOnce({data: _projects})
                await projectStore.getProjects(true, [1, 2, 3])
                expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
                const url = '/projects/?project_statuses=PROJECT_REJECTED,PROJECT_REVIEW_REJECTED,PROJECT_REVIEW_VALIDATED&commission_dates=1,2,3'
                expect(axiosAuthenticated.get).toHaveBeenCalledWith(url)
                expect(projectStore.projects).toEqual(_projects)
            })
        })

        describe('if unarchived projects and no commission are selected', () => {
            it('should make an API call specifying unarchived statuses', async () => {
                mockedAuthAxios.get.mockResolvedValueOnce({data: _projects})
                await projectStore.getProjects(false, [])
                expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
                const url = '/projects/?project_statuses=PROJECT_PROCESSING,PROJECT_VALIDATED,PROJECT_REVIEW_DRAFT,PROJECT_REVIEW_PROCESSING'
                expect(axiosAuthenticated.get).toHaveBeenCalledWith(url)
                expect(projectStore.projects).toEqual(_projects)
            })
        })
    })
})
