import {ref} from 'vue'
import type {
    ProjectBasicInfos,
    ProjectBudget,
    ProjectCommissionFund,
    ProjectGoals
} from '#/project'
import {useProjectStore} from '@/stores/useProjectStore'
import useUtility from '@/composables/useUtility'
import {useAxios} from '@/composables/useAxios'
import {useUserStore} from '@/stores/useUserStore'
import useProjectDocuments from '@/composables/useProjectDocuments'
import useCommissions from '@/composables/useCommissions'

const projectBasicInfos = ref<ProjectBasicInfos>(
    {
        name: '',
        plannedStartDate: '',
        plannedEndDate: '',
        plannedLocation: '',
        contactFirstName: '',
        contactLastName: '',
        contactEmail: '',
        user: null,
        association: null
    }
)

const projectCategories = ref<number[]>([])

const projectBudget = ref<ProjectBudget>(
    {
        budgetPreviousEdition: 0,
        targetAudience: '',
        amountStudentsAudience: 0,
        amountAllAudience: 0,
        ticketPrice: 0,
        individualCost: 0
    }
)

// Used to store the chosen commission (v-model in SubmitProjectView)
const projectCommission = ref<number | null>(null)

// Used to store the chosen commission funds (v-model in SubmitProjectView)
const projectCommissionFunds = ref<number[]>([])

