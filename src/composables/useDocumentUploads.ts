import {ref} from 'vue'
import type {Document, DocumentProcessType, ProcessDocument, UploadedProcessDocument} from '#/documents'
import {useAxios} from '@/composables/useAxios'
import {useProjectStore} from '@/stores/useProjectStore'
import useCharters from '@/composables/useCharters'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {useUserStore} from '@/stores/useUserStore'

const documents = ref<Document[]>([])

const processDocuments = ref<ProcessDocument[]>([])

const documentUploads = ref<UploadedProcessDocument[]>([])

const MAX_FILE_SIZE = 8 * 1048576
const MAX_TITLE_LENGTH = 100

export default function () {
    const {axiosPublic, axiosAuthenticated} = useAxios()
    const projectStore = useProjectStore()
    const userManagerStore = useUserManagerStore()
    const userStore = useUserStore()

    // Init documents to work on
    const initProcessDocuments = (filterByFund?: boolean, funds?: number[]) => {
        processDocuments.value = []
        documents.value.forEach((document) => {
            const initDocument = !filterByFund || !funds?.length || !document.fund || funds.includes(document.fund)
            if (initDocument) {
                processDocuments.value.push({
                    document: document.id,
                    acronym: document.acronym,
                    maxUploads: document.maxUploads,
                    description: document.description,
                    pathFile: document.maxUploads > 1 ? [] : undefined,
                    isRequiredInProcess: document.isRequiredInProcess,
                    mimeTypes: document.mimeTypes,
                    pathTemplate: document.pathTemplate,
                    processType: document.processType
                })
            }
        })
    }

    const initProjectDocumentUploads = () => {
        documentUploads.value = []
        const documentIds = processDocuments.value.map((document) => (document.document))
        projectStore.projectDocuments.forEach((document) => {
            if (!documentIds.includes(document.document)) return
            documentUploads.value.push({
                id: document.id as number,
                document: document.document,
                pathFile: import.meta.env.VITE_APP_BASE_URL + document.pathFile as string,
                name: document.name as string
            })
        })
    }

    const initCharterDocumentUploads = () => {
        const {charterDocuments} = useCharters()
        documentUploads.value = []
        const documentIds = processDocuments.value.map((document) => (document.document))
        charterDocuments.value.forEach((document) => {
            if (!documentIds.includes(document.document)) return
            documentUploads.value.push({
                id: document.id as number,
                document: document.document,
                pathFile: import.meta.env.VITE_APP_BASE_URL + document.pathFile as string,
                name: document.name as string
            })
        })
    }

    const initManagedUserDocumentUploads = () => {
        documentUploads.value = []
        const documentIds = processDocuments.value.map((document) => (document.document))
        userManagerStore.userDocuments.forEach((document) => {
            if (!documentIds.includes(document.document)) return
            documentUploads.value.push({
                id: document.id as number,
                document: document.document,
                pathFile: import.meta.env.VITE_APP_BASE_URL + document.pathFile as string,
                name: document.name as string
            })
        })
    }

    const initUserDocumentUploads = () => {
        documentUploads.value = []
        const documentIds = processDocuments.value.map((document) => (document.document))
        userStore.userDocuments.forEach((document) => {
            if (!documentIds.includes(document.document)) return
            documentUploads.value.push({
                id: document.id as number,
                document: document.document,
                pathFile: import.meta.env.VITE_APP_BASE_URL + document.pathFile as string,
                name: document.name as string
            })
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

        constructor(file: Blob, associationId: number | null, user: number | null, document: number) {
            this.file = file
            this.association = associationId ? associationId.toString() : ''
            this.user = user ? user.toString() : ''
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

    class RegistrationDocumentUpload {
        file: Blob
        user: string
        document: string

        constructor(file: Blob, user: string, document: number) {
            this.file = file
            this.user = user
            this.document = document.toString()
        }

        formData() {
            const newForm = new FormData()
            newForm.append('pathFile', this.file)
            newForm.append('document', this.document)
            newForm.append('user', this.user)
            return newForm
        }
    }

    // Post document uploads
    async function uploadDocuments(associationId: number | null, user: number | null) {
        for (const document of processDocuments.value) {

            if (!document.pathFile) continue

            if (document.maxUploads > 1) {
                const files = document.pathFile as Blob[] | []

                for (const file of files) {
                    const documentUpload = new DocumentUpload(file, associationId, user, document.document as number)
                    const documentData = documentUpload.formData()
                    await axiosAuthenticated.post('/documents/uploads', documentData)
                }
            } else {
                const file = document.pathFile as Blob
                const documentUpload = new DocumentUpload(file, associationId, user, document.document as number)
                const documentData = documentUpload.formData()
                await axiosAuthenticated.post('/documents/uploads', documentData)
            }
        }
    }

    // Post registration document uploads
    async function uploadRegistrationDocuments(user: string) {
        for (const document of processDocuments.value) {

            if (!document.pathFile) return

            const file = document.pathFile as Blob
            const documentUpload = new RegistrationDocumentUpload(file, user, document.document as number)
            const documentData = documentUpload.formData()
            await axiosPublic.post('/documents/uploads/registration', documentData)
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
        RegistrationDocumentUpload,
        createUploadedFileLink,
        initCharterDocumentUploads,
        getStudentCertificate,
        initManagedUserDocumentUploads,
        initUserDocumentUploads,
        MAX_FILE_SIZE,
        MAX_TITLE_LENGTH,
        uploadRegistrationDocuments
    }
}
