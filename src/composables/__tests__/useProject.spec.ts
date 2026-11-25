import {createPinia, setActivePinia} from 'pinia'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {nextTick} from 'vue'
import type {CommissionFund, Fund} from '#/commission'
import type {ProcessDocument} from '#/document'
import type {
  Project,
  ProjectBudget,
  ProjectCommissionFundBase,
  ProjectGoals,
  ProjectInfos,
  SearchProjectFilters
} from '#/project'
import type {User} from '#/user'
import useProject from '@/composables/useProject'
import * as projectService from '@/services/ProjectService'
import {useCommissionStore} from '@/stores/useCommissionStore'
import {useFundStore} from '@/stores/useFundStore'
import {useProfileStore} from '@/stores/useProfileStore'
import {useProjectStore} from '@/stores/useProjectStore'
import {_processDocuments} from '~/fixtures/document.mock'
import {_project} from '~/fixtures/project.mock'

const mocks = vi.hoisted(() => ({
  arraysAreEqual: vi.fn((left: number[], right: number[]) =>
    left.length === right.length && left.every(value => right.includes(value))),
  formatDate: vi.fn((value: string) => value ? `formatted:${value}` : ''),
  reverseDate: vi.fn((value: string) => value ? `reversed:${value}` : ''),
  selectedCommissionFundLabels: vi.fn(),
  processDocuments: {value: [] as ProcessDocument[]}
}))

vi.mock('@/composables/useUtil', () => ({
  default: () => ({
    arraysAreEqual: mocks.arraysAreEqual,
    formatDate: mocks.formatDate,
    reverseDate: mocks.reverseDate
  })
}))

vi.mock('@/composables/useDocumentUpload', () => ({
  default: () => ({processDocuments: mocks.processDocuments})
}))

vi.mock('@/composables/useCommissionFund', () => ({
  default: () => ({selectedCommissionFundLabels: mocks.selectedCommissionFundLabels})
}))

vi.mock('@/services/ProjectService', () => ({
  createProject: vi.fn(),
  updateProject: vi.fn(),
  updateProjectStatus: vi.fn(),
  createProjectCommissionFund: vi.fn(),
  deleteProjectCommissionFund: vi.fn(),
  updateProjectCommissionFund: vi.fn(),
  createProjectCategory: vi.fn(),
  deleteProjectCategory: vi.fn()
}))

setActivePinia(createPinia())

const projectStore = useProjectStore()
const profileStore = useProfileStore()
const commissionStore = useCommissionStore()
const fundStore = useFundStore()

const projectFixture: Project = {
  ...structuredClone(_project),
  plannedStartDate: '2023-06-15T00:00:00.000Z',
  plannedEndDate: '2023-06-20T00:00:00.000Z',
  categories: [{id: 1, name: 'Culture'}]
}

const emptyInfos: ProjectInfos = {
  name: '',
  plannedStartDate: '',
  plannedEndDate: '',
  plannedLocation: '',
  user: null,
  association: null,
  associationUser: null,
  partnerAssociation: ''
}

const emptyBudget: ProjectBudget = {
  budgetPreviousEdition: 0,
  targetAudience: '',
  amountStudentsAudience: 0,
  amountAllAudience: 1,
  ticketPrice: 0,
  studentTicketPrice: 0,
  individualCost: 1
}

const emptyGoals: ProjectGoals = {
  goals: '',
  summary: '',
  plannedActivities: '',
  preventionSafety: '',
  marketingCampaign: '',
  sustainableDevelopment: ''
}

const emptyFilters: SearchProjectFilters = {
  manualIdentifier: null,
  name: null,
  associationName: null,
  userName: null,
  editionDate: {from: null, to: null},
  commissionDate: {from: null, to: null},
  funds: [],
  projectStatuses: [],
  category: null
}

const fundsFixture: Fund[] = [
  {id: 1, name: 'Fonds un', acronym: 'F1', isSite: true, institution: 1},
  {id: 2, name: 'Fonds deux', acronym: 'F2', isSite: true, institution: 2}
]

const commissionFundsFixture: CommissionFund[] = [
  {id: 1, commission: 1, fund: 1},
  {id: 2, commission: 1, fund: 2},
  {id: 3, commission: 1, fund: 1},
  {id: 4, commission: 2, fund: 2}
]

