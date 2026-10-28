import {ref, watch} from 'vue'
import type {
  ProjectBudget,
  ProjectCommissionFund,
  ProjectGoals,
  ProjectInfos,
  ProjectStatus,
  UpdateProject,
  UpdateProjectCommissionFund
} from '#/project'
import {useProjectStore} from '@/stores/useProjectStore'
import useUtility from '@/composables/useUtil'
import {useProfileStore} from '@/stores/useProfileStore'
import useDocumentUploads from '@/composables/useDocumentUpload'
import useCommissions from '@/composables/useCommissionFund'
import {useCommissionStore} from '@/stores/useCommissionStore'
import * as projectService from '@/services/ProjectService'
import {updateProjectStatus} from '@/services/ProjectService'
import {useFundStore} from '@/stores/useFundStore'

const projectStatuses: ProjectStatus[] = [
  'PROJECT_DRAFT',
  'PROJECT_DRAFT_PROCESSED',
  'PROJECT_PROCESSING',
  'PROJECT_REJECTED',
  'PROJECT_VALIDATED',
  'PROJECT_REVIEW_DRAFT',
  'PROJECT_REVIEW_PROCESSING',
  'PROJECT_REVIEW_VALIDATED',
  'PROJECT_CANCELED'
]

const projectId = ref<string | undefined>()

const projectProcessingDate = ref<string | undefined>()

const projectInfos = ref<ProjectInfos>(
  {
    name: '',
    plannedStartDate: '',
    plannedEndDate: '',
    plannedLocation: '',
    user: null,
    association: null,
    associationUser: null,
    partnerAssociation: '',
  }
)

const projectCategory = ref<number | null>(null)

const projectBudget = ref<ProjectBudget>(
  {
    budgetPreviousEdition: 0,
    targetAudience: '',
    amountStudentsAudience: 0,
    amountAllAudience: 1,
    ticketPrice: 0,
    studentTicketPrice: 0,
    individualCost: 1
  }
)

const projectCommission = ref<number | null>(null)

const projectCommissionFunds = ref<number[]>([])
const projectCommissionFundsDetail = ref<ProjectCommissionFund[]>([])

const projectFunds = ref<number[]>([])

const projectGoals = ref<ProjectGoals>(
  {
    goals: '',
    summary: '',
    plannedActivities: '',
    preventionSafety: '',
    marketingCampaign: '',
    sustainableDevelopment: '',
  }
)

async function validateProjectCommissionFund(projectId: number, commissionFundId: number) {
  await projectService.updateProjectCommissionFund(projectId, commissionFundId, {isValidatedByAdmin: true})
}

async function rejectProjectCommissionFund(projectId: number, commissionFundId: number) {
  await projectService.updateProjectCommissionFund(projectId, commissionFundId, {isValidatedByAdmin: false})
}

// old = patchAmountAsked
async function updateAmountEarned(projectId: number, commissionFundId: number, amountEarned: number) {
  await projectService.updateProjectCommissionFund(projectId, commissionFundId, {amountEarned})
}

