import {ref} from 'vue'
import type {ProjectReview} from '#/project'
import {useProjectStore} from '@/stores/useProjectStore'
import useUtility from '@/composables/useUtility'
import {useAxios} from '@/composables/useAxios'
import {useUserStore} from '@/stores/useUserStore'
import useUsers from '@/composables/useUsers'


const projectReview = ref<ProjectReview>(
    {
        id: null,
        name: '',
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
        improvements: '',
        plannedStartDate: '',
        plannedEndDate: '',
        plannedLocation: '',
        associationUser: null,
        commissions: [],
        creationDate: '',
        editionDate: '',
        processingDate: ''
    }
)

export default function() {

    const projectStore = useProjectStore()
    const userStore = useUserStore()
    const {axiosAuthenticated} = useAxios()
    const {initInfosToPatch, updateUserInfos} = useUsers()
    const {formatDate} = useUtility()

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
            projectReview.value.realStartDate = formatDate(projectStore.projectReview.realStartDate ?
                projectStore.projectReview.realStartDate : projectStore.projectReview.plannedStartDate) as string
            projectReview.value.realEndDate = formatDate(projectStore.projectReview.realEndDate ?
                projectStore.projectReview.realEndDate : projectStore.projectReview.plannedEndDate) as string
            projectReview.value.realLocation = projectStore.projectReview.realLocation ?
                projectStore.projectReview.realLocation : projectStore.projectReview.plannedLocation
            projectReview.value.review = projectStore.projectReview.review
            projectReview.value.impactStudents = projectStore.projectReview.impactStudents
            projectReview.value.description = projectStore.projectReview.description
            projectReview.value.difficulties = projectStore.projectReview.difficulties
            projectReview.value.improvements = projectStore.projectReview.improvements
        }
    }

    async function patchProjectReview() {
        let projectReviewDataToPatch = {}
        const numbers = ['outcome', 'income']
        const dates = ['realStartDate', 'realEndDate']
        const privateFields = ['id', 'association', 'user', 'name']
        for (const [key, value] of Object.entries(projectReview.value)) {
            if (!privateFields.includes(key)) {
                if (numbers.includes(key)) {
                    if (parseInt(value as string) !== projectStore.projectReview?.[key as keyof typeof projectStore.projectReview]) {
                        projectReviewDataToPatch = Object.assign(projectReviewDataToPatch, {[key]: parseInt(value as string)})
                    }
                } else if (dates.includes(key)) {
                    if (value !== projectStore.projectReview?.[key as keyof typeof projectStore.projectReview]) {
                        projectReviewDataToPatch = Object.assign(projectReviewDataToPatch, {[key]: value + 'T00:00:00.000Z'})
                    }
                } else {
                    if (value !== projectStore.projectReview?.[key as keyof typeof projectStore.projectReview]) {
                        projectReviewDataToPatch = Object.assign(projectReviewDataToPatch, {[key]: value})
                    }
                }
            }
        }
        // API call
        if (Object.entries(projectReviewDataToPatch).length) {
            projectStore.projectReview = (await axiosAuthenticated.patch(`/projects/${projectReview.value.id}/review`,
                projectReviewDataToPatch)).data
        }
        // Patch user if the bearer is an individual and if the address has been modified
        if (projectStore.projectReview?.user) {
            initInfosToPatch(userStore.user)
            await updateUserInfos(userStore.user, false)
        }
    }

    async function submitProjectReview() {
        await axiosAuthenticated.patch(`/projects/${projectStore.project?.id}/status`, {projectStatus: 'PROJECT_REVIEW_PROCESSING'})
    }


    return {
        projectReview,
        initProjectReview,
        patchProjectReview,
        submitProjectReview
    }
}
