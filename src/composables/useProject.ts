import {ref, watch} from 'vue'
import type {ProjectBudget, ProjectCommissionFund, ProjectGoals, ProjectInfos, ProjectStatus} from '#/project'
import {useProjectStore} from '@/stores/useProjectStore'
import useUtility from '@/composables/useUtil'
import {useProfileStore} from '@/stores/useProfileStore'
import useDocumentUploads from '@/composables/useDocumentUpload'
import useCommissions from '@/composables/useCommissionFund'
import {useCommissionStore} from '@/stores/useCommissionStore'

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

export default function useProject() {

  const projectStore = useProjectStore()
  const profileStore = useProfileStore()
  const commissionStore = useCommissionStore()
  const {arraysAreEqual, formatDate, reverseDate} = useUtility()
  const {processDocuments} = useDocumentUploads()
  const {selectedCommissionFundLabels} = useCommissions()


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
    projectCommissionFundsDetail.value = JSON.parse(JSON.stringify(projectStore.projectCommissionFunds))
    projectBudget.value.targetAudience = projectStore.project?.targetAudience as string
    projectBudget.value.amountStudentsAudience = projectStore.project?.amountStudentsAudience.toString() as string
    projectBudget.value.amountAllAudience = projectStore.project?.amountAllAudience.toString() as string
    projectBudget.value.ticketPrice = projectStore.project?.ticketPrice.toString() as string
    projectBudget.value.studentTicketPrice = projectStore.project?.studentTicketPrice.toString() as string
    projectBudget.value.individualCost = projectStore.project?.individualCost.toString() as string
    projectBudget.value.budgetPreviousEdition = projectStore.project?.budgetPreviousEdition.toString() as string
  }

  const initProjectCommissionFundsDetail = () => {
    projectCommissionFundsDetail.value.forEach(projectCommissionFund => {
      projectCommissionFund.amountAskedPreviousEdition = (projectCommissionFund.amountAskedPreviousEdition ?? 0).toString()
      projectCommissionFund.amountEarnedPreviousEdition = (projectCommissionFund.amountEarnedPreviousEdition ?? 0).toString()
      projectCommissionFund.amountAsked = (projectCommissionFund.amountAsked ?? 0).toString()
    })
  }
  watch(() => projectCommissionFundsDetail.value, initProjectCommissionFundsDetail)

  const initProjectGoals = () => {
    projectGoals.value.goals = projectStore.project?.goals as string
    projectGoals.value.summary = projectStore.project?.summary as string
    projectGoals.value.plannedActivities = projectStore.project?.plannedActivities as string
    projectGoals.value.preventionSafety = projectStore.project?.preventionSafety as string
    projectGoals.value.marketingCampaign = projectStore.project?.marketingCampaign as string
    projectGoals.value.sustainableDevelopment = projectStore.project?.sustainableDevelopment as string
  }

  // REINITIALIZE FORM
  const reInitSubmitProjectForm = () => {
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

  const initProjectFunds = () => {
    projectFunds.value = []
    projectCommissionFunds.value.forEach(projectCommissionFund => {
      const commissionFund = commissionFunds.value.find(commissionFund => commissionFund.id === projectCommissionFund)
      if (commissionFund) {
        projectFunds.value.push(commissionFund.fund)
      }
    })
  }

  // POSTS
  async function postNewProject(associationId: number | undefined) {
    if (associationId) projectInfos.value.association = associationId
    else projectInfos.value.user = profileStore.user?.id as number
    let dataToPost = {}
    for (const [key, value] of Object.entries(projectInfos.value)) {
      if (!value) continue
      dataToPost = Object.assign(dataToPost, {[key]: value + (key.includes('Date') ? 'T00:00:00.000Z' : '')})
    }
    projectStore.project = (await axiosAuthenticated.post('/projects/', dataToPost)).data
  }

  // UPDATES = POSTS AND DELETES
  async function updateProjectCommission() {
    const oldCommissionFunds: number[] = projectStore.projectCommissionFunds.map(x => x.commissionFund)
    const newCommissionFunds: number[] = projectCommissionFunds.value as number[]
    if (arraysAreEqual(oldCommissionFunds, newCommissionFunds)) return
    const commissionFundsToDelete = oldCommissionFunds.filter(x => newCommissionFunds.indexOf(x) === -1)
    for (const commissionFund of commissionFundsToDelete) {
      const url = `/projects/${projectStore.project?.id}/commission_funds/${commissionFund}`
      await axiosAuthenticated.delete(url)
    }
    const commissionFundsToPost = newCommissionFunds.filter(x => oldCommissionFunds.indexOf(x) === -1)
    for (const commissionFund of commissionFundsToPost) {
      await axiosAuthenticated.post('/projects/commission_funds',
        {
          project: projectStore.project?.id,
          commissionFund
        }
      )
    }
  }

  async function updateProjectCategory() {
    const oldCategory = projectStore.project?.categories[0]?.id
    const newCategory = projectCategory.value
    if (oldCategory === newCategory) return
    if (oldCategory) {
      const deleteUrl = `/projects/${projectStore.project?.id}/categories/${oldCategory}`
      await axiosAuthenticated.delete(deleteUrl)
    }
    if (newCategory) {
      const postUrl = '/projects/categories'
      await axiosAuthenticated.post(postUrl, {
        project: projectStore.project?.id,
        category: newCategory,
      })
    }
  }

  // PATCHES
  async function patchProjectBasicInfos() {
    let dataToPatch = {}
    if (projectInfos.value.name !== projectStore.project?.name) {
      dataToPatch = Object.assign(dataToPatch, {['name']: projectInfos.value.name})
    }
    if (projectInfos.value.plannedStartDate !== projectStore.project?.plannedStartDate.slice(0, 10)) {
      dataToPatch = Object.assign(dataToPatch, {['plannedStartDate']: projectInfos.value.plannedStartDate + 'T00:00:00.000Z'})
    }
    if (projectInfos.value.plannedEndDate !== projectStore.project?.plannedEndDate.slice(0, 10)) {
      dataToPatch = Object.assign(dataToPatch, {['plannedEndDate']: projectInfos.value.plannedEndDate + 'T00:00:00.000Z'})
    }
    if (projectInfos.value.plannedLocation !== projectStore.project?.plannedLocation) {
      dataToPatch = Object.assign(dataToPatch, {['plannedLocation']: projectInfos.value.plannedLocation})
    }
    if (projectInfos.value.associationUser !== projectStore.project?.associationUser?.id) {
      dataToPatch = Object.assign(dataToPatch, {['associationUser']: projectInfos.value.associationUser})
    }
    if (Object.entries(dataToPatch).length) {
      projectStore.project = (await axiosAuthenticated.patch(`/projects/${projectStore.project?.id}`, dataToPatch)).data
    }
  }

  async function patchProjectBudget(isFirstEdition: boolean) {
    let dataToPatch = {}
    for (const [key, value] of Object.entries(projectBudget.value)) {
      const numbers = ['amountStudentsAudience', 'amountAllAudience', 'ticketPrice', 'studentTicketPrice', 'individualCost']
      if (numbers.includes(key)) {
        if (Number.parseInt(value as string) !== projectStore.project?.[key as keyof typeof projectStore.project]) {
          dataToPatch = Object.assign(dataToPatch, {[key]: Number.parseInt(value as string)})
        }
      } else if (key === 'budgetPreviousEdition') {
        if (isFirstEdition && projectStore.project && projectStore.project.budgetPreviousEdition > 0) {
          dataToPatch = Object.assign(dataToPatch, {[key]: 0})
        } else {
          if (Number.parseInt(value as string) !== projectStore.project?.[key as keyof typeof projectStore.project]) {
            dataToPatch = Object.assign(dataToPatch, {[key]: Number.parseInt(value as string)})
          }
        }
      } else {
        if (value !== projectStore.project?.[key as keyof typeof projectStore.project]) {
          dataToPatch = Object.assign(dataToPatch, {[key]: value})
        }
      }
    }
    if (Object.entries(dataToPatch).length) {
      projectStore.project = (await axiosAuthenticated.patch(`/projects/${projectStore.project?.id}`, dataToPatch)).data
    }
  }

  async function patchProjectCommissionFunds(isFirstEdition: boolean) {
    for (const projectCommissionFund of projectCommissionFundsDetail.value) {
      let dataToPatch = {}
      const oldCommissionFund = projectStore.projectCommissionFunds
        .find(obj => obj.id === projectCommissionFund.id)
      const newCommissionFund = projectCommissionFund
      newCommissionFund.isFirstEdition = isFirstEdition

      const numbers = ['amountAskedPreviousEdition', 'amountEarnedPreviousEdition', 'amountAsked']

      for (const [key, value] of Object.entries(newCommissionFund)) {
        if (key === 'isFirstEdition' && value === true && value !== oldCommissionFund?.[key as keyof typeof oldCommissionFund]) {
          dataToPatch = Object.assign(dataToPatch, {[key]: value})
          dataToPatch = Object.assign(dataToPatch, {amountAskedPreviousEdition: 0})
          dataToPatch = Object.assign(dataToPatch, {amountEarnedPreviousEdition: 0})
          dataToPatch = Object.assign(dataToPatch, {amountAsked: newCommissionFund.amountAsked})
        } /*else if (key === 'isFirstEdition') {
                    dataToPatch = Object.assign(dataToPatch, {[key]: isFirstEdition})
                }*/ else {
          if (numbers.includes(key)) {
            if (Number.parseInt(value as string) !== oldCommissionFund?.[key as keyof typeof oldCommissionFund]) {
              dataToPatch = Object.assign(dataToPatch, {[key]: Number.parseInt(value as string)})
            }
          } else {
            if (value !== oldCommissionFund?.[key as keyof typeof oldCommissionFund]) {
              dataToPatch = Object.assign(dataToPatch, {[key]: value})
            }
          }
        }
      }
      if (Object.entries(dataToPatch).length) {
        const url = `/projects/${projectStore.project?.id}/commission_funds/${projectCommissionFund.commissionFund}`
        await axiosAuthenticated.patch(url, dataToPatch)
      }
    }
  }

  async function patchProjectGoals() {
    let dataToPatch = {}
    for (const [key, value] of Object.entries(projectGoals.value)) {
      if (value !== projectStore.project?.[key as keyof typeof projectStore.project]) {
        dataToPatch = Object.assign(dataToPatch, {[key]: value})
      }
    }
    const hasDataToPatch: boolean = !!Object.entries(dataToPatch).length
    if (!hasDataToPatch) return
    const url = `/projects/${projectStore.project?.id}`
    projectStore.project = (await axiosAuthenticated.patch(url, dataToPatch)).data
  }

  async function submitProject() {
    const url = `/projects/${projectStore.project?.id}/status`
    await axiosAuthenticated.patch(url, {projectStatus: 'PROJECT_PROCESSING'})
  }

  async function deleteProject(id: number) {
    await axiosAuthenticated.delete(`/projects/${id}`)
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


  return {
    projectInfos,
    projectBudget,
    projectCommission,
    initProjectBasicInfos,
    postNewProject,
    projectCategory,
    updateProjectCommission,
    initProjectGoals,
    projectGoals,
    updateProjectCategory,
    patchProjectBasicInfos,
    initProjectBudget,
    patchProjectBudget,
    patchProjectCommissionFunds,
    patchProjectGoals,
    submitProject,
    reInitSubmitProjectForm,
    projectCommissionFunds,
    projectCommissionFundsDetail,
    reInitProjectCommissionFunds,
    //initProjectAssociationUsersLabels,
    //projectAssociationUsersLabels,
    initProjectCommissionFundsDetail,
    deleteProject,
    projectFunds,
    initProjectFunds,
    projectId,
    projectProcessingDate,
    initProjectCommissionFunds,
    projectStatuses
  }
}
