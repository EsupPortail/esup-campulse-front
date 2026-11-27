import {computed, ref, watch} from 'vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import type {ProjectStatus} from '#/project'
import type {Commission, CommissionFund, Fund} from '#/commission'
import type {UploadedProcessDocument} from '#/document'
import type {SelectableLabel, SelectLabel} from '#/global'
import router from '@/router'
import useProject from '@/composables/useProject'
import useUtil from '@/composables/useUtil'
import useErrors from '@/composables/useError'
import useDocumentUploads from '@/composables/useDocumentUpload'
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
  const {t} = useI18n()
  const {loading, notify} = useQuasar()
  const {catchHTTPError} = useErrors()
  const {fromDateIsAnterior, reverseDate, CURRENCY} = useUtil()
  const {uploadDocuments, createFileLink} = useDocumentUploads()
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
  const applicant = ref<'association' | 'user' | null>(null)
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

  const commissions = ref<Commission[]>([])

  const commissionFunds = ref<CommissionFund[]>([])

  const funds = ref<Fund[]>([])

  const selectableCommissionFunds = computed(() => commissionFunds.value
    .filter(commissionFund => commissionFund.commission === projectCommission.value)
    .filter(commissionFund => isSite.value
      || !funds.value.find(fund => fund.id === commissionFund.fund)?.isSite)
    .map(commissionFund => ({value: commissionFund.id, fund: commissionFund.fund})))

  const commissionOptions = computed<SelectableLabel[]>(() => commissions.value.map(commission => ({
    value: commission.id,
    label: `${commission.name} (${reverseDate(commission.commissionDate)})`,
    disable: !isSite.value && !commission.funds?.some(fund => !fund.isSite)
  })))

  const fundOptions = computed<SelectableLabel[]>(() => funds.value.map(fund => {
    const commissionFund = selectableCommissionFunds.value.find(obj => obj.fund === fund.id)
    return {
      value: commissionFund?.value ?? -fund.id,
      label: fund.acronym,
      disable: commissionFund === undefined
    }
  }))

  const associationUserLabels = computed(() => associationStore.associationUserLabels)

  const canChooseApplicant = computed<boolean>(() => newProject.value && !newProjectPosted.value)

  const associationOptions = computed<SelectLabel[]>(() => profileStore.userAssociations
    .filter(obj => obj.association.canSubmitProjects)
    .map(obj => ({label: obj.association.name, value: obj.association.id}))
    .sort((a, b) => a.label.localeCompare(b.label, 'fr')))

  async function notifyError(error: unknown): Promise<void> {
    if (axios.isAxiosError(error) && error.response) {
      notify({
        type: 'negative',
        message: await catchHTTPError(error.response)
      })
    } else {
      notify({
        type: 'negative',
        message: t('notifications.negative.error-500')
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

  watch([applicant, associationId], async ([currentApplicant, currentAssociationId]) => {
    if (!canChooseApplicant.value) return

    projectCommission.value = null
    projectCommissionFunds.value = []

    if (currentApplicant !== 'association' && currentAssociationId !== null) {
      associationId.value = null
      return
    }

    if (currentApplicant === 'association' && currentAssociationId !== null) {
      projectInfos.value.association = currentAssociationId
      projectInfos.value.user = null
      projectInfos.value.associationUser = null
      await loadAssociationUsers()
      return
    }

    projectInfos.value.association = null
    projectInfos.value.associationUser = null
    projectInfos.value.user = currentApplicant === 'user' ? profileStore.user?.id ?? null : null
  })

  async function loadCommissionData(): Promise<void> {
    await withErrorNotification(async () => {
      await commissionStore.getCommissions({isOpenToProjects: true})
      commissions.value = [...(commissionStore.commissions?.results ?? [])]
      await fundStore.getFunds()
      funds.value = [...fundStore.funds]
      await commissionStore.getCommissionFunds()
      commissionFunds.value = [...commissionStore.commissionFunds]
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

  function submitApplicant(nextStep: number): void {
    if (!projectInfos.value.name) return
    if (!applicant.value) return
    if (applicant.value === 'association'
      && (associationId.value === null || projectInfos.value.associationUser === null)) return
    step.value = nextStep
  }

  async function submitBasicInfos(nextStep: number): Promise<void> {
    if (!projectStore.project) return
    await withErrorNotification(async () => {
      await updateProjectInfos()
      await updateProjectCategory()
      await loadProjectDetail()
      await loadAssociationUsers()
      step.value = nextStep
    })
  }

  async function submitCommission(nextStep: number): Promise<void> {
    if (projectCommission.value === null || !projectCommissionFunds.value.length) return
    await withErrorNotification(async () => {
      if (newProject.value && !newProjectPosted.value) {
        await createProject(associationId.value ?? undefined)
        newProjectPosted.value = true
        projectId.value = projectStore.project?.id
        await router.replace({name: 'SubmitProject', params: {projectId: projectId.value}})
        await loadProjectDetail()
      }
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
    if (applicant.value !== 'association') return
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
    if (profileStore.user?.associations.length && !profileStore.userAssociations.length) {
      await withErrorNotification(() => profileStore.getUserAssociations())
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
    commissionOptions,
    commissionFunds,
    funds,
    fundOptions,
    associationUserLabels,
    associationOptions,
    canChooseApplicant,
    CURRENCY,
    profileStore,
    projectStore,
    init,
    loadCommissionData,
    loadProjectBudget,
    loadProjectGoals,
    onCommissionChange,
    submitApplicant,
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