// Used to copy projectCommissionFunds from the store and check changes
const projectCommissionFundsDetail = ref<ProjectCommissionFund[]>([])

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
    const userStore = useUserStore()
    const {axiosAuthenticated} = useAxios()
    const {arraysAreEqual} = useUtility()
    const {processDocuments} = useProjectDocuments()
    const {initChosenCommissionFundsLabels} = useCommissions()


    // INIT DATA
    const initProjectBasicInfos = () => {
        const {formatDate} = useUtility()
        projectBasicInfos.value.name = projectStore.project?.name as string
        projectBasicInfos.value.plannedStartDate = formatDate(projectStore.project?.plannedStartDate as string) as string
        projectBasicInfos.value.plannedEndDate = formatDate(projectStore.project?.plannedEndDate as string) as string
        projectBasicInfos.value.plannedLocation = projectStore.project?.plannedLocation as string
        projectBasicInfos.value.contactFirstName = projectStore.project?.contactFirstName as string
        projectBasicInfos.value.contactLastName = projectStore.project?.contactLastName as string
        projectBasicInfos.value.contactEmail = projectStore.project?.contactEmail as string
        projectBasicInfos.value.user = projectStore.project?.user as number | null
        projectBasicInfos.value.association = projectStore.project?.association as number | null
    }

    const initProjectCategories = () => {
        projectCategories.value = projectStore.projectCategories.map(category => category.category) as number[]
    }

    const reInitProjectCommissionFunds = () => {
        if (projectCommission.value) {
            projectCommissionFunds.value = []
            initChosenCommissionFundsLabels(projectCommission.value)
        }
    }

    const initProjectBudget = () => {
        projectCommissionFundsDetail.value = JSON.parse(JSON.stringify(projectStore.projectCommissionFunds))
        projectBudget.value.targetAudience = projectStore.project?.targetAudience as string
        projectBudget.value.amountStudentsAudience = projectStore.project?.amountStudentsAudience.toString() as string
        projectBudget.value.amountAllAudience = projectStore.project?.amountAllAudience.toString() as string
        projectBudget.value.ticketPrice = projectStore.project?.ticketPrice.toString() as string
        projectBudget.value.individualCost = projectStore.project?.individualCost.toString() as string
        projectBudget.value.budgetPreviousEdition = projectStore.project?.budgetPreviousEdition.toString() as string
    }

    const initProjectGoals = () => {
        projectGoals.value.goals = projectStore.project?.goals as string
        projectGoals.value.summary = projectStore.project?.summary as string
        projectGoals.value.plannedActivities = projectStore.project?.plannedActivities as string
        projectGoals.value.preventionSafety = projectStore.project?.preventionSafety as string
        projectGoals.value.marketingCampaign = projectStore.project?.marketingCampaign as string
    }

    // REINITIALIZE FORM
    const reInitSubmitProjectForm = () => {
        projectBasicInfos.value.name = ''
        projectBasicInfos.value.plannedStartDate = ''
        projectBasicInfos.value.plannedEndDate = ''
        projectBasicInfos.value.plannedLocation = ''
        projectBasicInfos.value.contactFirstName = ''
        projectBasicInfos.value.contactLastName = ''
        projectBasicInfos.value.contactEmail = ''
        projectBasicInfos.value.user = null
        projectBasicInfos.value.association = null
        projectCategories.value = []
        projectCommission.value = null
        projectCommissionFunds.value = []
        projectBudget.value.targetAudience = ''
        projectBudget.value.amountStudentsAudience = 0
        projectBudget.value.amountAllAudience = 0
        projectBudget.value.ticketPrice = 0
        projectBudget.value.individualCost = 0
        projectBudget.value.budgetPreviousEdition = 0
        projectGoals.value.goals = ''
        projectGoals.value.summary = ''
        projectGoals.value.plannedActivities = ''
        projectGoals.value.preventionSafety = ''
        projectGoals.value.marketingCampaign = ''
        processDocuments.value = []
    }

    // POSTS
    async function postNewProject(associationId: number | undefined) {
        if (associationId) projectBasicInfos.value.association = associationId
        else projectBasicInfos.value.user = userStore.user?.id as number
        let dataToPost = {}
        for (const [key, value] of Object.entries(projectBasicInfos.value)) {
            if (value) {
                dataToPost = Object.assign(dataToPost, {[key]: value + (key.includes('Date') ? 'T00:00:00.000Z' : '')})
            }
        }
        projectStore.project = (await axiosAuthenticated.post('/projects/', dataToPost)).data
    }

    // UPDATES = POSTS AND DELETES
    async function updateProjectCommission() {
        const oldCommissionFunds: number[] = projectStore.projectCommissionFunds.map(x => x.commissionFund)
        const newCommissionFunds: number[] = projectCommissionFunds.value as number[]
        if (!arraysAreEqual(oldCommissionFunds, newCommissionFunds)) {
            const commissionFundsToDelete = oldCommissionFunds.filter(x => newCommissionFunds.indexOf(x) === -1)
            for (let i = 0; i < commissionFundsToDelete.length; i++) {
                await axiosAuthenticated.delete(`/projects/${projectStore.project?.id}/commission_funds/${commissionFundsToDelete[i]}`)
            }
            const commissionFundsToPost = newCommissionFunds.filter(x => oldCommissionFunds.indexOf(x) === -1)
            for (let i = 0; i < commissionFundsToPost.length; i++) {
                await axiosAuthenticated.post('/projects/commission_funds',
                    {
                        project: projectStore.project?.id,
                        commissionFund: commissionFundsToPost[i]
                    }
                )
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
        if (projectBasicInfos.value.plannedLocation !== projectStore.project?.plannedLocation) {
            dataToPatch = Object.assign(dataToPatch, {['plannedLocation']: projectBasicInfos.value.plannedLocation})
        }
        if (projectBasicInfos.value.contactFirstName !== projectStore.project?.contactFirstName) {
            dataToPatch = Object.assign(dataToPatch, {['contactFirstName']: projectBasicInfos.value.contactFirstName})
        }
        if (projectBasicInfos.value.contactLastName !== projectStore.project?.contactLastName) {
            dataToPatch = Object.assign(dataToPatch, {['contactLastName']: projectBasicInfos.value.contactLastName})
        }
        if (projectBasicInfos.value.contactEmail !== projectStore.project?.contactEmail) {
            dataToPatch = Object.assign(dataToPatch, {['contactEmail']: projectBasicInfos.value.contactEmail})
        }

        if (Object.entries(dataToPatch).length) {
            projectStore.project = (await axiosAuthenticated.patch(`/projects/${projectStore.project?.id}`, dataToPatch)).data
        }
    }

    async function patchProjectBudget(isFirstEdition: boolean) {
        let dataToPatch = {}
        for (const [key, value] of Object.entries(projectBudget.value)) {
            const numbers = ['amountStudentsAudience', 'amountAllAudience', 'ticketPrice', 'individualCost']
            if (numbers.includes(key)) {
                if (parseInt(value as string) !== projectStore.project?.[key as keyof typeof projectStore.project]) {
                    dataToPatch = Object.assign(dataToPatch, {[key]: parseInt(value as string)})
                }
            } else if (key === 'budgetPreviousEdition') {
                if (isFirstEdition && projectStore.project && projectStore.project.budgetPreviousEdition > 0) {
                    dataToPatch = Object.assign(dataToPatch, {[key]: 0})
                } else {
                    if (parseInt(value as string) !== projectStore.project?.[key as keyof typeof projectStore.project]) {
                        dataToPatch = Object.assign(dataToPatch, {[key]: parseInt(value as string)})
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
        for (let i = 0; i < projectCommissionFundsDetail.value.length; i++) {
            let dataToPatch = {}
            const oldCommissionFund = projectStore.projectCommissionFunds
                .find(obj => obj.id === projectCommissionFundsDetail.value[i].id)
            const newCommissionFund = projectCommissionFundsDetail.value[i]
            newCommissionFund.isFirstEdition = isFirstEdition

            const numbers = ['amountAskedPreviousEdition', 'amountEarnedPreviousEdition', 'amountAsked']

            for (const [key, value] of Object.entries(newCommissionFund)) {
                if (key === 'isFirstEdition' && value === true && value !== oldCommissionFund?.[key as keyof typeof oldCommissionFund]) {
                    dataToPatch = Object.assign(dataToPatch, {[key]: value})
                    dataToPatch = Object.assign(dataToPatch, {amountAskedPreviousEdition: 0})
                    dataToPatch = Object.assign(dataToPatch, {amountEarnedPreviousEdition: 0})
                    dataToPatch = Object.assign(dataToPatch, {amountAsked: newCommissionFund.amountAsked})
                } else {
                    if (numbers.includes(key)) {
                        if (parseInt(value as string) !== oldCommissionFund?.[key as keyof typeof oldCommissionFund]) {
                            dataToPatch = Object.assign(dataToPatch, {[key]: parseInt(value as string)})
                        }
                    } else {
                        if (value !== oldCommissionFund?.[key as keyof typeof oldCommissionFund]) {
                            dataToPatch = Object.assign(dataToPatch, {[key]: value})

                        }
                    }
                }
            }
            if (Object.entries(dataToPatch).length) {
                await axiosAuthenticated.patch(`/projects/${projectStore.project?.id}/commission_funds/${projectCommissionFunds.value?.[i]}`, dataToPatch)
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
        await axiosAuthenticated.patch(`/projects/${projectStore.project?.id}/status`, {projectStatus: 'PROJECT_PROCESSING'})
    }


    return {
        projectBasicInfos,
        projectBudget,
        projectCommission,
        initProjectBasicInfos,
        postNewProject,
        projectCategories,
        initProjectCategories,
        updateProjectCommission,
        initProjectGoals,
        projectGoals,
        updateProjectCategories,
        patchProjectBasicInfos,
        initProjectBudget,
        patchProjectBudget,
        patchProjectCommissionFunds,
        patchProjectGoals,
        submitProject,
        reInitSubmitProjectForm,
        projectCommissionFunds,
        projectCommissionFundsDetail,
        reInitProjectCommissionFunds
    }
}
