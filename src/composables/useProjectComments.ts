import {ref} from 'vue'
import type {ProjectComment} from '#/project'
import {useAxios} from '@/composables/useAxios'

const comments = ref<ProjectComment[]>([])
const newComment = ref<{ text: string, isVisible: boolean }>({
    text: '',
    isVisible: false
})

export default function useProjectComments() {
    const {axiosAuthenticated} = useAxios()


    async function getProjectComments(projectId: number) {
        comments.value = (await axiosAuthenticated.get<ProjectComment[]>(`/projects/${projectId}/comments`)).data
    }

    async function postNewProjectComment(projectId: number, comment: { text: string, isVisible: boolean }) {
        if (!comment.text) return
        const url = `/projects/${projectId}/comments`
        const data = {
            text: comment.text,
            isVisible: comment.isVisible
        }
        await axiosAuthenticated.post(url, data)
    }

    async function patchProjectComment(projectId: number, comment: { id: number, text: string, isVisible: boolean }) {
        const url = `/projects/${projectId}/comments/${comment.id}`
        await axiosAuthenticated.patch(url, {
            text: comment.text,
            isVisible: comment.isVisible
        })
    }

    return {
        getProjectComments,
        postNewProjectComment,
        newComment,
        comments,
        patchProjectComment
    }
}
