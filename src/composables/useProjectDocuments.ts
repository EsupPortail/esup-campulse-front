import {ref} from 'vue'
import type {Document, ProcessProjectDocument} from '#/documents'
import {useAxios} from '@/composables/useAxios'
import {useProjectStore} from '@/stores/useProjectStore'
import {useUserStore} from '@/stores/useUserStore'

const documentTypes = ref<Document[]>([])

const processProjectDocuments = ref<ProcessProjectDocument[]>([])

export default function () {

    const {axiosPublic, axiosAuthenticated} = useAxios()
    const projectStore = useProjectStore()
    const userStore = useUserStore()


    // REQUIRED DOCUMENTS PER PROCESS
    const initProcessProjectDocuments = (process: 'DOCUMENT_PROJECT') => {
        processProjectDocuments.value = []
        const documents = documentTypes.value.filter(obj => obj.processType === process)
        documents.forEach((document) => {
            processProjectDocuments.value.push({
                document: document.id,
                isMultiple: document.isMultiple,
                label: document.description,
                pathFile: document.isMultiple ? [] : undefined,
                isRequiredInProcess: document.isRequiredInProcess,
                mimeTypes: document.mimeTypes
            })
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
        for (let i = 0; i < processProjectDocuments.value.length; i++) {

            if (processProjectDocuments.value[i].pathFile) {

                if (processProjectDocuments.value[i].isMultiple) {
                    const files = processProjectDocuments.value[i].pathFile as Blob[] | []

                    for (let j = 0; j < files.length; j++) {
                        const documentUpload = new DocumentUpload(files[j], associationId, processProjectDocuments.value[i].document)
                        const documentData = documentUpload.formData()
                        await axiosAuthenticated.post('/documents/uploads', documentData)
                    }
                } else {
                    const file = processProjectDocuments.value[i].pathFile as Blob
                    const documentUpload = new DocumentUpload(file, associationId, processProjectDocuments.value[i].document)
                    const documentData = documentUpload.formData()
                    await axiosAuthenticated.post('/documents/uploads', documentData)
                }
            }
        }
    }

    return {
        getDocumentTypes,
        documentTypes,
        processProjectDocuments,
        initProcessProjectDocuments,
        postProjectDocuments
    }
}
