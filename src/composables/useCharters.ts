import {ref} from 'vue'
import {useAxios} from '@/composables/useAxios'
import type {DocumentUpload} from '#/documents'

const charterDocuments = ref<DocumentUpload[]>([])

export default function () {

    const {axiosAuthenticated} = useAxios()

    async function getCharterDocuments(associationId: number) {
        const url = `/documents/uploads?association_id=${associationId}&process_types=CHARTER_ASSOCIATION,DOCUMENT_ASSOCIATION`
        charterDocuments.value = (await axiosAuthenticated.get<DocumentUpload[]>(url)).data
    }

    async function signCharter(associationId: number) {
        await axiosAuthenticated.patch(`/associations/${associationId}/status`, {charterStatus: 'CHARTER_PROCESSING'})
    }

    return {
        getCharterDocuments,
        charterDocuments,
        signCharter
    }
}
