import {ref, watch} from 'vue'
import type {ProjectAmount, ProjectBasicInfos, ProjectBudget, ProjectCommissionDate, ProjectGoals} from '#/project'
import {useProjectStore} from '@/stores/useProjectStore'
import useUtility from '@/composables/useUtility'
import {useAxios} from '@/composables/useAxios'
import useCommissions from '@/composables/useCommissions'

const projectBasicInfos = ref<ProjectBasicInfos>(
    {
        name: '',
        plannedStartDate: '',
        plannedEndDate: '',
        location: '',
        user: null,
        association: null
    }
)

const projectCategories = ref<number[]>([])

const projectBudget = ref<ProjectBudget>(
    {
        budgetPreviousEdition: null,
        targetAudience: '',
        typeTargetAudience: '',
        amountTargetAudience: null,
        amountStudentsTargetAudience: null,
        ticketPrice: null,
        individualCost: null
    }
)

const projectAmounts = ref<ProjectAmount[]>([])

const projectGoals = ref<ProjectGoals>(
    {
        goals: '',
        summary: '',
        plannedActivities: '',
        preventionSafety: '',
        marketingCampaign: '',
    }
)

// Used to store values of commission dates v-model in SubmitProjectView
const projectCommissionDatesModel = ref<number[]>([])

const projectCommissionDates = ref<ProjectCommissionDate[]>([])

export default function () {

    const projectStore = useProjectStore()
    const {axiosAuthenticated} = useAxios()
    const {commissionDates} = useCommissions()


    // INIT DATA
    const initProjectBasicInfos = () => {
        const {formatDate} = useUtility()
        projectBasicInfos.value.name = projectStore.project?.name as string
        projectBasicInfos.value.plannedStartDate = formatDate(projectStore.project?.plannedStartDate as string) as string
        projectBasicInfos.value.plannedEndDate = formatDate(projectStore.project?.plannedEndDate as string) as string
        projectBasicInfos.value.location = projectStore.project?.location as string
        projectBasicInfos.value.user = projectStore.project?.user as number | null
        projectBasicInfos.value.association = projectStore.project?.association as number | null
    }

    const initProjectCategories = () => {
        projectCategories.value = projectStore.project?.categories.map(category => category.id) as number[]
    }

    const initProjectCommissionDates = () => {
        projectCommissionDates.value = projectCommissionDatesModel.value.map(commissionDate => (
            {
                project: projectStore.project?.id as number,
                commissionDate: commissionDate,
                isFirstEdition: true,
                amountAskedPreviousEdition: 0,
                amountEarnedPreviousEdition: 0,
                amountAsked: 0,
                amountEarned: 0
            }
        ))
    }
    watch(() => projectCommissionDatesModel.value.length, initProjectCommissionDates)

    const initProjectAmounts = () => {
        projectAmounts.value = []
        projectCommissionDatesModel.value.forEach(function (commissionDate) {
            const commissionId = commissionDates.value.find(obj => obj.id === commissionDate)?.commission
            if (commissionId && !projectAmounts.value.find(obj => obj.commissionId === commissionId)) {
                projectAmounts.value.push({
                    commissionId,
                    commissionDate: commissionDate,
                    amountAskedPreviousEdition: 0,
                    amountEarnedPreviousEdition: 0,
                    amountAsked: 0,
                    amountEarned: 0
                })
            }
        })
    }
    watch(() => projectCommissionDatesModel.value.length, initProjectAmounts)

    const initProjectGoals = () => {
        projectGoals.value.goals = projectStore.project?.goals as string
        projectGoals.value.summary = projectStore.project?.summary as string
        projectGoals.value.plannedActivities = projectStore.project?.plannedActivities as string
        projectGoals.value.preventionSafety = projectStore.project?.preventionSafety as string
        projectGoals.value.marketingCampaign = projectStore.project?.marketingCampaign as string
    }

    // POST NEW PROJECT WITH PROJECT BASIC INFOS
    async function postNewProject() {
        const dataToPost = JSON.parse(JSON.stringify(projectBasicInfos.value))
        dataToPost.plannedStartDate += 'T00:00:00.000Z'
        dataToPost.plannedEndDate += 'T00:00:00.000Z'
        projectStore.project = (await axiosAuthenticated.post('/projects/', dataToPost)).data
    }

    async function postProjectCommissionDates() {
        for (let i = 0; i < projectCommissionDates.value.length; i++) {
            await axiosAuthenticated.post('/projects/commission_dates',
                {
                    project: projectStore.project?.id,
                    commissionDate: projectCommissionDates.value[i].commissionDate
                }
            )
        }
    }

    async function postProjectCategories() {
        for (let i = 0; i < projectCategories.value.length; i++) {
            await axiosAuthenticated.post('/projects/categories',
                {
                    project: projectStore.project?.id,
                    category: projectCategories.value[i]
                }
            )
        }
    }


    return {
        projectBasicInfos,
        projectBudget,
        projectCommissionDates,
        initProjectBasicInfos,
        postNewProject,
        projectCategories,
        initProjectCategories,
        projectCommissionDatesModel,
        projectAmounts,
        postProjectCommissionDates,
        initProjectGoals,
        projectGoals,
        postProjectCategories
    }
}
