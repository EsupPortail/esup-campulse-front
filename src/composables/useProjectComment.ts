import {ref} from 'vue'
import type {CreateProjectComment, ProjectComment, UpdateProjectComment} from '#/project'
import * as projectService from '@/services/ProjectService'

const comments = ref<ProjectComment[]>([])
const newComment = ref<{ text: string, isVisible: boolean }>({
  text: '',
  isVisible: false
})

// old = postNewProjectComment
async function createProjectComment(projectId: number, comment: CreateProjectComment): Promise<void> {
  if (!comment.text) return
  await projectService.createProjectComment(projectId, comment)
}

// old = patchProjectComment
async function updateProjectComment(projectId: number, comment: UpdateProjectComment): Promise<void> {
  await projectService.updateProjectComment(projectId, comment)
}

export default function useProjectComment() {

  async function getProjectComments(projectId: number): Promise<void> {
    comments.value = await projectService.getProjectComments(projectId)
  }

  return {
    getProjectComments,
    createProjectComment,
    newComment,
    comments,
    updateProjectComment
  }
}
