import {ref} from 'vue'
import type {Document, DocumentProcessType, ProcessDocument} from '#/documents'
import {useAxios} from '@/composables/useAxios'
import {useProjectStore} from '@/stores/useProjectStore'
import useCharters from '@/composables/useCharters'
import type {AxiosInstance} from 'axios'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {useUserStore} from '@/stores/useUserStore'

const documents = ref<Document[]>([])

const processDocuments = ref<ProcessDocument[]>([])

const documentUploads = ref<ProcessDocument[]>([])

const MAX_FILE_SIZE = 8388608
const MAX_FILES = 10

export default function () {
    const {axiosPublic, axiosAuthenticated} = useAxios()
    const projectStore = useProjectStore()
    const userManagerStore = useUserManagerStore()
    const userStore = useUserStore()

    // Init documents to work on
    const initProcessDocuments = (filterByFund?: boolean, funds?: number[]) => {
        processDocuments.value = []
        documents.value.forEach((document) => {
            let initDocument = false
            if (!filterByFund) {
                initDocument = true
            } else {
                if (funds?.length && document.fund) {
                    if (funds?.includes(document.fund)) {
                        initDocument = true
                    }
                } else {
                    initDocument = true
                }
            }
            if (initDocument) {
                processDocuments.value.push({
                    document: document.id,
                    isMultiple: document.isMultiple,
                    description: document.description,
                    pathFile: document.isMultiple ? [] : undefined,
                    isRequiredInProcess: document.isRequiredInProcess,
                    mimeTypes: document.mimeTypes,
                    pathTemplate: document.pathTemplate
                })
            }
        })
    }

    const initProjectDocumentUploads = () => {
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

    const initCharterDocumentUploads = () => {
        const {charterDocuments} = useCharters()
        documentUploads.value = []
        const documentIds = processDocuments.value.map((document) => (document.document))
        charterDocuments.value.forEach((document) => {
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

    const initManagedUserDocumentUploads = () => {
        documentUploads.value = []
        const documentIds = processDocuments.value.map((document) => (document.document))
        userManagerStore.userDocuments.forEach((document) => {
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

    const initUserDocumentUploads = () => {
        documentUploads.value = []
        const documentIds = processDocuments.value.map((document) => (document.document))
        userStore.userDocuments.forEach((document) => {
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
    async function getDocuments(processes: DocumentProcessType[] | 'all') {
        let url = '/documents/'
        if (processes !== 'all') url += `?process_types=${processes.join(',')}`
        documents.value = (await axiosPublic.get<Document[]>(url)).data
    }

    // Get student certificate for registration
    async function getStudentCertificate() {
        const url = '/documents/?process_types=DOCUMENT_USER'
        documents.value = (await axiosPublic.get<Document[]>(url)).data
    }

    class DocumentUpload {
        file: Blob
        association: string
        user: string
        document: string
        project: string

        constructor(file: Blob, associationId: number | undefined, username: string | undefined, document: number) {
            this.file = file
            this.association = associationId ? associationId.toString() : ''
            this.user = username ?? ''
            this.document = document.toString()
            this.project = projectStore.project?.id.toString() as string
        }

        formData() {
            const newForm = new FormData()
            newForm.append('pathFile', this.file)
            newForm.append('document', this.document)
            if (this.project) {
                newForm.append('project', this.project)
            }
            if (this.association) newForm.append('association', this.association)
            else newForm.append('user', this.user)
            return newForm
        }
    }

    // Post document uploads
    async function uploadDocuments(associationId: number | undefined, username: string | undefined, publicRequest: boolean) {
        let instance = axiosAuthenticated as AxiosInstance
        if (publicRequest) instance = axiosPublic as AxiosInstance
        for (let i = 0; i < processDocuments.value.length; i++) {

            if (processDocuments.value[i].pathFile) {

                if (processDocuments.value[i].isMultiple) {
                    const files = processDocuments.value[i].pathFile as Blob[] | []

                    for (let j = 0; j < files.length; j++) {
                        const documentUpload = new DocumentUpload(files[j], associationId, username,
                            processDocuments.value[i].document as number)
                        const documentData = documentUpload.formData()
                        await instance.post('/documents/uploads', documentData)
                    }
                } else {
                    const file = processDocuments.value[i].pathFile as Blob
                    const documentUpload = new DocumentUpload(file, associationId, username,
                        processDocuments.value[i].document as number)
                    const documentData = documentUpload.formData()
                    await instance.post('/documents/uploads', documentData)
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

    // Generate link to uploaded doc with authentification
    // TODO test
    async function createUploadedFileLink(pathFile: string, name: string) {
        const file = await getFile(pathFile)
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(file)
        link.download = name
        document.body.appendChild(link)
        link.click()
        link.remove()
    }

    return {
        getDocuments,
        documents,
        processDocuments,
        initProcessDocuments,
        uploadDocuments,
        initProjectDocumentUploads,
        documentUploads,
        deleteDocumentUpload,
        getFile,
        DocumentUpload,
        createUploadedFileLink,
        initCharterDocumentUploads,
        getStudentCertificate,
        initManagedUserDocumentUploads,
        initUserDocumentUploads,
        MAX_FILES,
        MAX_FILE_SIZE
    }
}
