import type {AxiosResponse} from 'axios'
import {createPinia, setActivePinia} from 'pinia'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import type {PaginatedList} from '#/global'
import type {
  Project,
  ProjectCategoryName,
  ProjectCommissionFund,
  ProjectCommissionFundFilter,
  ProjectListItem,
  ProjectListFilters,
  ProjectStatus,
  UpdateProjectCommissionFund,
  UpdateProjectReview
} from '#/project'
import * as documentUploadService from '@/services/DocumentUploadService'
import * as projectService from '@/services/ProjectService'
import {useProjectStore} from '@/stores/useProjectStore'
import {
  _documentUploads,
  _project,
  _projectCategoryNames,
  _projectCommissionFunds,
  _projectReview,
  _projects
} from '~/fixtures/project.mock'

vi.mock('@/services/ProjectService', () => ({
  getProjects: vi.fn(),
  getProjectDetail: vi.fn(),
  getProjectCategoryNames: vi.fn(),
  getProjectCommissionFunds: vi.fn(),
  getProjectReview: vi.fn(),
  updateProjectReview: vi.fn(),
  getProjectPdf: vi.fn(),
  getProjectReviewPdf: vi.fn(),
  updateProjectStatus: vi.fn(),
  updateProjectCommissionFund: vi.fn(),
  postponeProject: vi.fn()
}))

vi.mock('@/services/DocumentUploadService', () => ({
  getDocumentUploads: vi.fn(),
  getProjectFileZip: vi.fn()
}))

const paginatedProjects: PaginatedList<ProjectListItem> = {
  count: _projects.length,
  totalPages: 1,
  currentPage: 1,
  range: {start: 1, end: _projects.length},
  next: null,
  previous: null,
  results: _projects
}

const emptyPaginatedProjects: PaginatedList<ProjectListItem> = {
  count: 0,
  totalPages: 0,
  currentPage: 1,
  range: {start: 0, end: 0},
  next: null,
  previous: null,
  results: []
}

const projectFilters: Partial<ProjectListFilters> = {name: 'Festival', page: 2, pageSize: 10}
const commissionFundFilter: ProjectCommissionFundFilter = {filter: 'project', projectId: _project.id}
const reviewPayload: Partial<UpdateProjectReview> = {review: 'Compte rendu modifié'}
const commissionFundPayload: Partial<UpdateProjectCommissionFund> = {amountAsked: 500}
const updatedProject: Project = {..._project, projectStatus: 'PROJECT_VALIDATED'}
const newStatus: ProjectStatus = 'PROJECT_VALIDATED'

// Le service retourne ProjectCommissionFund[] alors que les fixtures et le state du store
// utilisent ProjectCommissionFundBase[] (typage préexistant du store).
const serviceCommissionFunds = _projectCommissionFunds as unknown as ProjectCommissionFund[]

function arrayBufferResponse(size: number): AxiosResponse<ArrayBuffer> {
  return {
    data: new ArrayBuffer(size),
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
  } as unknown as AxiosResponse<ArrayBuffer>
}

