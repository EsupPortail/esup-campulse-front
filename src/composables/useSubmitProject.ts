import {computed, ref} from 'vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import type {ProjectStatus} from '#/project'
import type {UploadedProcessDocument} from '#/document'
import router from '@/router'
import useProject from '@/composables/useProject'
import useUtil from '@/composables/useUtil'
import useErrors from '@/composables/useError'
import useDocumentUploads from '@/composables/useDocumentUpload'
import useCommissions from '@/composables/useCommissionFund'
import {useProjectStore} from '@/stores/useProjectStore'
import {useProfileStore} from '@/stores/useProfileStore'
import {useCommissionStore} from '@/stores/useCommissionStore'
import {useFundStore} from '@/stores/useFundStore'
import {useAssociationStore} from '@/stores/useAssociationStore'

const acceptedProjectStatuses: ProjectStatus[] = ['PROJECT_DRAFT', 'PROJECT_DRAFT_PROCESSED']

export default function useSubmitProject() {
  const projectStore = useProjectStore()
  const profileStore = useProfileStore()
  const commissionStore = useCommissionStore()
  const fundStore = useFundStore()
  const associationStore = useAssociationStore()
  const {loading, notify} = useQuasar()
  const {catchHTTPError} = useErrors()
  const {fromDateIsAnterior, CURRENCY} = useUtil()
  const {uploadDocuments, createFileLink} = useDocumentUploads()
  const {selectedCommissionFundLabels} = useCommissions()
  const {
    projectInfos,
    projectBudget,
    projectCommission,
    projectCategory,
    projectCommissionFunds,
    projectCommissionFundsDetail,
    projectGoals,
    createProject,
    updateProjectCommission,
    updateProjectInfos,
    updateProjectBudget,
    updateProjectCommissionFunds,
    updateProjectGoals,
    updateProjectCategory,
    submitProject,
    initProjectBasicInfos,
    initProjectBudget,
    initProjectGoals,
    reInitProjectCommissionFunds,
    resetSubmitProject
  } = useProject()

  const step = ref<number>(1)
  const projectId = ref<number>()
  const newProject = ref<boolean>(true)
  const newProjectPosted = ref<boolean>(false)
  const projectReEdition = ref<boolean>(false)
  const isLoaded = ref<boolean>(false)
  const applicant = ref<'association' | 'user'>('user')
  const associationId = ref<number | null>(null)

  const associationUser = computed(() => profileStore.userAssociations
    .find(obj => obj.association.id === associationId.value))

  const hasPresidentStatus = computed<boolean>(() => associationId.value !== null
    && profileStore.hasPresidentStatus(associationId.value))

  const isSite = computed<boolean>(() => !!(
    applicant.value === 'association' && associationUser.value?.association.isSite
  ))

  const datesAreLegal = computed<boolean>(() => fromDateIsAnterior(
    projectInfos.value.plannedStartDate,
    projectInfos.value.plannedEndDate,
    true
  ))

  const correctAudienceAmount = computed<boolean>(() =>
    projectBudget.value.amountStudentsAudience <= projectBudget.value.amountAllAudience)

  const commissionLabels = computed(() => commissionStore.commissionLabels ?? [])
  const commissionFunds = computed(() => commissionStore.commissionFunds)
  const funds = computed(() => fundStore.funds)
  const fundsLabels = computed(() => projectCommission.value === null ? [] :
    selectedCommissionFundLabels(projectCommission.value, isSite.value))
  const associationUserLabels = computed(() => associationStore.associationUserLabels)

  async function notifyError(error: unknown): Promise<void> {
    if (axios.isAxiosError(error) && error.response) {
      notify({
        type: 'negative',
        message: await catchHTTPError(error.response)
      })
    }
  }

  async function withErrorNotification(action: () => Promise<void> | void): Promise<void> {
    try {
      await action()
    } catch (error) {
      await notifyError(error)
    }
  }

  async function loadProjectDetail(): Promise<void> {
    if (newProject.value && !newProjectPosted.value) return
    try {
      await projectStore.getProjectDetail(projectId.value as number)
      initProjectBasicInfos()
      applicant.value = projectStore.project?.association ? 'association' : 'user'
      associationId.value = projectStore.project?.association?.id ?? null
    } catch (error) {
      await router.push({name: '404'})
      await notifyError(error)
    }
  }

  async function loadAssociationUsers(): Promise<void> {
    if (applicant.value !== 'association' || associationId.value === null) return
    const currentAssociationId = associationId.value
    await withErrorNotification(() => associationStore.getAssociationUsers(currentAssociationId))
  }

  async function loadCommissionData(): Promise<void> {
    await withErrorNotification(async () => {
      await commissionStore.getCommissions({
        isOpenToProjects: true,
        isSite: isSite.value ? undefined : false
      })
      await fundStore.getFunds()
      await commissionStore.getCommissionFunds()
      if (!newProject.value) {
        await projectStore.getProjectCommissionFunds({
          filter: 'project',
          projectId: projectStore.project?.id as number
        })
        const firstCommissionFund = projectStore.projectCommissionFunds[0]
        projectCommission.value = firstCommissionFund
          ? commissionFunds.value.find(obj => obj.id === firstCommissionFund.commissionFund)?.commission ?? null
          : null
        if (projectCommission.value !== null) {
          projectCommissionFunds.value = projectStore.projectCommissionFunds.map(x => x.commissionFund)
        }
      }
    })
  }

  async function loadProjectBudget(): Promise<void> {
    await withErrorNotification(async () => {
      await projectStore.getProjectCommissionFunds({
        filter: 'project',
        projectId: projectStore.project?.id as number
      })
      initProjectBudget()
    })
  }

  function loadProjectGoals(): void {
    initProjectGoals()
  }

  function onCommissionChange(): void {
    reInitProjectCommissionFunds(isSite.value)
  }

  async function submitBasicInfos(nextStep: number): Promise<void> {
    await withErrorNotification(async () => {
      if (newProject.value && !newProjectPosted.value) {
        await createProject(associationId.value ?? undefined)
        newProjectPosted.value = true
        projectId.value = projectStore.project?.id
        await router.replace({name: 'SubmitProject', params: {projectId: projectId.value}})
      } else {
        await updateProjectInfos()
      }
      await updateProjectCategory()
      await loadProjectDetail()
      await loadAssociationUsers()
      step.value = nextStep
    })
  }

  async function submitCommission(nextStep: number): Promise<void> {
    await withErrorNotification(async () => {
      await updateProjectCommission()
      step.value = nextStep
    })
  }

  async function submitBudget(nextStep: number): Promise<void> {
    if (!projectStore.project) return
    await withErrorNotification(async () => {
      await updateProjectBudget(!projectReEdition.value)
      await updateProjectCommissionFunds(!projectReEdition.value)
      step.value = nextStep
    })
  }

  async function submitGoals(nextStep: number): Promise<void> {
    if (!projectStore.project) return
    await withErrorNotification(async () => {
      await updateProjectGoals()
      step.value = nextStep
    })
  }

  async function submitDocuments(nextStep: number): Promise<void> {
    if (!projectStore.project) return
    await withErrorNotification(async () => {
      await uploadDocuments(
        applicant.value === 'association' ? associationId.value : null,
        applicant.value === 'user' ? profileStore.user?.id ?? null : null
      )
      step.value = nextStep
    })
  }

  async function submitProjectForValidation(): Promise<void> {
    if (!projectStore.project) return
    await withErrorNotification(async () => {
      await submitProject()
      await router.push({
        name: 'SubmitProjectSuccessful',
        params: {projectId: projectStore.project?.id}
      })
    })
  }

  async function downloadUploadedDocument(uploadedDocument: UploadedProcessDocument): Promise<void> {
    await withErrorNotification(() => createFileLink(
      uploadedDocument.pathFile as string,
      uploadedDocument.name
    ))
  }

  async function ensureCanUpdateProject(): Promise<void> {
    if (applicant.value === 'user') return
    const associationCanSubmitProjects = associationUser.value?.association?.canSubmitProjects
    if (associationCanSubmitProjects) {
      const isReferent = projectStore.project?.associationUser?.id === associationUser.value?.id
      if (hasPresidentStatus.value || isReferent) return
    }
    await router.push({name: '404'})
  }

  async function init(routeProjectId?: number): Promise<void> {
    loading.show()
    projectId.value = routeProjectId
    newProject.value = !projectId.value
    await loadProjectDetail()
    const loadedProject = projectStore.project
    if (loadedProject && loadedProject.id === projectId.value
      && !acceptedProjectStatuses.includes(loadedProject.projectStatus)) {
      await router.push({name: '404'})
    }
    await projectStore.getProjectCategoryNames(true)
    await loadAssociationUsers()
    projectStore.projectCommissionFunds = []
    isLoaded.value = true
    await ensureCanUpdateProject()
    loading.hide()
  }

  function goToStep(nextStep: number): void {
    step.value = nextStep
  }

  function resetForm(): void {
    resetSubmitProject()
  }

  return {
    step,
    projectId,
    newProject,
    newProjectPosted,
    projectReEdition,
    isLoaded,
    applicant,
    associationId,
    associationUser,
    hasPresidentStatus,
    isSite,
    datesAreLegal,
    correctAudienceAmount,
    projectInfos,
    projectCategory,
    projectBudget,
    projectCommission,
    projectCommissionFunds,
    projectCommissionFundsDetail,
    projectGoals,
    commissionLabels,
    commissionFunds,
    funds,
    fundsLabels,
    associationUserLabels,
    CURRENCY,
    profileStore,
    projectStore,
    init,
    loadCommissionData,
    loadProjectBudget,
    loadProjectGoals,
    onCommissionChange,
    submitBasicInfos,
    submitCommission,
    submitBudget,
    submitGoals,
    submitDocuments,
    submitProjectForValidation,
    downloadUploadedDocument,
    goToStep,
    resetForm
  }
}
