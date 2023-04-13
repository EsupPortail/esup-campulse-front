import {ref, watch} from 'vue'
import type {Project, ProjectBasicInfos, ProjectBudget, ProjectCommissionDate, ProjectGoals} from '#/project'
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
        budgetPreviousEdition: 0,
        targetAudience: '',
        typeTargetAudience: '',
        amountTargetAudience: 0,
        amountStudentsTargetAudience: 0,
        ticketPrice: 0,
        individualCost: 0
    }
)

// Used to store values of commission dates v-model in SubmitProjectView
const projectCommissionDatesModel = ref<number[]>([])

const projectCommissionDates = ref<ProjectCommissionDate[]>([])

const projectGoals = ref<ProjectGoals>(
    {
        goals: '',
        summary: '',
        plannedActivities: '',
        preventionSafety: '',
        marketingCampaign: '',
    }
)

export default function () {

    const projectStore = useProjectStore()
    const {axiosAuthenticated} = useAxios()
    const {commissionDatesLabels} = useCommissions()
    const {arraysAreEqual} = useUtility()


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
        projectCategories.value = projectStore.projectCategories.map(category => category.category) as number[]
    }

    // Used to init commission dates in select (submit project step 2)
    const initProjectCommissionDatesModel = () => {
        projectCommissionDatesModel.value = projectStore.projectCommissionDates.map(commissionDate => commissionDate.commissionDate)
    }

    // Used to check if only 1 commission date per commission is selected (submit project step 2)
    watch(() => projectCommissionDatesModel.value.length, () => {
        commissionDatesLabels.value.forEach((label) => {
            label.disable = false
        })
        projectCommissionDatesModel.value.forEach((commissionDate) => {
            const label = commissionDatesLabels.value.find(obj => obj.value === commissionDate)
            const duplicateLabels = commissionDatesLabels.value.filter(obj => obj.commission === label?.commission)
            if (duplicateLabels.length) {
                duplicateLabels.forEach((duplicateLabel) => {
                    if (duplicateLabel.value !== commissionDate) duplicateLabel.disable = true
                })
            }
        })
    })

    const initProjectCommissionDates = () => {
        projectCommissionDates.value = JSON.parse(JSON.stringify(projectStore.projectCommissionDates))
    }

    const initProjectBudget = () => {
        projectBudget.value.targetAudience = projectStore.project?.targetAudience as string
        projectBudget.value.typeTargetAudience = projectStore.project?.typeTargetAudience as string
        projectBudget.value.amountTargetAudience = projectStore.project?.amountTargetAudience.toString() as string
        projectBudget.value.amountStudentsTargetAudience = projectStore.project?.amountStudentsTargetAudience.toString() as string
        projectBudget.value.ticketPrice = projectStore.project?.ticketPrice.toString() as string
        projectBudget.value.individualCost = projectStore.project?.individualCost.toString() as string
    }

    const initProjectGoals = () => {
        projectGoals.value.goals = projectStore.project?.goals as string
        projectGoals.value.summary = projectStore.project?.summary as string
        projectGoals.value.plannedActivities = projectStore.project?.plannedActivities as string
        projectGoals.value.preventionSafety = projectStore.project?.preventionSafety as string
        projectGoals.value.marketingCampaign = projectStore.project?.marketingCampaign as string
    }

    // POSTS
    async function postNewProject() {
        const dataToPost = JSON.parse(JSON.stringify(projectBasicInfos.value))
        dataToPost.plannedStartDate += 'T00:00:00.000Z'
        dataToPost.plannedEndDate += 'T00:00:00.000Z'
        projectStore.project = (await axiosAuthenticated.post('/projects/', dataToPost)).data
    }

    // UPDATES = POSTS AND DELETES
    async function updateProjectCommissionDates() {
        const oldCommissionDates = projectStore.projectCommissionDates.map(commissionDate => commissionDate.commissionDate)
        const newCommissionDates = projectCommissionDatesModel.value
        if (!arraysAreEqual(oldCommissionDates, newCommissionDates)) {
            let commissionDatesToPost = newCommissionDates.filter(x => oldCommissionDates.indexOf(x) === -1)
            commissionDatesToPost = commissionDatesToPost.filter((element, index) => {
                return commissionDatesToPost.indexOf(element) === index
            })
            for (let i = 0; i < commissionDatesToPost.length; i++) {
                await axiosAuthenticated.post('/projects/commission_dates',
                    {
                        project: projectStore.project?.id,
                        commissionDate: commissionDatesToPost[i]
                    }
                )
            }
            const commissionDatesToDelete = oldCommissionDates.filter(x => newCommissionDates.indexOf(x) === -1)
            for (let i = 0; i < commissionDatesToDelete.length; i++) {
                await axiosAuthenticated.delete(`/projects/${projectStore.project?.id}/commission_dates/${commissionDatesToDelete[i]}`)
            }
        }
    }

    async function updateProjectCategories() {
        const oldCategories = projectStore.projectCategories.map(cat => cat.category)
        const newCategories = projectCategories.value
        if (!arraysAreEqual(oldCategories, newCategories)) {
            let categoriesToPost = newCategories.filter(x => oldCategories.indexOf(x) === -1)
            categoriesToPost = categoriesToPost.filter((element, index) => {
                return categoriesToPost.indexOf(element) === index
            })
            for (let i = 0; i < categoriesToPost.length; i++) {
                await axiosAuthenticated.post('/projects/categories',
                    {
                        project: projectStore.project?.id,
                        category: categoriesToPost[i]
                    }
                )
            }
            const categoriesToDelete = oldCategories.filter(x => newCategories.indexOf(x) === -1)
            for (let i = 0; i < categoriesToDelete.length; i++) {
                await axiosAuthenticated.delete(`/projects/${projectStore.project?.id}/categories/${categoriesToDelete[i]}`)
            }
        }
    }

    // PATCHES
    async function patchProjectBasicInfos() {
        let dataToPatch = {}
        if (projectBasicInfos.value.name !== projectStore.project?.name) {
            dataToPatch = Object.assign(dataToPatch, {['name']: projectBasicInfos.value.name})
        }
        if (projectBasicInfos.value.plannedStartDate !== projectStore.project?.plannedStartDate.slice(0, 10)) {
            dataToPatch = Object.assign(dataToPatch, {['plannedStartDate']: projectBasicInfos.value.plannedStartDate + 'T00:00:00.000Z'})
        }
        if (projectBasicInfos.value.plannedEndDate !== projectStore.project?.plannedEndDate.slice(0, 10)) {
            dataToPatch = Object.assign(dataToPatch, {['plannedEndDate']: projectBasicInfos.value.plannedEndDate + 'T00:00:00.000Z'})
        }
        if (projectBasicInfos.value.location !== projectStore.project?.location) {
            dataToPatch = Object.assign(dataToPatch, {['location']: projectBasicInfos.value.location})
        }

        if (Object.entries(dataToPatch).length) {
            projectStore.project = (await axiosAuthenticated.patch(`/projects/${projectStore.project?.id}`, dataToPatch)).data
        }
    }

    async function patchProjectBudget() {
        let dataToPatch = {}
        for (const [key, value] of Object.entries(projectBudget.value)) {
            const numbers = ['amountTargetAudience', 'amountStudentsTargetAudience', 'ticketPrice', 'individualCost']
            if (numbers.indexOf(key) !== -1) {
                if (parseInt(value as string) !== projectStore.project?.[key as keyof typeof projectStore.project]) {
                    dataToPatch = Object.assign(dataToPatch, {[key]: parseInt(value as string)})
                }
            } else {
                if (value !== projectStore.project?.[key as keyof typeof projectStore.project]) {
                    dataToPatch = Object.assign(dataToPatch, {[key]: value})
                }
            }
            if (Object.entries(dataToPatch).length) {
                projectStore.project = (await axiosAuthenticated.patch(`/projects/${projectStore.project?.id}`, dataToPatch)).data
            }
        }
    }

    async function patchProjectCommissionDates(isFirstEdition: boolean) {
        for (let i = 0; i < projectCommissionDates.value.length; i++) {
            let dataToPatch = {}
            const oldCommission = projectStore.projectCommissionDates.find(obj => obj.commissionDate === projectCommissionDatesModel.value[i])
            const newCommission = projectCommissionDates.value[i]
            newCommission.isFirstEdition = isFirstEdition

            for (const [key, value] of Object.entries(newCommission)) {
                if (value !== oldCommission?.[key as keyof typeof oldCommission]) {
                    dataToPatch = Object.assign(dataToPatch, {[key]: value})
                }
            }
            if (Object.entries(dataToPatch).length) {
                await axiosAuthenticated.patch(`/projects/${projectStore.project?.id}/commission_dates/${projectCommissionDatesModel.value[i]}`, dataToPatch)
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
        if (Object.entries(dataToPatch).length) {
            projectStore.project = (await axiosAuthenticated.patch(`/projects/${projectStore.project?.id}`, dataToPatch)).data
        }
    }

    async function submitProject() {
        projectStore.project = (await axiosAuthenticated.patch<Project>(`/projects/${projectStore.project?.id}`, {projectStatus: 'PROJECT_PROCESSING'})).data
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
        updateProjectCommissionDates,
        initProjectGoals,
        projectGoals,
        updateProjectCategories,
        patchProjectBasicInfos,
        initProjectCommissionDatesModel,
        initProjectBudget,
        patchProjectBudget,
        patchProjectCommissionDates,
        initProjectCommissionDates,
        patchProjectGoals,
        submitProject
    }
}