describe('useProjectStore', () => {
  let store: ReturnType<typeof useProjectStore>

  beforeEach(() => {
    vi.resetAllMocks()
    setActivePinia(createPinia())
    store = useProjectStore()
  })

  describe('état initial', () => {
    it('doit initialiser le projet, la liste et la review à undefined', () => {
      expect(store.project).toBeUndefined()
      expect(store.projects).toBeUndefined()
      expect(store.projectReview).toBeUndefined()
    })

    it('doit initialiser les collections à des tableaux vides', () => {
      expect(store.projectCategoryNames).toEqual([])
      expect(store.projectCommissionFunds).toEqual([])
      expect(store.projectDocuments).toEqual([])
    })
  })

  describe('projectStatus', () => {
    it('doit retourner PROJECT_DRAFT si aucun projet n est chargé', () => {
      expect(store.projectStatus).toBe('PROJECT_DRAFT')
    })

    it('doit retourner le statut du projet chargé', () => {
      store.project = {..._project, projectStatus: 'PROJECT_PROCESSING'}

      expect(store.projectStatus).toBe('PROJECT_PROCESSING')
    })
  })

  describe('projectCategoryLabels', () => {
    it('doit mapper les catégories en options value/label', () => {
      const categories: ProjectCategoryName[] = [
        {id: 7, name: 'Handicap'},
        {id: 12, name: 'Sport'}
      ]
      store.projectCategoryNames = categories

      expect(store.projectCategoryLabels).toEqual([
        {value: 7, label: 'Handicap'},
        {value: 12, label: 'Sport'}
      ])
    })

    it('doit retourner une liste vide si aucune catégorie n est chargée', () => {
      expect(store.projectCategoryLabels).toEqual([])
    })
  })

  describe('projectCommission', () => {
    it('doit retourner l identifiant de la commission du projet', () => {
      store.project = structuredClone(_project)

      expect(store.projectCommission).toBe(_project.commission.id)
    })

    it('doit retourner undefined si aucun projet n est chargé', () => {
      expect(store.projectCommission).toBeUndefined()
    })
  })

  describe('projectFunds', () => {
    it('doit retourner une liste vide si aucun fonds n est chargé', () => {
      expect(store.projectFunds).toEqual([])
    })

    it('doit retourner une liste vide même si des fonds de commission sont chargés', () => {
      store.projectCommissionFunds = [..._projectCommissionFunds]

      expect(store.projectFunds).toEqual([])
    })
  })

  describe('getProjects', () => {
    it('doit appeler le service avec les filtres fournis et stocker la liste paginée', async () => {
      vi.mocked(projectService.getProjects).mockResolvedValueOnce(paginatedProjects)

      await store.getProjects(projectFilters)

      expect(projectService.getProjects).toHaveBeenCalledWith(projectFilters)
      expect(store.projects).toEqual(paginatedProjects)
    })

    it('doit appeler le service avec undefined si aucun filtre n est fourni', async () => {
      vi.mocked(projectService.getProjects).mockResolvedValueOnce(emptyPaginatedProjects)

      await store.getProjects()

      expect(projectService.getProjects).toHaveBeenCalledWith(undefined)
    })

    it('doit stocker une liste vide si le service ne retourne aucun projet', async () => {
      vi.mocked(projectService.getProjects).mockResolvedValueOnce(emptyPaginatedProjects)

      await store.getProjects()

      expect(store.projects).toEqual(emptyPaginatedProjects)
    })

    it('doit propager une erreur du service', async () => {
      vi.mocked(projectService.getProjects).mockRejectedValueOnce(new Error('SERVICE_ERROR'))

      await expect(store.getProjects()).rejects.toThrow('SERVICE_ERROR')
    })
  })

  describe('getProjectDetail', () => {
    it('doit charger le détail du projet demandé dans le state', async () => {
      vi.mocked(projectService.getProjectDetail).mockResolvedValueOnce(_project)

      await store.getProjectDetail(42)

      expect(projectService.getProjectDetail).toHaveBeenCalledWith(42)
      expect(store.project).toEqual(_project)
    })

    it('doit propager une erreur du service', async () => {
      vi.mocked(projectService.getProjectDetail).mockRejectedValueOnce(new Error('SERVICE_ERROR'))

      await expect(store.getProjectDetail(42)).rejects.toThrow('SERVICE_ERROR')
    })
  })

  describe('getProjectCategoryNames', () => {
    it('doit transmettre le filtre onlyEnabled et stocker les catégories', async () => {
      vi.mocked(projectService.getProjectCategoryNames).mockResolvedValueOnce(_projectCategoryNames)

      await store.getProjectCategoryNames(true)

      expect(projectService.getProjectCategoryNames).toHaveBeenCalledWith(true)
      expect(store.projectCategoryNames).toEqual(_projectCategoryNames)
    })

    it('doit appeler le service avec undefined si le filtre est omis', async () => {
      vi.mocked(projectService.getProjectCategoryNames).mockResolvedValueOnce(_projectCategoryNames)

      await store.getProjectCategoryNames()

      expect(projectService.getProjectCategoryNames).toHaveBeenCalledWith(undefined)
    })

    it('doit stocker un tableau vide si aucune catégorie n est retournée', async () => {
      vi.mocked(projectService.getProjectCategoryNames).mockResolvedValueOnce([])

      await store.getProjectCategoryNames()

      expect(store.projectCategoryNames).toEqual([])
    })
  })

  describe('getProjectCommissionFunds', () => {
    it('doit transmettre le filtre au service et stocker les fonds retournés', async () => {
      vi.mocked(projectService.getProjectCommissionFunds).mockResolvedValueOnce(serviceCommissionFunds)

      await store.getProjectCommissionFunds(commissionFundFilter)

      expect(projectService.getProjectCommissionFunds).toHaveBeenCalledWith(commissionFundFilter)
      expect(store.projectCommissionFunds).toEqual(_projectCommissionFunds)
    })

    it('doit propager une erreur du service', async () => {
      vi.mocked(projectService.getProjectCommissionFunds).mockRejectedValueOnce(new Error('SERVICE_ERROR'))

      await expect(store.getProjectCommissionFunds(commissionFundFilter)).rejects.toThrow('SERVICE_ERROR')
    })
  })

  describe('getProjectReview', () => {
    it('doit appeler le service avec l id du projet et stocker la review', async () => {
      store.project = structuredClone(_project)
      vi.mocked(projectService.getProjectReview).mockResolvedValueOnce(_projectReview)

      await store.getProjectReview()

      expect(projectService.getProjectReview).toHaveBeenCalledWith(_project.id)
      expect(store.projectReview).toEqual(_projectReview)
    })

    it('doit transmettre undefined si aucun projet n est chargé', async () => {
      vi.mocked(projectService.getProjectReview).mockResolvedValueOnce(_projectReview)

      await store.getProjectReview()

      expect(projectService.getProjectReview).toHaveBeenCalledWith(undefined)
    })
  })

  describe('updateProjectReview', () => {
    it('doit patcher la review du projet et remplacer la review du state', async () => {
      store.project = structuredClone(_project)
      vi.mocked(projectService.updateProjectReview).mockResolvedValueOnce(_projectReview)

      await store.updateProjectReview(reviewPayload)

      expect(projectService.updateProjectReview).toHaveBeenCalledWith(_project.id, reviewPayload)
      expect(store.projectReview).toEqual(_projectReview)
    })

    it('doit transmettre undefined si aucun projet n est chargé', async () => {
      vi.mocked(projectService.updateProjectReview).mockResolvedValueOnce(_projectReview)

      await store.updateProjectReview(reviewPayload)

      expect(projectService.updateProjectReview).toHaveBeenCalledWith(undefined, reviewPayload)
    })
  })

  describe('getProjectPdf', () => {
    it('doit retourner le PDF du service pour le projet chargé', async () => {
      store.project = structuredClone(_project)
      const response = arrayBufferResponse(8)
      vi.mocked(projectService.getProjectPdf).mockResolvedValueOnce(response)

      const result = await store.getProjectPdf()

      expect(projectService.getProjectPdf).toHaveBeenCalledWith(_project.id)
      expect(result).toBe(response)
    })

    it('doit transmettre undefined si aucun projet n est chargé', async () => {
      const response = arrayBufferResponse(8)
      vi.mocked(projectService.getProjectPdf).mockResolvedValueOnce(response)

      await store.getProjectPdf()

      expect(projectService.getProjectPdf).toHaveBeenCalledWith(undefined)
    })
  })

  describe('getProjectReviewPdf', () => {
    it('doit retourner le PDF de review du service pour le projet chargé', async () => {
      store.project = structuredClone(_project)
      const response = arrayBufferResponse(16)
      vi.mocked(projectService.getProjectReviewPdf).mockResolvedValueOnce(response)

      const result = await store.getProjectReviewPdf()

      expect(projectService.getProjectReviewPdf).toHaveBeenCalledWith(_project.id)
      expect(result).toBe(response)
    })

    it('doit transmettre undefined si aucun projet n est chargé', async () => {
      const response = arrayBufferResponse(16)
      vi.mocked(projectService.getProjectReviewPdf).mockResolvedValueOnce(response)

      await store.getProjectReviewPdf()

      expect(projectService.getProjectReviewPdf).toHaveBeenCalledWith(undefined)
    })
  })

  describe('updateProjectStatus', () => {
    it('doit mettre à jour le statut via le service et remplacer le projet du state', async () => {
      store.project = structuredClone(_project)
      vi.mocked(projectService.updateProjectStatus).mockResolvedValueOnce(updatedProject)

      await store.updateProjectStatus(newStatus)

      expect(projectService.updateProjectStatus).toHaveBeenCalledWith(_project.id, newStatus)
      expect(store.project).toEqual(updatedProject)
    })

    it('doit transmettre undefined si aucun projet n est chargé', async () => {
      vi.mocked(projectService.updateProjectStatus).mockResolvedValueOnce(updatedProject)

      await store.updateProjectStatus(newStatus)

      expect(projectService.updateProjectStatus).toHaveBeenCalledWith(undefined, newStatus)
    })
  })

  describe('updateProjectCommissionFund', () => {
    it('doit patcher le fonds de commission du projet chargé', async () => {
      store.project = structuredClone(_project)

      await store.updateProjectCommissionFund(2, commissionFundPayload)

      expect(projectService.updateProjectCommissionFund).toHaveBeenCalledWith(_project.id, 2, commissionFundPayload)
    })

    it('doit transmettre undefined si aucun projet n est chargé', async () => {
      await store.updateProjectCommissionFund(2, commissionFundPayload)

      expect(projectService.updateProjectCommissionFund).toHaveBeenCalledWith(undefined, 2, commissionFundPayload)
    })

    it('doit propager une erreur du service', async () => {
      store.project = structuredClone(_project)
      vi.mocked(projectService.updateProjectCommissionFund).mockRejectedValueOnce(new Error('SERVICE_ERROR'))

      await expect(store.updateProjectCommissionFund(2, commissionFundPayload)).rejects.toThrow('SERVICE_ERROR')
    })
  })

  describe('postponeProject', () => {
    it('doit reporter le projet chargé vers la nouvelle commission', async () => {
      store.project = structuredClone(_project)

      await store.postponeProject(3)

      expect(projectService.postponeProject).toHaveBeenCalledWith(_project.id, 3)
    })

    it('doit transmettre undefined si aucun projet n est chargé', async () => {
      await store.postponeProject(3)

      expect(projectService.postponeProject).toHaveBeenCalledWith(undefined, 3)
    })
  })

  describe('getProjectDocumentUploads', () => {
    it('doit charger les documents du projet et les stocker', async () => {
      store.project = structuredClone(_project)
      vi.mocked(documentUploadService.getDocumentUploads).mockResolvedValueOnce(_documentUploads)

      await store.getProjectDocumentUploads()

      expect(documentUploadService.getDocumentUploads).toHaveBeenCalledWith({projectId: _project.id})
      expect(store.projectDocuments).toEqual(_documentUploads)
    })

    it('doit échouer avec une TypeError si aucun projet n est chargé', async () => {
      await expect(store.getProjectDocumentUploads()).rejects.toThrow(TypeError)

      expect(documentUploadService.getDocumentUploads).not.toHaveBeenCalled()
    })

    it('doit propager une erreur du service', async () => {
      store.project = structuredClone(_project)
      vi.mocked(documentUploadService.getDocumentUploads).mockRejectedValueOnce(new Error('SERVICE_ERROR'))

      await expect(store.getProjectDocumentUploads()).rejects.toThrow('SERVICE_ERROR')
    })
  })

  describe('getProjectFileZip', () => {
    it('doit retourner le ZIP du service pour le projet chargé', async () => {
      store.project = structuredClone(_project)
      const response = arrayBufferResponse(32)
      vi.mocked(documentUploadService.getProjectFileZip).mockResolvedValueOnce(response)

      const result = await store.getProjectFileZip()

      expect(documentUploadService.getProjectFileZip).toHaveBeenCalledWith(_project.id)
      expect(result).toBe(response)
    })

    it('doit transmettre undefined si aucun projet n est chargé', async () => {
      const response = arrayBufferResponse(32)
      vi.mocked(documentUploadService.getProjectFileZip).mockResolvedValueOnce(response)

      await store.getProjectFileZip()

      expect(documentUploadService.getProjectFileZip).toHaveBeenCalledWith(undefined)
    })

    it('doit propager une erreur du service', async () => {
      store.project = structuredClone(_project)
      vi.mocked(documentUploadService.getProjectFileZip).mockRejectedValueOnce(new Error('SERVICE_ERROR'))

      await expect(store.getProjectFileZip()).rejects.toThrow('SERVICE_ERROR')
    })
  })
})
