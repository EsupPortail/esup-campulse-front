import {ref} from 'vue'
import type {Document} from '#/documents'
import {useAxios} from '@/composables/useAxios'

const documents = ref<Document[]>([])

export default function () {

    const {axiosPublic, axiosAuthenticated} = useAxios()
    //const projectStore = useProjectStore()
    //const userStore = useUserStore()

    async function getDocuments() {
        if (!documents.value?.length) {
            documents.value = (await axiosPublic.get<Document[]>('/documents/')).data
        }
    }

    return {
        getDocuments,
        documents
    }
}
