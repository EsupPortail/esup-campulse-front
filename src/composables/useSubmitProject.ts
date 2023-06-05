import {ref} from 'vue'
import type {
    ProjectAssociation,
    ProjectBasicInfos,
    ProjectBudget,
    ProjectCommissionDate,
    ProjectGoals,
    ProjectReview
} from '#/project'
import {useProjectStore} from '@/stores/useProjectStore'
import useUtility from '@/composables/useUtility'
import {useAxios} from '@/composables/useAxios'
import {useUserStore} from '@/stores/useUserStore'
import useProjectDocuments from '@/composables/useProjectDocuments'
import {useAssociationStore} from '@/stores/useAssociationStore'
import useUsers from '@/composables/useUsers'

const projectBasicInfos = ref<ProjectBasicInfos>(
    {
        name: '',
        plannedStartDate: '',
        plannedEndDate: '',
        plannedLocation: '',
        otherFirstName: '',
        otherLastName: '',
        otherEmail: '',
        user: null,
        association: null
    }
)

const projectAssociation = ref<ProjectAssociation>({
    address: '',
    zipcode: '',
    city: '',
    country: '',
    phone: '',
    email: '',
    presidentNames: '',
    presidentPhone: '',
    presidentEmail: '',
    name: ''
})

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

const projectReview = ref<ProjectReview>(
    {
        id: null,
        name: '',
        otherFirstName: '',
        otherLastName: '',
        otherEmail: '',
        otherPhone: '',
        user: null,
        association: null,
        outcome: '',
        income: '',
        realStartDate: '',
        realEndDate: '',
        realLocation: '',
        review: '',
        impactStudents: '',
        description: '',
        difficulties: '',
        improvements: ''
    }
)

