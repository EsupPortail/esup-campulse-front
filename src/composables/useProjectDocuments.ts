import {ref} from 'vue'
import type {Document, DocumentProcessType, ProcessDocument} from '#/documents'
import {useAxios} from '@/composables/useAxios'
import {useProjectStore} from '@/stores/useProjectStore'
import {useUserStore} from '@/stores/useUserStore'

const documents = ref<Document[]>([])

const processDocuments = ref<ProcessDocument[]>([])

const documentUploads = ref<ProcessDocument[]>([])

export default function () {

    const {axiosPublic, axiosAuthenticated} = useAxios()
    const projectStore = useProjectStore()
    const userStore = useUserStore()

    // Init documents to work on
    const initProcessProjectDocuments = () => {
        processDocuments.value = []
        documents.value.forEach((document) => {
            processDocuments.value.push({
                document: document.id,
                isMultiple: document.isMultiple,
                description: document.description,
                pathFile: document.isMultiple ? [] : undefined,
                isRequiredInProcess: document.isRequiredInProcess,
                mimeTypes: document.mimeTypes
            })
        })
    }

    const initDocumentUploads = () => {
        documentUploads.value = []
        const documentIds = processDocuments.value.map((document) => (document.document))
        projectStore.projectDocuments.forEach((document) => {
            if (documentIds.includes(document.document)) {
                documentUploads.value.push({
                    id: document.id,
                    document: document.document,
                    pathFile: import.meta.env.VITE_APP_BASE_URL + document.pathFile as string,
                    name: document.name as string
                })
            }
        })
    }

    // Get documents
    async function getDocuments(process: DocumentProcessType | 'all') {
        let url = '/documents/'
        if (process !== 'all') url += `?process_type=${process}`
        documents.value = (await axiosPublic.get<Document[]>(url)).data
    }

    class DocumentUpload {
        file: Blob
        association: string
        user: string
        document: string
        project: string

        constructor(file: Blob, associationId: number | undefined, document: number) {
            this.file = file
            this.association = associationId ? associationId.toString() : ''
            this.user = associationId ? '' : userStore.user?.id.toString() as string
            this.document = document.toString()
            this.project = projectStore.project?.id.toString() as string
        }

        formData() {
            const newForm = new FormData()
            newForm.append('pathFile', this.file)
            newForm.append('document', this.document)
            newForm.append('project', this.project)
            if (this.association) newForm.append('association', this.association)
            else newForm.append('user', this.user)
            return newForm
        }
    }

    // Post document uploads
    async function uploadDocuments(associationId: number | undefined) {
        for (let i = 0; i < processDocuments.value.length; i++) {

            if (processDocuments.value[i].pathFile) {

                if (processDocuments.value[i].isMultiple) {
                    const files = processDocuments.value[i].pathFile as Blob[] | []

                    for (let j = 0; j < files.length; j++) {
                        const documentUpload = new DocumentUpload(files[j], associationId, processDocuments.value[i].document as number)
                        const documentData = documentUpload.formData()
                        await axiosAuthenticated.post('/documents/uploads', documentData)
                    }
                } else {
                    const file = processDocuments.value[i].pathFile as Blob
                    const documentUpload = new DocumentUpload(file, associationId, processDocuments.value[i].document as number)
                    const documentData = documentUpload.formData()
                    await axiosAuthenticated.post('/documents/uploads', documentData)
                }
            }
        }
    }

    // Delete document
    async function deleteDocumentUpload(documentId: number) {
        await axiosAuthenticated.delete(`/documents/uploads/${documentId}`)
        const documentIndex = documentUploads.value.findIndex(obj => obj.id === documentId)
        documentUploads.value.splice(documentIndex, 1)
    }

    async function getFile(pathFile: string) {
        return (await axiosAuthenticated.get(pathFile, {responseType: 'blob'})).data
    }

    return {
        getDocuments,
        documents,
        processDocuments,
        initProcessProjectDocuments,
        uploadDocuments,
        initDocumentUploads,
        documentUploads,
        deleteDocumentUpload,
        getFile
    }
}
