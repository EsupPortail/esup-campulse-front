import {ref} from 'vue'
import type {UpdateProjectReview} from '#/project'
import {useProjectStore} from '@/stores/useProjectStore'
import {useProfileStore} from '@/stores/useProfileStore'
import * as projectService from '@/services/ProjectService'

const projectReview = ref<UpdateProjectReview>(
  {
    outcome: null,
    income: null,
    realStartDate: '',
    realEndDate: '',
    realLocation: '',
    review: '',
    impactStudents: '',
    description: '',
    difficulties: '',
    improvements: '',
    associationUser: null
  }
)

const projectId = ref<string | undefined>()

export default function useProjectReview() {

  const projectStore = useProjectStore()
  const profileStore = useProfileStore()
  const {formatDate} = useUtil()

  const initProjectReview = () => {
    if (!projectStore.projectReview || !projectStore.project) return
    projectReview.value.outcome = projectStore.projectReview.outcome ?? 0
    projectReview.value.income = projectStore.projectReview.income ?? 0
    projectReview.value.realStartDate = formatDate(projectStore.projectReview.realStartDate ?
      projectStore.projectReview.realStartDate : projectStore.projectReview.plannedStartDate)
    projectReview.value.realEndDate = formatDate(projectStore.projectReview.realEndDate ?
      projectStore.projectReview.realEndDate : projectStore.projectReview.plannedEndDate)
    projectReview.value.realLocation = projectStore.projectReview.realLocation ?
      projectStore.projectReview.realLocation : projectStore.projectReview.plannedLocation
    projectReview.value.review = projectStore.projectReview.review
    projectReview.value.impactStudents = projectStore.projectReview.impactStudents
    projectReview.value.description = projectStore.projectReview.description
    projectReview.value.difficulties = projectStore.projectReview.difficulties
    projectReview.value.improvements = projectStore.projectReview.improvements
  }

  async function updateProjectReview() {
    const review = projectStore.projectReview
    if (!review) return
    const projectReviewDataToPatch = {}
    for (const [key, value] of Object.entries(projectReview.value)) {
      if (key === 'realStartDate' || key === 'realEndDate') {
        if (value !== formatDate(review[key as keyof typeof projectStore.projectReview] as string)) {
          projectReviewDataToPatch[key] = value + 'T00:00:00.000Z'
        }
      } else if (value !== projectStore.projectReview?.[key as keyof typeof projectStore.projectReview]) {
        projectReviewDataToPatch[key] = value
      }
    }
    if (Object.entries(projectReviewDataToPatch).length) {
      await projectStore.updateProjectReview(projectReviewDataToPatch)
    }
    if (review.user) {
      await profileStore.updateProfile()
    }
  }

  async function submitProjectReview() {
    await projectService.updateProjectStatus(projectStore.project!.id, 'PROJECT_REVIEW_PROCESSING')
  }


  return {
    projectReview,
    initProjectReview,
    updateProjectReview,
    submitProjectReview,
    projectId
  }
}
