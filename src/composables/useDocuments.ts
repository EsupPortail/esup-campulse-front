import {ref} from 'vue'
import type {Document} from '#/documents'
import {useAxios} from '@/composables/useAxios'

const documents = ref<Document[]>([])

export default function () {

    const {axiosPublic, axiosAuthenticated} = useAxios()

    const libraryProcesses = ['CHARTER_ASSOCIATION', 'CHARTER_ASSOCIATION_INSTITUTION', 'CHARTER_PROJECT_COMMISSION', 'NO_PROCESS']

    async function getLibraryDocuments() {
        documents.value = (await axiosPublic.get<Document[]>(`/documents/?process_types=${libraryProcesses.join(',')}`)).data
    }

    async function postNewDocument(name: string, file: Blob) {
        const newDocument = new FormData()
        newDocument.append('name', name)
        newDocument.append('pathTemplate', file)
        await axiosAuthenticated.post('/documents/', newDocument)
    }

    async function patchDocument(id: number, name: string, file: Blob) {
        const newDocument = new FormData()
        newDocument.append('name', name)
        newDocument.append('pathTemplate', file)
        await axiosAuthenticated.patch(`/documents/${id}`, newDocument)
    }

    async function deleteDocument(id: number) {
        await axiosAuthenticated.delete(`/documents/${id}`)
    }

    return {
        getLibraryDocuments,
        documents,
        postNewDocument,
        patchDocument,
        deleteDocument,
        libraryProcesses
    }
}
