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
    _projectCommissionFunds,
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
        projectStore.projectCommissionFunds = []
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

    describe('getProjectCommissionFunds', () => {
        describe('as manager', () => {
            it('should get all project commission funds and if needed get the dates of a specific commission', async () => {
                mockedAuthAxios.get.mockResolvedValueOnce({data: _projectCommissionFunds})
                await projectStore.getProjectCommissionFunds(true, 1)
                expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
                expect(axiosAuthenticated.get).toHaveBeenCalledWith('/projects/commission_funds?commission_id=1')
                expect(projectStore.projectCommissionFunds).toEqual(_projectCommissionFunds)
            })
        })

        describe('as student', () => {
            it('should get project commission funds linked to a user/association', async () => {
                projectStore.project = _project
                mockedAuthAxios.get.mockResolvedValueOnce({data: _projectCommissionFunds})
                await projectStore.getProjectCommissionFunds(false, undefined)
                expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
                expect(axiosAuthenticated.get).toHaveBeenCalledWith('/projects/1/commission_funds')
                expect(projectStore.projectCommissionFunds).toEqual(_projectCommissionFunds)
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

    describe('getManagedProjects', () => {
        const statuses = ['PROJECT_PROCESSING', 'PROJECT_VALIDATED', 'PROJECT_REVIEW_DRAFT',
            'PROJECT_REVIEW_PROCESSING', 'PROJECT_REJECTED', 'PROJECT_REVIEW_REJECTED', 'PROJECT_REVIEW_VALIDATED'].join(',')

        describe('of a specific commission', () => {
            it('should make an API call specifying chosen commission', async () => {
                mockedAuthAxios.get.mockResolvedValueOnce({data: _projects})
                await projectStore.getManagedProjects(1)
                expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
                const url = `/projects/?project_statuses=${statuses}&commission_id=1`
                expect(axiosAuthenticated.get).toHaveBeenCalledWith(url)
                expect(projectStore.projects).toEqual(_projects)
            })
        })

        describe('all managed projects', () => {
            it('should make an API call', async () => {
                mockedAuthAxios.get.mockResolvedValueOnce({data: _projects})
                await projectStore.getManagedProjects(undefined)
                expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
                const url = `/projects/?project_statuses=${statuses}`
                expect(axiosAuthenticated.get).toHaveBeenCalledWith(url)
                expect(projectStore.projects).toEqual(_projects)
            })
        })
    })
})