export default function () {

    const projectStore = useProjectStore()
    const userStore = useUserStore()
    const associationStore = useAssociationStore()
    const {axiosAuthenticated} = useAxios()
    const {arraysAreEqual, formatDate} = useUtility()
    const {processDocuments} = useProjectDocuments()
    const {initInfosToPatch, updateUserInfos} = useUsers()


    // INIT DATA
    const initProjectBasicInfos = () => {
        const {formatDate} = useUtility()
        projectBasicInfos.value.name = projectStore.project?.name as string
        projectBasicInfos.value.plannedStartDate = formatDate(projectStore.project?.plannedStartDate as string) as string
        projectBasicInfos.value.plannedEndDate = formatDate(projectStore.project?.plannedEndDate as string) as string
        projectBasicInfos.value.plannedLocation = projectStore.project?.plannedLocation as string
        projectBasicInfos.value.otherFirstName = projectStore.project?.otherFirstName as string
        projectBasicInfos.value.otherLastName = projectStore.project?.otherLastName as string
        projectBasicInfos.value.otherEmail = projectStore.project?.otherEmail as string
        projectBasicInfos.value.user = projectStore.project?.user as number | null
        projectBasicInfos.value.association = projectStore.project?.association as number | null
    }

    const initProjectAssociation = () => {
        if (associationStore.association) {
            projectAssociation.value.name = associationStore.association.name as string
            projectAssociation.value.address = associationStore.association.address as string
            projectAssociation.value.zipcode = associationStore.association.zipcode as string
            projectAssociation.value.city = associationStore.association.city as string
            projectAssociation.value.country = associationStore.association.country as string
            projectAssociation.value.phone = associationStore.association.phone as string
            projectAssociation.value.email = associationStore.association.email as string
            projectAssociation.value.presidentNames = associationStore.association.presidentNames as string
            projectAssociation.value.presidentPhone = associationStore.association.presidentPhone as string
        }
    }

    const initProjectCategories = () => {
        projectCategories.value = projectStore.projectCategories.map(category => category.category) as number[]
    }

    // Used to init commission dates in select (submit project step 2)
    const initProjectCommissionDatesModel = () => {
        projectCommissionDatesModel.value = projectStore.projectCommissionDates.map(commissionDate => commissionDate.commissionDate)
    }

    const initProjectCommissionDates = () => {
        projectCommissionDates.value = JSON.parse(JSON.stringify(projectStore.projectCommissionDates))
        projectCommissionDates.value.forEach((commissionDate) => {
            commissionDate.amountAskedPreviousEdition = commissionDate.amountAskedPreviousEdition?.toString()
            commissionDate.amountEarnedPreviousEdition = commissionDate.amountEarnedPreviousEdition?.toString()
            commissionDate.amountAsked = commissionDate.amountAsked?.toString()
        })
    }

    const initProjectBudget = () => {
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

    const initProjectReview = () => {
        if (projectStore.projectReview && projectStore.project) {
            projectReview.value.id = projectStore.projectReview.id
            projectReview.value.name = projectStore.projectReview.name
            projectReview.value.outcome = projectStore.projectReview.outcome ?
                projectStore.projectReview.outcome.toString() : '0'
            projectReview.value.income = projectStore.projectReview.income ?
                projectStore.projectReview.income.toString() : '0'
            projectReview.value.association = projectStore.projectReview.association
            projectReview.value.user = projectStore.projectReview.user
            projectReview.value.realStartDate = formatDate(projectStore.projectReview.realStartDate ??
                projectStore.project.plannedStartDate) as string
            projectReview.value.realEndDate = formatDate(projectStore.projectReview.realEndDate ??
                projectStore.project.plannedEndDate) as string
            projectReview.value.realLocation = projectStore.projectReview.realLocation ?? projectStore.project.plannedLocation
            projectReview.value.otherFirstName = projectStore.projectReview.otherFirstName ?? projectStore.project.otherFirstName
            projectReview.value.otherLastName = projectStore.projectReview.otherLastName ?? projectStore.project.otherLastName
            projectReview.value.otherEmail = projectStore.projectReview.otherEmail ?? projectStore.project.otherEmail
            projectReview.value.otherPhone = projectStore.projectReview.otherPhone ?? projectStore.project.otherPhone
            projectReview.value.review = projectStore.projectReview.review
            projectReview.value.impactStudents = projectStore.projectReview.impactStudents
            projectReview.value.description = projectStore.projectReview.description
            projectReview.value.difficulties = projectStore.projectReview.difficulties
            projectReview.value.improvements = projectStore.projectReview.improvements
        }
    }

    // REINITIALIZE FORM
    const reInitSubmitProjectForm = () => {
        projectBasicInfos.value.name = ''
        projectBasicInfos.value.plannedStartDate = ''
        projectBasicInfos.value.plannedEndDate = ''
        projectBasicInfos.value.plannedLocation = ''
        projectBasicInfos.value.otherFirstName = ''
        projectBasicInfos.value.otherLastName = ''
        projectBasicInfos.value.otherEmail = ''
        projectBasicInfos.value.user = null
        projectBasicInfos.value.association = null
        projectCategories.value = []
        projectCommissionDates.value = []
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
        if (projectBasicInfos.value.plannedLocation !== projectStore.project?.plannedLocation) {
            dataToPatch = Object.assign(dataToPatch, {['plannedLocation']: projectBasicInfos.value.plannedLocation})
        }
        if (projectBasicInfos.value.otherFirstName !== projectStore.project?.otherFirstName) {
            dataToPatch = Object.assign(dataToPatch, {['otherFirstName']: projectBasicInfos.value.otherFirstName})
        }
        if (projectBasicInfos.value.otherLastName !== projectStore.project?.otherLastName) {
            dataToPatch = Object.assign(dataToPatch, {['otherLastName']: projectBasicInfos.value.otherLastName})
        }
        if (projectBasicInfos.value.otherEmail !== projectStore.project?.otherEmail) {
            dataToPatch = Object.assign(dataToPatch, {['otherEmail']: projectBasicInfos.value.otherEmail})
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

    async function patchProjectCommissionDates(isFirstEdition: boolean) {
        for (let i = 0; i < projectCommissionDates.value.length; i++) {
            let dataToPatch = {}
            const oldCommission = projectStore.projectCommissionDates.find(obj => obj.commissionDate === projectCommissionDatesModel.value[i])
            const newCommission = projectCommissionDates.value[i]
            newCommission.isFirstEdition = isFirstEdition

            const numbers = ['amountAskedPreviousEdition', 'amountEarnedPreviousEdition', 'amountAsked']

            for (const [key, value] of Object.entries(newCommission)) {
                if (key === 'isFirstEdition' && value === true && value !== oldCommission?.[key as keyof typeof oldCommission]) {
                    dataToPatch = Object.assign(dataToPatch, {[key]: value})
                    dataToPatch = Object.assign(dataToPatch, {amountAskedPreviousEdition: 0})
                    dataToPatch = Object.assign(dataToPatch, {amountEarnedPreviousEdition: 0})
                    dataToPatch = Object.assign(dataToPatch, {amountAsked: newCommission.amountAsked})
                } else {
                    if (numbers.includes(key)) {
                        if (parseInt(value as string) !== oldCommission?.[key as keyof typeof oldCommission]) {
                            dataToPatch = Object.assign(dataToPatch, {[key]: parseInt(value as string)})
                        }
                    } else {
                        if (value !== oldCommission?.[key as keyof typeof oldCommission]) {
                            dataToPatch = Object.assign(dataToPatch, {[key]: value})

                        }
                    }
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
        await axiosAuthenticated.patch(`/projects/${projectStore.project?.id}/status`, {projectStatus: 'PROJECT_PROCESSING'})
    }

    async function patchProjectReview() {
        let projectReviewDataToPatch = {}
        const numbers = ['outcome', 'income']
        const dates = ['realStartDate', 'realEndDate']
        const privateFields = ['id', 'association', 'user', 'name']
        for (const [key, value] of Object.entries(projectReview.value)) {
            if (!privateFields.includes(key) && (numbers.includes(key) ?
                parseInt(value as string) : value) !== projectStore.projectReview?.[key as keyof typeof projectStore.projectReview]) {
                projectReviewDataToPatch = Object.assign(projectReviewDataToPatch,
                    {[key]: (numbers.includes(key) ? parseInt(value as string) : value) + (dates.includes(key) ? 'T00:00:00.000Z' : '')})
            }
        }
        // API call
        if (Object.entries(projectReviewDataToPatch).length) {
            projectStore.projectReview = (await axiosAuthenticated.patch(`/projects/${projectReview.value.id}/review`,
                projectReviewDataToPatch)).data
        }

        // Patch association if needed and if the bearer is an association
        if (projectReview.value.association) {
            let associationDataToPatch = {}
            const keys = ['presidentNames', 'presidentPhone']
            for (const [key, value] of Object.entries(projectAssociation)) {
                if (keys.includes(key) && value !== projectStore.projectReview?.[key as keyof typeof projectStore.projectReview]) {
                    associationDataToPatch = Object.assign(associationDataToPatch, {[key]: value})
                }
            }
            // API call
            if (Object.entries(associationDataToPatch).length) {
                associationStore.association = (await axiosAuthenticated.patch(`/associations/${projectReview.value.association}`,
                    associationDataToPatch)).data
            }
        }

        // Patch user if the bearer is an individual and if the address has been modified
        else {
            initInfosToPatch(userStore.user)
            await updateUserInfos(userStore.user, false)
        }
    }

    async function submitProjectReview() {
        await axiosAuthenticated.patch(`/projects/${projectStore.project?.id}/status`, {projectStatus: 'PROJECT_REVIEW_PROCESSING'})
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
        submitProject,
        reInitSubmitProjectForm,
        patchProjectReview,
        submitProjectReview,
        projectAssociation,
        initProjectAssociation,
        projectReview,
        initProjectReview
    }
}
