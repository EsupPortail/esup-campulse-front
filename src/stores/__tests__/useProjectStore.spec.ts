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
    _projectCommissionFunds, _projectReview,
    _projects
} from '~/fixtures/project.mock'
import useCommissions from '../../composables/useCommissions'
import {_commissionFunds, _commissions} from '../../../tests/fixtures/commissions.mock'


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

    const {commissions, commissionFunds} = useCommissions()
    commissions.value = _commissions
    commissionFunds.value = _commissionFunds

    describe('projectCategoriesLabels', () => {
        it('should init pairs of values and labels based on project categories', () => {
            projectStore.projectCategoryNames = _projectCategoryNames
            expect(projectStore.projectCategoriesLabels).toEqual(_projectCategoryNames.map(category => ({
                value: category.id,
                label: category.name
            })))
        })
    })

    describe('projectCommission', () => {
        it('should find the id of the commission the project is attached to', () => {
            projectStore.projectCommissionFunds = _projectCommissionFunds
            expect(projectStore.projectCommission).toEqual(1)
        })
    })

    describe('projectFunds', () => {
        it('should return an array of fund ids based on project commission funds', () => {
            projectStore.projectCommissionFunds = _projectCommissionFunds
            expect(projectStore.projectFunds).toEqual([1, 2, 3])
        })
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
        const statuses = ['PROJECT_DRAFT_PROCESSED', 'PROJECT_PROCESSING', 'PROJECT_VALIDATED', 'PROJECT_REVIEW_DRAFT',
            'PROJECT_REVIEW_PROCESSING', 'PROJECT_REJECTED', 'PROJECT_CANCELLED', 'PROJECT_REVIEW_VALIDATED'].join(',')

        describe('of a specific commission', () => {
            it('should make an API call specifying chosen commission', async () => {
                mockedAuthAxios.get.mockResolvedValueOnce({data: _projects})
                await projectStore.getManagedProjects(1)
                expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
                const url = `/projects/?project_statuses=${statuses}&commission_id=1`
                expect(axiosAuthenticated.get).toHaveBeenCalledWith(url)
                expect(projectStore.managedProjects).toEqual(_projects)
            })
        })

        describe('all managed projects', () => {
            it('should make an API call', async () => {
                mockedAuthAxios.get.mockResolvedValueOnce({data: _projects})
                await projectStore.getManagedProjects(undefined)
                expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
                const url = `/projects/?project_statuses=${statuses}`
                expect(axiosAuthenticated.get).toHaveBeenCalledWith(url)
                expect(projectStore.managedProjects).toEqual(_projects)
            })
        })
    })

    describe('getAllProjects', () => {
        it('should get all projects with no params', async () => {
            mockedAuthAxios.get.mockResolvedValueOnce({data: _projects})
            await projectStore.getAllProjects()
            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith('/projects/')
            expect(projectStore.selfProjects).toEqual(_projects)
        })
    })

    describe('getAssociationProjects', () => {
        it('should get projects linked to an association', async () => {
            mockedAuthAxios.get.mockResolvedValueOnce({data: _projects})
            await projectStore.getAssociationProjects(1)
            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith('/projects/?association_id=1')
            expect(projectStore.selfProjects).toEqual(_projects)
        })
    })

    describe('getProjectReview', () => {
        it('should call the API (get) to get the review data', async () => {
            mockedAuthAxios.get.mockResolvedValueOnce({data: _projectReview})
            await projectStore.getProjectReview(1)
            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith('/projects/1/review')
            expect(projectStore.projectReview).toEqual(_projectReview)
        })
    })

    describe('getProjectPdf', () => {
        it('should get a pdf recap document of the project', async () => {
            const file = new Blob
            mockedAuthAxios.get.mockResolvedValueOnce({data: file})
            const response = await projectStore.getProjectPdf(1)
            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith('/projects/1/pdf_export', {responseType: 'blob'})
            expect(response).toEqual(file)
        })
    })

    describe('getProjectReviewPdf', () => {
        it('should get a pdf recap document of the review', async () => {
            const file = new Blob
            mockedAuthAxios.get.mockResolvedValueOnce({data: file})
            const response = await projectStore.getProjectReviewPdf(1)
            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith('/projects/1/review/pdf_export', {responseType: 'blob'})
            expect(response).toEqual(file)
        })
    })

    describe('getProjectFiles', () => {
        it('should get all the files uploaded during project submission', async () => {
            const file = new Blob
            mockedAuthAxios.get.mockResolvedValueOnce({data: file})
            const response = await projectStore.getProjectFiles(1)
            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith('/documents/uploads/file?project_id=1', {responseType: 'blob'})
            expect(response).toEqual(file)
        })
    })

    describe('patchProjectStatus', () => {
        it('should patch the status of the project', async () => {
            projectStore.project = _project
            await projectStore.patchProjectStatus('PROJECT_PROCESSING')
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith('/projects/1/status', {
                projectStatus: 'PROJECT_PROCESSING'
            })
        })
    })

    describe('patchProjectCommissionFunds', () => {
        it('should patch an old commission with new commission and corresponding information', async () => {
            projectStore.project = _project
            await projectStore.patchProjectCommissionFund(1, 2)
            const url = `/projects/${projectStore.project?.id}/commission_funds/1`
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith(url, {
                projectId: projectStore.project?.id,
                commissionFundId: 2
            })
        })
    })

    describe('searchProject', () => {
        it('should filter through managed projects and only retrieve the one corresponding to manual identifier', () => {
            projectStore.managedProjects = _projects
            const manualIdentifier = '2023090003'
            projectStore.searchProjectByManualIdentifier(manualIdentifier)
            expect(projectStore.managedProjects).toEqual([_projects.find(obj => obj.manualIdentifier === manualIdentifier)])
        })
    })
})