export default function useProject() {

  const projectStore = useProjectStore()
  const profileStore = useProfileStore()
  const commissionStore = useCommissionStore()
  const fundStore = useFundStore()
  const {arraysAreEqual, formatDate, reverseDate} = useUtility()
  const {processDocuments} = useDocumentUploads()
  const {selectedCommissionFundLabels} = useCommissions()

  // todo : on en a plus besoin (commissionFunds sur le projet) ?
  /*const projectCommissionFundLabels = computed<SelectLabel[]>(() => {
    projectCommissionFunds.value.forEach(projectCommissionFund => {
      const commissionFunds = commissionStore.commissionFunds
      const fund = commissionFunds.find(obj => obj.id === projectCommissionFund.commissionFund)?.fund
      const isMemberOfFund = userStore.userFunds?.includes(fund)
      if (!isMemberOfFund) return
      const isValidatedByAdmin = projectCommissionFund.isValidatedByAdmin
      if (isValidatedByAdmin === null ||
        isValidatedByAdmin && action !== 'validate' ||
        !isValidatedByAdmin && action !== 'reject') {
        projectCommissionFundLabels.value.push({
          value: projectCommissionFund.commissionFund as number,
          label: funds.value.find(obj => obj.id === fund)?.acronym as string,
        })
      }
    })
  })*/

  const initProjectBasicInfos = () => {
    projectId.value = projectStore.project?.manualIdentifier
    projectProcessingDate.value = reverseDate(formatDate(projectStore.project?.processingDate ?? ''))
    projectInfos.value.name = projectStore.project?.name ?? ''
    projectInfos.value.plannedStartDate = formatDate(projectStore.project?.plannedStartDate ?? '')
    projectInfos.value.plannedEndDate = formatDate(projectStore.project?.plannedEndDate ?? '')
    projectInfos.value.plannedLocation = projectStore.project?.plannedLocation ?? ''
    projectInfos.value.user = projectStore.project?.user?.id
    projectInfos.value.association = projectStore.project?.association?.id
    projectInfos.value.associationUser = projectStore.project?.associationUser?.id
    projectInfos.value.partnerAssociation = projectStore.project?.partnerAssociation ?? ''
    projectCategory.value = projectStore.project?.categories[0]?.id
  }

  const reInitProjectCommissionFunds = (isSite: boolean) => {
    if (projectCommission.value) {
      projectCommissionFunds.value = []
      selectedCommissionFundLabels(projectCommission.value, isSite)
    }
  }

  const initProjectBudget = () => {
    projectCommissionFundsDetail.value = [...projectStore.projectCommissionFunds]
    projectBudget.value.targetAudience = projectStore.project?.targetAudience
    projectBudget.value.amountStudentsAudience = projectStore.project?.amountStudentsAudience
    projectBudget.value.amountAllAudience = projectStore.project?.amountAllAudience
    projectBudget.value.ticketPrice = projectStore.project?.ticketPrice
    projectBudget.value.studentTicketPrice = projectStore.project?.studentTicketPrice
    projectBudget.value.individualCost = projectStore.project?.individualCost
    projectBudget.value.budgetPreviousEdition = projectStore.project?.budgetPreviousEdition
  }

  const initProjectCommissionFundsDetail = () => {
    projectCommissionFundsDetail.value.forEach(projectCommissionFund => {
      projectCommissionFund.amountAskedPreviousEdition = (projectCommissionFund.amountAskedPreviousEdition ?? 0)
      projectCommissionFund.amountEarnedPreviousEdition = (projectCommissionFund.amountEarnedPreviousEdition ?? 0)
      projectCommissionFund.amountAsked = (projectCommissionFund.amountAsked ?? 0)
    })
  }
  watch(() => projectCommissionFundsDetail.value, initProjectCommissionFundsDetail)

  const initProjectGoals = () => {
    projectGoals.value.goals = projectStore.project?.goals
    projectGoals.value.summary = projectStore.project?.summary
    projectGoals.value.plannedActivities = projectStore.project?.plannedActivities
    projectGoals.value.preventionSafety = projectStore.project?.preventionSafety
    projectGoals.value.marketingCampaign = projectStore.project?.marketingCampaign
    projectGoals.value.sustainableDevelopment = projectStore.project?.sustainableDevelopment
  }

  const resetSubmitProject = () => {
    projectInfos.value.name = ''
    projectInfos.value.plannedStartDate = ''
    projectInfos.value.plannedEndDate = ''
    projectInfos.value.plannedLocation = ''
    projectInfos.value.user = null
    projectInfos.value.association = null
    projectInfos.value.associationUser = null
    projectInfos.value.partnerAssociation = ''
    projectCategory.value = null
    projectCommission.value = null
    projectCommissionFunds.value = []
    projectBudget.value.targetAudience = ''
    projectBudget.value.amountStudentsAudience = 0
    projectBudget.value.amountAllAudience = 1
    projectBudget.value.ticketPrice = 0
    projectBudget.value.studentTicketPrice = 0
    projectBudget.value.individualCost = 1
    projectBudget.value.budgetPreviousEdition = 0
    projectGoals.value.goals = ''
    projectGoals.value.summary = ''
    projectGoals.value.plannedActivities = ''
    projectGoals.value.preventionSafety = ''
    projectGoals.value.marketingCampaign = ''
    projectGoals.value.sustainableDevelopment = ''
    processDocuments.value = []
  }

  // todo : sera OK quand on aura les commissionFunds dans les projets
  /*const initProjectFunds = () => {
    projectFunds.value = []
    projectCommissionFunds.value.forEach(projectCommissionFund => {
      const commissionFund = commissionFunds.value.find(commissionFund => commissionFund.id === projectCommissionFund)
      if (commissionFund) {
        projectFunds.value.push(commissionFund.fund)
      }
    })
  }*/

  async function createProject(associationId?: number) {
    if (associationId) projectInfos.value.association = associationId
    else projectInfos.value.user = profileStore.user?.id
    let dataToPost = {}
    for (const [key, value] of Object.entries(projectInfos.value)) {
      if (!value) continue
      dataToPost = Object.assign(dataToPost, {[key]: value + (key.includes('Date') ? 'T00:00:00.000Z' : '')})
    }
    projectStore.project = await projectService.createProject(dataToPost)
  }

  async function updateProjectCommission() {
    const project = projectStore.project?.id
    const oldCommissionFunds: number[] = projectStore.projectCommissionFunds
      .map(x => x.commissionFund)
    const newCommissionFunds: number[] = projectCommissionFunds.value as number[]
    if (arraysAreEqual(oldCommissionFunds, newCommissionFunds)) return
    const commissionFundsToDelete = oldCommissionFunds.filter(x => !newCommissionFunds.includes(x))
    const deletePromises: Promise<void>[] = []
    for (const commissionFund of commissionFundsToDelete) {
      deletePromises.push(projectService.deleteProjectCommissionFund(project, commissionFund))
    }
    await Promise.all(deletePromises)
    const postPromises: Promise<void>[] = []
    const commissionFundsToPost = newCommissionFunds.filter(x => !oldCommissionFunds.includes(x))
    for (const commissionFund of commissionFundsToPost) {
      postPromises.push(projectService.createProjectCommissionFund({project, commissionFund}))
    }
    await Promise.all(postPromises)
  }

  async function updateProjectCategory() {
    const project = projectStore.project
    const projectId = project.id
    const oldCategory = project.categories[0]?.id
    const newCategory = projectCategory.value
    if (oldCategory === newCategory) return
    if (oldCategory) {
      await projectService.deleteProjectCategory(projectId, oldCategory)
    }
    if (newCategory) {
      await projectService.createProjectCategory({project: projectId, category: newCategory})
    }
  }

  async function updateProjectInfos() {
    const dataToPatch: Partial<UpdateProject> = {}
    if (projectInfos.value.name !== projectStore.project?.name) {
      dataToPatch.name = projectInfos.value.name
    }
    if (projectInfos.value.plannedStartDate !== projectStore.project?.plannedStartDate.slice(0, 10)) {
      dataToPatch.plannedStartDate = projectInfos.value.plannedStartDate + 'T00:00:00.000Z'
    }
    if (projectInfos.value.plannedEndDate !== projectStore.project?.plannedEndDate.slice(0, 10)) {
      dataToPatch.plannedEndDate = projectInfos.value.plannedEndDate + 'T00:00:00.000Z'
    }
    if (projectInfos.value.plannedLocation !== projectStore.project?.plannedLocation) {
      dataToPatch.plannedLocation = projectInfos.value.plannedLocation
    }
    if (projectInfos.value.associationUser !== projectStore.project?.associationUser?.id) {
      dataToPatch.associationUser = projectInfos.value.associationUser
    }
    if (!Object.entries(dataToPatch).length) return
    projectStore.project = await projectService.updateProject(projectStore.project?.id, dataToPatch)
  }

  async function updateProjectBudget(isFirstEdition: boolean) {
    const dataToPatch: Partial<UpdateProject> = {}
    for (const [key, value] of Object.entries(projectBudget.value)) {
      const numbers = ['amountStudentsAudience', 'amountAllAudience', 'ticketPrice',
        'studentTicketPrice', 'individualCost']
      if (numbers.includes(key)) {
        if (Number.parseInt(value as string) !== projectStore.project?.[key as keyof typeof projectStore.project]) {
          dataToPatch[key] = Number.parseInt(value as string)
        }
      } else if (key === 'budgetPreviousEdition') {
        if (isFirstEdition && projectStore.project && projectStore.project.budgetPreviousEdition > 0) {
          dataToPatch[key] = 0
        } else if (Number.parseInt(value as string) !== projectStore.project?.[key as keyof typeof projectStore.project]) {
          dataToPatch[key] = Number.parseInt(value as string)
        }
      } else if (value !== projectStore.project?.[key as keyof typeof projectStore.project]) {
        dataToPatch[key] = value
      }
    }
    if (!Object.entries(dataToPatch).length) return
    projectStore.project = await projectService.updateProject(projectStore.project.id, dataToPatch)
  }

  async function updateProjectCommissionFunds(isFirstEdition: boolean) {
    const promises: Promise<void>[] = []
    for (const projectCommissionFund of projectCommissionFundsDetail.value) {

      const dataToPatch: Partial<UpdateProjectCommissionFund> = {}

      const oldCommissionFund = projectStore.projectCommissionFunds
        .find(obj => obj.id === projectCommissionFund.id)
      const newCommissionFund = projectCommissionFund
      newCommissionFund.isFirstEdition = isFirstEdition

      for (const [key, value] of Object.entries(newCommissionFund)) {
        if (key === 'isFirstEdition' && value === true && value !== oldCommissionFund?.[key as keyof typeof oldCommissionFund]) {
          dataToPatch[key] = value
          dataToPatch.amountAskedPreviousEdition = 0
          dataToPatch.amountEarnedPreviousEdition = 0
          dataToPatch.amountAsked = newCommissionFund.amountAsked
        } else if (value !== oldCommissionFund?.[key as keyof typeof oldCommissionFund]) {
          dataToPatch[key] = value
        }
      }
      if (!Object.entries(dataToPatch).length) return
      promises.push(projectService.updateProjectCommissionFund(
        projectStore.project!.id,
        projectCommissionFund.commissionFund,
        dataToPatch))
    }
    await Promise.all(promises)
  }

  async function updateProjectGoals() {
    const dataToPatch: Partial<UpdateProject> = {}
    for (const [key, value] of Object.entries(projectGoals.value)) {
      if (value !== projectStore.project?.[key as keyof typeof projectStore.project]) {
        dataToPatch[key] = value
      }
    }
    if (!Object.entries(dataToPatch).length) return
    projectStore.project = await projectService.updateProject(projectStore.project!.id, dataToPatch)
  }

  async function submitProject() {
    await updateProjectStatus(projectStore.project!.id, 'PROJECT_PROCESSING')
  }

  function initProjectCommissionFunds(): void {
    const originalCommissionFunds = new Set<number>(projectStore.projectCommissionFunds
      .map(projectCommissionFund => projectCommissionFund.commissionFund))
    const originalFunds = new Set<number>(commissionStore.commissionFunds
      .filter(commissionFund => originalCommissionFunds.has(commissionFund.id))
      .map(commissionFund => commissionFund.fund))

    projectCommissionFunds.value = commissionStore.commissionFunds
      .filter(commissionFund => commissionFund.commission === projectCommission.value && originalFunds.has(commissionFund.fund))
      .map(commissionFund => commissionFund.id)
  }

  const canManageProjectCommissionFund = (commissionFund: number): boolean => {
    const fund = commissionStore.commissionFunds.find(obj => obj.id === commissionFund)?.fund
    const fundInstitution = fundStore.funds.find(obj => obj.id === fund)?.institution
    const isMemberOfFundInstitution = profileStore.user?.groups
      .find(obj => obj.institutionId === fundInstitution)
    return !!isMemberOfFundInstitution
  }


  return {
    projectInfos,
    projectBudget,
    projectCommission,
    initProjectBasicInfos,
    createProject,
    projectCategory,
    updateProjectCommission,
    initProjectGoals,
    projectGoals,
    updateProjectCategory,
    updateProjectInfos,
    initProjectBudget,
    updateProjectBudget,
    updateProjectCommissionFunds,
    updateProjectGoals,
    submitProject,
    resetSubmitProject,
    projectCommissionFunds,
    projectCommissionFundsDetail,
    reInitProjectCommissionFunds,
    //initProjectAssociationUsersLabels,
    //projectAssociationUsersLabels,
    initProjectCommissionFundsDetail,
    projectFunds,
    //initProjectFunds,
    projectId,
    projectProcessingDate,
    initProjectCommissionFunds,
    projectStatuses,
    validateProjectCommissionFund,
    rejectProjectCommissionFund,
    canManageProjectCommissionFund,
    updateAmountEarned
  }
}