const managerUser: User = {
  id: 7,
  username: 'manager@test.fr',
  firstName: 'Jean',
  lastName: 'Dupont',
  phone: '0102030405',
  email: 'manager@test.fr',
  address: '1 rue de Test',
  zipcode: '67000',
  city: 'Strasbourg',
  country: 'France',
  isValidatedByAdmin: true,
  isCas: false,
  hasValidatedEmail: true,
  isStudent: false,
  canSubmitProjects: true,
  associations: [],
  groups: [{id: 1, userId: 7, groupId: 1, institutionId: 1, fundId: null}],
  permissions: []
}

const studentUser: User = {
  ...managerUser,
  id: 8,
  groups: [{id: 2, userId: 8, groupId: 2, institutionId: null, fundId: null}]
}

function makeCommissionFund(overrides: Partial<ProjectCommissionFundBase> = {}): ProjectCommissionFundBase {
  return {
    id: 1,
    project: 1,
    commissionFund: 1,
    isFirstEdition: true,
    amountAskedPreviousEdition: 10,
    amountEarnedPreviousEdition: 20,
    amountAsked: 100,
    amountEarned: 30,
    isValidatedByAdmin: false,
    ...overrides
  }
}

function budgetFromProject(project: Project): ProjectBudget {
  return {
    budgetPreviousEdition: project.budgetPreviousEdition,
    targetAudience: project.targetAudience,
    amountStudentsAudience: project.amountStudentsAudience,
    amountAllAudience: project.amountAllAudience,
    ticketPrice: project.ticketPrice,
    studentTicketPrice: project.studentTicketPrice,
    individualCost: project.individualCost
  }
}

