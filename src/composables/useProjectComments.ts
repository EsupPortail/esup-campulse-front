import {ref} from 'vue'
import type {ProjectComment} from '#/project'
import {useAxios} from '@/composables/useAxios'

const comments = ref<ProjectComment[]>([])
const comment = ref<ProjectComment>()

export default function () {
    const {axiosAuthenticated} = useAxios()

    async function getAllProjectsComments() {
        comments.value = (await axiosAuthenticated.get<ProjectComment[]>('/projects/comments')).data
    }

    async function getProjectComments(projectId: number) {
        comments.value = (await axiosAuthenticated.get<ProjectComment[]>(`/projects/${projectId}/comments`)).data
    }

    async function getProjectComment(projectId: number, commentId: number) {
        comment.value = (await axiosAuthenticated.get<ProjectComment>(`/projects/${projectId}/comments/${commentId}`)).data
    }

    async function newProjectComment(text: string) {
        await axiosAuthenticated.post('/projects/comments', {text})
    }

    async function patchProjectComment(text: string, projectId: number, commentId: number) {
        if (text !== comment.value?.text) {
            comment.value = (await axiosAuthenticated.patch(`/projects/${projectId}/comments/${commentId}`)).data
        }
    }

    async function deleteProjectComment(projectId: number, commentId: number) {
        await axiosAuthenticated.delete(`projects/${projectId}/comments/${commentId}`)
    }

    return {
        getAllProjectsComments,
        getProjectComments,
        getProjectComment,
        newProjectComment,
        patchProjectComment,
        deleteProjectComment
    }
}

