import {ref} from 'vue'
import type {Document, ProcessDocument} from '#/documents'
import {useAxios} from '@/composables/useAxios'
import {useProjectStore} from '@/stores/useProjectStore'
import {useUserStore} from '@/stores/useUserStore'

const documentTypes = ref<Document[]>([])

const processDocuments = ref<ProcessDocument[]>([])

const documentUploads = ref<ProcessDocument[]>([])

export default function() {

    const {axiosPublic, axiosAuthenticated} = useAxios()
    const projectStore = useProjectStore()
    const userStore = useUserStore()

    // INIT

    // REQUIRED DOCUMENTS PER PROCESS
    const initProcessProjectDocuments = (process: 'DOCUMENT_PROJECT') => {
        processDocuments.value = []
        const documents = documentTypes.value.filter(obj => obj.processType === process)
        documents.forEach((document) => {
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

    // GET
    async function getDocumentTypes() {
        if (!documentTypes.value?.length) {
            documentTypes.value = (await axiosPublic.get<Document[]>('/documents/')).data
        }
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

    // POST
    async function postProjectDocuments(associationId: number | undefined) {
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

    // DELETE
    async function deleteDocumentUpload(documentId: number) {
        await axiosAuthenticated.delete(`/documents/uploads/${documentId}`)
        const documentIndex = documentUploads.value.findIndex(obj => obj.id === documentId)
        documentUploads.value.splice(documentIndex, 1)
    }

    async function getFile(pathFile: string) {
        return (await axiosAuthenticated.get(pathFile, {responseType: 'blob'})).data
    }

    return {
        getDocumentTypes,
        documentTypes,
        processDocuments,
        initProcessProjectDocuments,
        postProjectDocuments,
        initDocumentUploads,
        documentUploads,
        deleteDocumentUpload,
        getFile
    }
}