describe('useProject', () => {
  const {
    clearProjectSearch,
    initProjectBasicInfos,
    initProjectBudget,
    initProjectGoals,
    resetSubmitProject,
    createProject,
    updateProjectCommission,
    updateProjectCategory,
    updateProjectInfos,
    updateProjectBudget,
    updateProjectCommissionFunds,
    updateProjectGoals,
    submitProject,
    initProjectCommissionFunds,
    canManageProjectCommissionFund,
    isReviewOverdue,
    validateProjectCommissionFund,
    rejectProjectCommissionFund,
    updateAmountEarned,
    projectInfos,
    projectBudget,
    projectCategory,
    projectCommission,
    projectCommissionFunds,
    projectCommissionFundsDetail,
    projectFunds,
    projectGoals,
    projectId,
    projectProcessingDate,
    dashboardTab,
    openProjectSearch,
    searchProjectFilters
  } = useProject()

  beforeEach(() => {
    vi.clearAllMocks()

    projectStore.project = structuredClone(projectFixture)
    projectStore.projectCommissionFunds = []
    profileStore.user = undefined
    commissionStore.commissionFunds = []
    fundStore.funds = []

    projectInfos.value = {...emptyInfos}
    projectBudget.value = {...emptyBudget}
    projectGoals.value = {...emptyGoals}
    projectCategory.value = null
    projectCommission.value = null
    projectCommissionFunds.value = []
    projectCommissionFundsDetail.value = []
    projectFunds.value = []
    projectId.value = undefined
    projectProcessingDate.value = undefined
    dashboardTab.value = 0
    openProjectSearch.value = false
    searchProjectFilters.value = {...emptyFilters}
    mocks.processDocuments.value = []
  })

  describe('clearProjectSearch', () => {
    it('doit remettre tous les filtres de recherche à leur valeur initiale', () => {
      searchProjectFilters.value = {
        manualIdentifier: '20240042',
        name: 'Festival',
        associationName: 'Association',
        userName: 'Jean',
        editionDate: {from: '2024-01-01', to: '2024-02-01'},
        commissionDate: {from: '2024-03-01', to: '2024-04-01'},
        funds: [1, 2],
        projectStatuses: ['PROJECT_DRAFT'],
        category: 3
      }

      clearProjectSearch()

      expect(searchProjectFilters.value).toEqual(emptyFilters)
    })
  })

  describe('isReviewOverdue', () => {
    it('doit retourner false sans projet', () => {
      expect(isReviewOverdue()).toBe(false)
    })

    it.each(['PROJECT_REVIEW_DRAFT', 'PROJECT_REVIEW_DRAFT_PROCESSED'] as const)(
      'doit retourner true pour %s avec des jours de retard',
      (projectStatus) => {
        expect(isReviewOverdue({...projectFixture, projectStatus, reviewOverdueDays: 2})).toBe(true)
      }
    )

    it('doit retourner false si le bilan n a pas de retard', () => {
      expect(isReviewOverdue({...projectFixture, projectStatus: 'PROJECT_REVIEW_DRAFT', reviewOverdueDays: 0})).toBe(false)
    })

    it('doit retourner false si le projet n attend pas de bilan', () => {
      expect(isReviewOverdue({...projectFixture, projectStatus: 'PROJECT_PROCESSING', reviewOverdueDays: 2})).toBe(false)
    })
  })

  describe('initProjectBasicInfos', () => {
    it('doit initialiser les informations depuis le projet du store', () => {
      projectStore.project = {
        ...projectFixture,
        manualIdentifier: '20240042',
        name: 'Festival',
        plannedStartDate: '2024-02-10',
        plannedEndDate: '2024-02-12',
        plannedLocation: 'Strasbourg',
        user: {id: 7, firstName: 'Jean', lastName: 'Dupont'},
        association: {...projectFixture.association!, id: 3},
        partnerAssociation: 'Ville de Strasbourg',
        categories: [{id: 5, name: 'Culture'}]
      }

      initProjectBasicInfos()

      expect(projectInfos.value).toEqual({
        name: 'Festival',
        plannedStartDate: 'formatted:2024-02-10',
        plannedEndDate: 'formatted:2024-02-12',
        plannedLocation: 'Strasbourg',
        user: 7,
        association: 3,
        associationUser: projectFixture.associationUser?.id,
        partnerAssociation: 'Ville de Strasbourg'
      })
      expect(projectId.value).toBe('20240042')
      expect(projectCategory.value).toBe(5)
    })

    it('doit inverser la date de traitement après formatage', () => {
      projectStore.project = {...projectFixture, processingDate: '2024-01-15'}

      initProjectBasicInfos()

      expect(projectProcessingDate.value).toBe('reversed:formatted:2024-01-15')
      expect(mocks.reverseDate).toHaveBeenCalledWith('formatted:2024-01-15')
    })

    it('doit initialiser des informations vides si aucun projet n est chargé', () => {
      projectStore.project = undefined

      initProjectBasicInfos()

      expect(projectInfos.value).toEqual({
        ...emptyInfos,
        user: undefined,
        association: undefined,
        associationUser: undefined,
        plannedStartDate: '',
        plannedEndDate: ''
      })
      expect(projectId.value).toBeUndefined()
      expect(projectProcessingDate.value).toBe('')
      expect(projectCategory.value).toBeUndefined()
    })
  })

  describe('initProjectBudget', () => {
    it('doit initialiser le budget depuis le projet du store', () => {
      projectStore.project = {...projectFixture, ticketPrice: 42}

      initProjectBudget()

      expect(projectBudget.value).toEqual({...budgetFromProject(projectFixture), ticketPrice: 42})
    })

    it('doit copier les fonds de commission du projet dans le détail', () => {
      const commissionFunds = [makeCommissionFund({id: 1}), makeCommissionFund({id: 2, commissionFund: 2})]
      projectStore.projectCommissionFunds = commissionFunds

      initProjectBudget()

      expect(projectCommissionFundsDetail.value).toEqual(commissionFunds)
      expect(projectCommissionFundsDetail.value).not.toBe(commissionFunds)
    })
  })

  describe('initProjectGoals', () => {
    it('doit initialiser les objectifs depuis le projet du store', () => {
      projectStore.project = {...projectFixture, goals: 'Nouveaux objectifs'}

      initProjectGoals()

      expect(projectGoals.value).toEqual({
        goals: 'Nouveaux objectifs',
        summary: projectFixture.summary,
        plannedActivities: projectFixture.plannedActivities,
        preventionSafety: projectFixture.preventionSafety,
        marketingCampaign: projectFixture.marketingCampaign,
        sustainableDevelopment: projectFixture.sustainableDevelopment
      })
    })

    it('doit initialiser des objectifs vides si aucun projet n est chargé', () => {
      projectStore.project = undefined

      initProjectGoals()

      expect(Object.values(projectGoals.value).every(value => value === undefined)).toBe(true)
    })
  })

  describe('resetSubmitProject', () => {
    it('doit remettre à zéro les informations, la catégorie et la commission', () => {
      projectInfos.value = {...emptyInfos, name: 'Festival', plannedLocation: 'Lyon'}
      projectCategory.value = 3
      projectCommission.value = 2
      projectCommissionFunds.value = [1, 2]

      resetSubmitProject()

      expect(projectInfos.value).toEqual(emptyInfos)
      expect(projectCategory.value).toBeNull()
      expect(projectCommission.value).toBeNull()
      expect(projectCommissionFunds.value).toEqual([])
    })

    it('doit remettre à zéro le budget, les objectifs et les documents', () => {
      projectBudget.value = {...emptyBudget, ticketPrice: 10}
      projectGoals.value = {...emptyGoals, goals: 'Objectifs'}
      mocks.processDocuments.value = structuredClone(_processDocuments)

      resetSubmitProject()

      expect(projectBudget.value).toEqual(emptyBudget)
      expect(projectGoals.value).toEqual(emptyGoals)
      expect(mocks.processDocuments.value).toEqual([])
    })
  })

  describe('createProject', () => {
    it('doit créer le projet avec l association fournie et la date suffixée', async () => {
      projectInfos.value = {
        ...emptyInfos,
        name: 'Festival',
        plannedStartDate: '2024-02-10',
        plannedEndDate: '2024-02-12',
        plannedLocation: 'Strasbourg',
        partnerAssociation: 'Ville'
      }
      vi.mocked(projectService.createProject).mockResolvedValueOnce(projectFixture)

      await createProject(3)

      expect(projectService.createProject).toHaveBeenCalledWith({
        name: 'Festival',
        plannedStartDate: '2024-02-10T00:00:00.000Z',
        plannedEndDate: '2024-02-12T00:00:00.000Z',
        plannedLocation: 'Strasbourg',
        association: 3,
        partnerAssociation: 'Ville'
      })
      expect(projectStore.project).toEqual(projectFixture)
    })

    it('doit créer le projet pour l utilisateur connecté si aucune association n est fournie', async () => {
      profileStore.user = managerUser
      projectInfos.value = {...emptyInfos, name: 'Festival'}

      await createProject()

      expect(projectService.createProject).toHaveBeenCalledWith({name: 'Festival', user: 7})
    })

    it('doit ignorer les valeurs vides du formulaire', async () => {
      profileStore.user = managerUser
      projectInfos.value = {...emptyInfos, name: 'Festival', plannedLocation: ''}

      await createProject()

      expect(projectService.createProject).toHaveBeenCalledWith({name: 'Festival', user: 7})
    })
  })

  describe('updateProjectCommission', () => {
    it('doit supprimer les anciens fonds et créer les nouveaux', async () => {
      projectStore.projectCommissionFunds = [makeCommissionFund({commissionFund: 1}), makeCommissionFund({id: 2, commissionFund: 3})]
      projectCommissionFunds.value = [1, 2, 4]

      await updateProjectCommission()

      expect(projectService.deleteProjectCommissionFund).toHaveBeenCalledTimes(1)
      expect(projectService.deleteProjectCommissionFund).toHaveBeenCalledWith(1, 3)
      expect(projectService.createProjectCommissionFund).toHaveBeenCalledTimes(2)
      expect(projectService.createProjectCommissionFund).toHaveBeenCalledWith({project: 1, commissionFund: 2})
      expect(projectService.createProjectCommissionFund).toHaveBeenCalledWith({project: 1, commissionFund: 4})
    })

    it('doit retourner immédiatement si la liste des fonds est identique', async () => {
      projectStore.projectCommissionFunds = [makeCommissionFund({commissionFund: 1}), makeCommissionFund({id: 2, commissionFund: 3})]
      projectCommissionFunds.value = [3, 1]

      await updateProjectCommission()

      expect(mocks.arraysAreEqual).toHaveBeenCalledWith([1, 3], [3, 1])
      expect(projectService.deleteProjectCommissionFund).not.toHaveBeenCalled()
      expect(projectService.createProjectCommissionFund).not.toHaveBeenCalled()
    })
  })

  describe('updateProjectCategory', () => {
    it('doit supprimer l ancienne catégorie et créer la nouvelle', async () => {
      projectCategory.value = 2

      await updateProjectCategory()

      expect(projectService.deleteProjectCategory).toHaveBeenCalledWith(1, 1)
      expect(projectService.createProjectCategory).toHaveBeenCalledWith({project: 1, category: 2})
    })

    it('doit retourner immédiatement si la catégorie est inchangée', async () => {
      projectCategory.value = 1

      await updateProjectCategory()

      expect(projectService.deleteProjectCategory).not.toHaveBeenCalled()
      expect(projectService.createProjectCategory).not.toHaveBeenCalled()
    })

    it('doit uniquement créer la catégorie si le projet n en a pas encore', async () => {
      projectStore.project = {...projectFixture, categories: []}
      projectCategory.value = 4

      await updateProjectCategory()

      expect(projectService.deleteProjectCategory).not.toHaveBeenCalled()
      expect(projectService.createProjectCategory).toHaveBeenCalledWith({project: 1, category: 4})
    })

    it('doit uniquement supprimer la catégorie si aucune nouvelle n est sélectionnée', async () => {
      await updateProjectCategory()

      expect(projectService.deleteProjectCategory).toHaveBeenCalledWith(1, 1)
      expect(projectService.createProjectCategory).not.toHaveBeenCalled()
    })
  })

  describe('updateProjectInfos', () => {
    it('doit patcher les informations modifiées avec les dates suffixées', async () => {
      projectStore.project = {
        ...projectFixture,
        name: 'Ancien nom',
        plannedLocation: 'Strasbourg',
        associationUser: {...projectFixture.associationUser!, id: 2}
      }
      projectInfos.value = {
        ...emptyInfos,
        name: 'Nouveau nom',
        plannedStartDate: '2024-02-10',
        plannedEndDate: '2024-02-12',
        plannedLocation: 'Lyon',
        associationUser: 3
      }
      const updatedProject = {...projectFixture, name: 'Nouveau nom'}
      vi.mocked(projectService.updateProject).mockResolvedValueOnce(updatedProject)

      await updateProjectInfos()

      expect(projectService.updateProject).toHaveBeenCalledWith(1, {
        name: 'Nouveau nom',
        plannedStartDate: '2024-02-10T00:00:00.000Z',
        plannedEndDate: '2024-02-12T00:00:00.000Z',
        plannedLocation: 'Lyon',
        associationUser: 3
      })
      expect(projectStore.project).toEqual(updatedProject)
    })

    it('doit patcher toutes les différences avec un formulaire vide', async () => {
      projectInfos.value = {...emptyInfos, name: projectFixture.name}

      await updateProjectInfos()

      expect(projectService.updateProject).toHaveBeenCalledWith(1, {
        plannedStartDate: 'T00:00:00.000Z',
        plannedEndDate: 'T00:00:00.000Z',
        plannedLocation: '',
        associationUser: null
      })
    })

    it('doit retourner immédiatement si aucune information n a changé', async () => {
      projectInfos.value = {
        name: projectFixture.name,
        plannedStartDate: projectFixture.plannedStartDate.slice(0, 10),
        plannedEndDate: projectFixture.plannedEndDate.slice(0, 10),
        plannedLocation: projectFixture.plannedLocation,
        associationUser: projectFixture.associationUser?.id ?? null,
        user: null,
        association: null,
        partnerAssociation: ''
      }

      await updateProjectInfos()

      expect(projectService.updateProject).not.toHaveBeenCalled()
    })
  })

  describe('updateProjectBudget', () => {
    it('doit patcher les valeurs modifiées en entiers', async () => {
      projectBudget.value = {
        ...budgetFromProject(projectFixture),
        amountStudentsAudience: 12,
        ticketPrice: 8
      }

      await updateProjectBudget(false)

      expect(projectService.updateProject).toHaveBeenCalledWith(1, {
        amountStudentsAudience: 12,
        ticketPrice: 8
      })
    })

    it('doit remettre le budget de l édition précédente à zéro lors de la première édition', async () => {
      projectBudget.value = {...budgetFromProject(projectFixture), budgetPreviousEdition: 999}

      await updateProjectBudget(true)

      expect(projectService.updateProject).toHaveBeenCalledWith(1, {budgetPreviousEdition: 0})
    })

    it('doit patcher le budget de l édition précédente si ce n est pas la première édition', async () => {
      projectStore.project = {...projectFixture, budgetPreviousEdition: 500}
      projectBudget.value = {...budgetFromProject(projectFixture), budgetPreviousEdition: 800}

      await updateProjectBudget(false)

      expect(projectService.updateProject).toHaveBeenCalledWith(1, {budgetPreviousEdition: 800})
    })

    it('doit retourner immédiatement si le budget est inchangé', async () => {
      projectBudget.value = budgetFromProject(projectFixture)

      await updateProjectBudget(false)

      expect(projectService.updateProject).not.toHaveBeenCalled()
    })
  })

  describe('updateProjectCommissionFunds', () => {
    it('doit patcher les montants modifiés d un fonds', async () => {
      projectStore.projectCommissionFunds = [makeCommissionFund({isFirstEdition: false})]
      projectCommissionFundsDetail.value = [makeCommissionFund({isFirstEdition: false, amountAsked: 250})]

      await updateProjectCommissionFunds(false)

      expect(projectService.updateProjectCommissionFund).toHaveBeenCalledWith(1, 1, {amountAsked: 250})
    })

    it('doit remettre les montants précédents à zéro lors de la première édition', async () => {
      const oldFund = makeCommissionFund({isFirstEdition: false})
      projectStore.projectCommissionFunds = [oldFund]
      projectCommissionFundsDetail.value = [makeCommissionFund({
        isFirstEdition: false,
        amountAskedPreviousEdition: oldFund.amountAskedPreviousEdition,
        amountEarnedPreviousEdition: oldFund.amountEarnedPreviousEdition,
        amountAsked: 250
      })]

      await updateProjectCommissionFunds(true)

      expect(projectService.updateProjectCommissionFund).toHaveBeenCalledWith(1, 1, {
        isFirstEdition: true,
        amountAskedPreviousEdition: 0,
        amountEarnedPreviousEdition: 0,
        amountAsked: 250
      })
    })

    it('doit ignorer le premier fonds inchangé mais traiter le second fonds modifié', async () => {
      projectStore.projectCommissionFunds = [
        makeCommissionFund({isFirstEdition: false}),
        makeCommissionFund({id: 2, commissionFund: 2, isFirstEdition: false})
      ]
      projectCommissionFundsDetail.value = [
        makeCommissionFund({isFirstEdition: false}),
        makeCommissionFund({id: 2, commissionFund: 2, isFirstEdition: false, amountAsked: 999})
      ]

      await updateProjectCommissionFunds(false)

      expect(projectService.updateProjectCommissionFund).toHaveBeenCalledTimes(1)
      expect(projectService.updateProjectCommissionFund).toHaveBeenCalledWith(1, 2, {amountAsked: 999})
    })
  })

  describe('updateProjectGoals', () => {
    it('doit patcher les objectifs modifiés', async () => {
      projectGoals.value = {
        goals: projectFixture.goals,
        summary: 'Résumé modifié',
        plannedActivities: projectFixture.plannedActivities,
        preventionSafety: projectFixture.preventionSafety,
        marketingCampaign: projectFixture.marketingCampaign,
        sustainableDevelopment: projectFixture.sustainableDevelopment
      }

      await updateProjectGoals()

      expect(projectService.updateProject).toHaveBeenCalledWith(1, {summary: 'Résumé modifié'})
    })

    it('doit retourner immédiatement si les objectifs sont inchangés', async () => {
      projectGoals.value = {
        goals: projectFixture.goals,
        summary: projectFixture.summary,
        plannedActivities: projectFixture.plannedActivities,
        preventionSafety: projectFixture.preventionSafety,
        marketingCampaign: projectFixture.marketingCampaign,
        sustainableDevelopment: projectFixture.sustainableDevelopment
      }

      await updateProjectGoals()

      expect(projectService.updateProject).not.toHaveBeenCalled()
    })
  })

  describe('submitProject', () => {
    it('doit passer le statut du projet à PROJECT_PROCESSING', async () => {
      await submitProject()

      expect(projectService.updateProjectStatus).toHaveBeenCalledWith(1, 'PROJECT_PROCESSING')
    })
  })

  describe('initProjectCommissionFunds', () => {
    it('doit conserver les fonds du projet rattachés à la commission sélectionnée', () => {
      projectCommission.value = 1
      projectStore.projectCommissionFunds = [makeCommissionFund({commissionFund: 1}), makeCommissionFund({id: 2, commissionFund: 3})]
      commissionStore.commissionFunds = commissionFundsFixture

      initProjectCommissionFunds()

      expect(projectCommissionFunds.value).toEqual([1, 3])
    })

    it('doit retourner une liste vide si le projet n a aucun fonds', () => {
      projectCommission.value = 1
      commissionStore.commissionFunds = commissionFundsFixture

      initProjectCommissionFunds()

      expect(projectCommissionFunds.value).toEqual([])
    })

    it('doit retourner une liste vide pour une commission sans fonds existants', () => {
      projectCommission.value = 2
      projectStore.projectCommissionFunds = [makeCommissionFund({commissionFund: 1})]
      commissionStore.commissionFunds = commissionFundsFixture

      initProjectCommissionFunds()

      expect(projectCommissionFunds.value).toEqual([])
    })
  })

  describe('canManageProjectCommissionFund', () => {
    beforeEach(() => {
      fundStore.funds = fundsFixture
      commissionStore.commissionFunds = commissionFundsFixture
    })

    it('doit retourner true si l utilisateur appartient à l institution du fonds', () => {
      profileStore.user = managerUser

      expect(canManageProjectCommissionFund(1)).toBe(true)
    })

    it('doit retourner false si l utilisateur n appartient pas à l institution du fonds', () => {
      profileStore.user = studentUser

      expect(canManageProjectCommissionFund(1)).toBe(false)
    })

    it('doit retourner false si le fonds est inconnu', () => {
      profileStore.user = managerUser

      expect(canManageProjectCommissionFund(999)).toBe(false)
    })
  })

  describe('validateProjectCommissionFund', () => {
    it('doit valider le fonds via le service', async () => {
      await validateProjectCommissionFund(1, 2)

      expect(projectService.updateProjectCommissionFund).toHaveBeenCalledWith(1, 2, {isValidatedByAdmin: true})
    })

    it('doit propager une erreur du service', async () => {
      vi.mocked(projectService.updateProjectCommissionFund).mockRejectedValueOnce(new Error('SERVICE_ERROR'))

      await expect(validateProjectCommissionFund(1, 2)).rejects.toThrow('SERVICE_ERROR')
    })
  })

  describe('rejectProjectCommissionFund', () => {
    it('doit refuser le fonds via le service', async () => {
      await rejectProjectCommissionFund(1, 2)

      expect(projectService.updateProjectCommissionFund).toHaveBeenCalledWith(1, 2, {isValidatedByAdmin: false})
    })
  })

  describe('updateAmountEarned', () => {
    it('doit mettre à jour le montant obtenu via le service', async () => {
      await updateAmountEarned(1, 2, 150)

      expect(projectService.updateProjectCommissionFund).toHaveBeenCalledWith(1, 2, {amountEarned: 150})
    })
  })

  describe('initProjectCommissionFundsDetail', () => {
    it('doit remplacer les montants undefined par zéro', async () => {
      const fund = {
        ...makeCommissionFund(),
        amountAskedPreviousEdition: undefined,
        amountEarnedPreviousEdition: undefined,
        amountAsked: undefined
      } as unknown as ProjectCommissionFundBase
      projectCommissionFundsDetail.value = [fund]

      await nextTick()

      expect(projectCommissionFundsDetail.value[0]).toMatchObject({
        amountAskedPreviousEdition: 0,
        amountEarnedPreviousEdition: 0,
        amountAsked: 0
      })
    })

    it('doit remplacer les montants null par zéro', async () => {
      const fund = {
        ...makeCommissionFund(),
        amountAskedPreviousEdition: null,
        amountEarnedPreviousEdition: null,
        amountAsked: null
      } as unknown as ProjectCommissionFundBase
      projectCommissionFundsDetail.value = [fund]

      await nextTick()

      expect(projectCommissionFundsDetail.value[0].amountAskedPreviousEdition).toBe(0)
      expect(projectCommissionFundsDetail.value[0].amountEarnedPreviousEdition).toBe(0)
      expect(projectCommissionFundsDetail.value[0].amountAsked).toBe(0)
    })

    it('doit laisser inchangés des montants déjà définis', async () => {
      const fund = makeCommissionFund({amountAsked: 500})
      projectCommissionFundsDetail.value = [fund]

      await nextTick()

      expect(projectCommissionFundsDetail.value[0].amountAsked).toBe(500)
    })
  })
})
