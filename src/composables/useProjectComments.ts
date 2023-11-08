import {ref} from 'vue'
import type {ProjectComment} from '#/project'
import {useAxios} from '@/composables/useAxios'
import {useUserStore} from '@/stores/useUserStore'

const comments = ref<ProjectComment[]>([])
const newComment = ref<{ text: string, isVisible: boolean }>({
    text: '',
    isVisible: false
})

export default function () {
    const {axiosAuthenticated} = useAxios()
    const userStore = useUserStore()


    async function getProjectComments(projectId: number) {
        comments.value = (await axiosAuthenticated.get<ProjectComment[]>(`/projects/${projectId}/comments`)).data
    }

    async function postNewProjectComment(project: number, comment: { text: string, isVisible: boolean }) {
        if (comment.text) {
            const data = {
                project,
                isVisible: comment.isVisible,
                text: comment.text,
                user: userStore.user?.id
            }
            await axiosAuthenticated.post('/projects/comments', data)
        }
    }

    async function patchProjectComment(projectId: number, comment: { id: number, text: string, isVisible: boolean }) {
        await axiosAuthenticated.patch(`/projects/${projectId}/comments/${comment.id}`, {
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
