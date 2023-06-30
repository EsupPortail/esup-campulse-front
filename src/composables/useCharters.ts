import {ref} from 'vue'
import {useAxios} from '@/composables/useAxios'
import type {DocumentProcessType, DocumentUpload} from '#/documents'
import useDocumentUploads from '@/composables/useDocumentUploads'
import type {CharterStatus, ManageCharter} from '#/charters'
import useUtility from '@/composables/useUtility'

const charterDocuments = ref<DocumentUpload[]>([])
const manageCharters = ref<ManageCharter[]>([])

export default function() {

    const {axiosPublic, axiosAuthenticated} = useAxios()
    const {formatDate, fromDateIsAnterior} = useUtility()

    const charterProcesses: DocumentProcessType[] = ['CHARTER_ASSOCIATION', 'CHARTER_PROJECT_FUND']

    async function getCharterDocuments(associationId: number) {
        const url = `/documents/uploads?association_id=${associationId}&process_types=CHARTER_ASSOCIATION,DOCUMENT_ASSOCIATION`
        charterDocuments.value = (await axiosAuthenticated.get<DocumentUpload[]>(url)).data
    }

    async function signCharter(associationId: number) {
        await axiosAuthenticated.patch(`/associations/${associationId}/status`, {charterStatus: 'CHARTER_PROCESSING'})
    }

    async function getCharters(associationId: number) {
        const processes: string = charterProcesses.join(',')
        const url = `/documents/uploads?association_id=${associationId}&process_types=${processes}`
        charterDocuments.value = (await axiosAuthenticated.get<DocumentUpload[]>(url)).data
    }

    const initCharters = async (associationId: number) => {
        const {getDocuments, documents} = useDocumentUploads()
        await getDocuments(charterProcesses)
        await getCharters(associationId)
        manageCharters.value = []
        documents.value.forEach(document => {
            const uploadedCharter = charterDocuments.value.find(x => x.document === document.id)
            let charterStatus: CharterStatus = 'NO_CHARTER'
            let validatedDate = ''
            let expirationDate = ''
            if (uploadedCharter) {
                validatedDate = formatDate(uploadedCharter.validatedDate) as string
                if (uploadedCharter.uploadDate && !uploadedCharter.validatedDate) { // if document has been uploaded but is not validated yet
                    charterStatus = 'PROCESSING'
                } else if (document.daysBeforeExpiration) { // if document must be signed once a year
                    const splitValidatedDate = validatedDate.split('-')
                    expirationDate = [splitValidatedDate[0] + 1, splitValidatedDate[1], splitValidatedDate[2]].join('-')
                    if (fromDateIsAnterior(validatedDate, expirationDate, false)) {
                        charterStatus = 'VALIDATED'
                    } else {
                        charterStatus = 'EXPIRED'
                    }
                } else { // if document has a fixed expiration date
                    const expirationDate = document.expirationDay.split('-')
                    expirationDate.splice(0, 0, new Date().getFullYear().toString())
                    if (fromDateIsAnterior(validatedDate, expirationDate.join('-'), false)) {
                        charterStatus = 'VALIDATED'
                    } else {
                        charterStatus = 'EXPIRED'
                    }
                }
            }
            manageCharters.value.push({
                documentId: document.id,
                documentUploadId: uploadedCharter?.id ?? 0,
                documentName: document.name,
                pathTemplate: document.pathTemplate,
                pathFile: uploadedCharter?.pathFile,
                validatedDate,
                expirationDate,
                charterStatus
            })
        })
    }

    async function uploadCharter(documentUploadId: number | undefined | null, associationId: number, documentId: number, charter: Blob) {
        if (documentUploadId) {
            await axiosAuthenticated.delete(`/documents/uploads/${documentUploadId}`)
        }
        const charterData = new FormData()
        charterData.append('pathFile', charter)
        charterData.append('document', documentId.toString())
        charterData.append('association', associationId.toString())
        await axiosPublic.post('/documents/uploads', charterData)
    }

    async function downloadCharter(path: string, documentName: string) {
        const {getFile} = useDocumentUploads()
        const file = await getFile(path as string)
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(file)
        link.download = documentName as string
        document.body.appendChild(link)
        link.click()
        link.remove()
    }

    return {
        getCharterDocuments,
        charterDocuments,
        signCharter,
        initCharters,
        manageCharters,
        uploadCharter,
        downloadCharter
    }
}
