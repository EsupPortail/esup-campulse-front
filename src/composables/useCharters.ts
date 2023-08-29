import {ref} from 'vue'
import {useAxios} from '@/composables/useAxios'
import type {Document, DocumentProcessType, DocumentUpload} from '#/documents'
import useDocumentUploads from '@/composables/useDocumentUploads'
import type {
    AssociationCharter,
    AssociationCharterStatus,
    CharterStatus,
    ManageCharter,
    ProcessingCharter
} from '#/charters'
import useUtility from '@/composables/useUtility'
import {useAssociationStore} from '@/stores/useAssociationStore'

const charterDocuments = ref<DocumentUpload[]>([])
const manageCharters = ref<ManageCharter[]>([])
const associationCharters = ref<AssociationCharter[]>([])
const processingCharters = ref<ProcessingCharter[]>([])

export default function () {
    const {formatDate} = useUtility()
    const associationStore = useAssociationStore()
    const {axiosAuthenticated} = useAxios()

    const charterProcesses: DocumentProcessType[] = ['CHARTER_ASSOCIATION', 'CHARTER_PROJECT_FUND']

    async function getCharterDocuments(associationId?: number) {
        const params = []
        if (associationId) params.push(`association_id=${associationId}`)
        params.push('process_types=CHARTER_ASSOCIATION,DOCUMENT_ASSOCIATION')
        const url = `/documents/uploads?${params.join('&')}`
        charterDocuments.value = (await axiosAuthenticated.get<DocumentUpload[]>(url)).data
    }

    async function getCharters(associationId?: number) {
        const processes: string = charterProcesses.join(',')
        const params = []
        if (associationId) params.push(`association_id=${associationId}`)
        params.push(`process_types=${processes}`)
        const url = `/documents/uploads?${params.join('&')}`
        charterDocuments.value = (await axiosAuthenticated.get<DocumentUpload[]>(url)).data
    }

    const initCharters = async (associationId: number, isSite: boolean, associationCharterStatus: AssociationCharterStatus) => {
        const {getDocuments, documents} = useDocumentUploads()
        await getDocuments(charterProcesses)
        await getCharters(associationId)
        manageCharters.value = []
        documents.value.forEach(document => {
            const uploadedCharter = charterDocuments.value.find(x => x.document === document.id)
            const charterStatus = initCharterStatus(isSite, associationCharterStatus, document, uploadedCharter)
            manageCharters.value.push({
                associationId: uploadedCharter?.association,
                documentId: document.id,
                documentAcronym: document.acronym,
                documentProcessType: document.processType,
                documentUploadId: uploadedCharter?.id ?? 0,
                documentName: document.name,
                pathTemplate: document.pathTemplate,
                pathFile: uploadedCharter?.pathFile ?? '',
                validatedDate: formatDate(charterStatus.validatedDate)?.split('-').reverse().join('/'),
                expirationDate: formatDate(charterStatus.expirationDate)?.split('-').reverse().join('/'),
                charterStatus: charterStatus.charterStatus
            })
        })
    }

    const initAssociationCharters = async (charterType: 'CHARTER_ASSOCIATION' | 'CHARTER_PROJECT_FUND') => {
        const {documents} = useDocumentUploads()
        associationCharters.value = []
        associationStore.associations.forEach(association => {
            if (!association.isSite && charterType === 'CHARTER_ASSOCIATION') return
            else {
                const data: AssociationCharter = {
                    associationId: association.id,
                    associationName: association.name,
                    institution: associationStore.institutions.find(obj => obj.id === association.institution)?.acronym ?? '',
                    isSite: association.isSite,
                    charters: []
                }
                const charters = documents.value.filter(obj => obj.processType === charterType)
                charters.forEach(charter => {
                    const uploadedCharter = charterDocuments.value.find(obj => obj.document === charter.id && obj.association === association.id)
                    const charterStatus = initCharterStatus(association.isSite, association.charterStatus, charter, uploadedCharter)
                    data.charters.push({
                        charterId: charter.id,
                        charterName: charter.name,
                        charterStatus: charterStatus.charterStatus
                    })
                })
                associationCharters.value.push(data)
            }
        })
    }

    const initProcessingCharters = async (charterType: 'CHARTER_ASSOCIATION' | 'CHARTER_PROJECT_FUND') => {
        const {documents} = useDocumentUploads()
        processingCharters.value = []
        charterDocuments.value.forEach(uploadCharter => {
            const document = documents.value.find(doc => doc.id === uploadCharter.document)
            const association = associationStore.associations.find(association => association.id === uploadCharter.association)
            if (document && association) {
                if (document.processType === charterType && uploadCharter.association === association.id) {
                    const charterStatus = initCharterStatus(association.isSite, association.charterStatus, document, uploadCharter)
                    if (charterStatus?.charterStatus === 'PROCESSING') {
                        processingCharters.value.push({
                            associationId: association.id,
                            associationName: association.name,
                            institution: associationStore.institutions.find(obj => obj.id === association.institution)?.acronym ?? '',
                            charterId: document.id,
                            charterName: document.name,
                            uploadedDate: uploadCharter.uploadDate as string,
                            charterStatus: charterStatus.charterStatus
                        })
                    }
                }
            }

        })
    }

    // TODO test
    const initCharterStatus = (isSite: boolean, associationCharterStatus: AssociationCharterStatus, document: Document, uploadedCharter: DocumentUpload | undefined) => {
        let charterStatus: CharterStatus = 'NO_CHARTER'
        let validatedDate = ''
        let expirationDate = ''
        // We set today's date
        const todayDate = new Date()
        todayDate.setHours(0, 0, 0, 0)
        // If the charter is the association charter, we verify if the association isSite
        if (!isSite && document.processType === 'CHARTER_ASSOCIATION') charterStatus = 'NOT_SITE'
        // Then if there is an uploaded charter
        else if (uploadedCharter || document.processType === 'CHARTER_ASSOCIATION') {
            // We set the validated date
            if (uploadedCharter) validatedDate = formatDate(uploadedCharter?.validatedDate) as string
            // If the charter is the association charter, we can determine its status by the association's charter status
            if (document.processType === 'CHARTER_ASSOCIATION') {
                if (associationCharterStatus === 'CHARTER_PROCESSING') charterStatus = 'PROCESSING'
                else if (associationCharterStatus === 'CHARTER_VALIDATED') charterStatus = 'VALIDATED'
                else if (associationCharterStatus === 'CHARTER_REJECTED') charterStatus = 'REJECTED'
                else if (associationCharterStatus === 'CHARTER_DRAFT') charterStatus = 'RETURNED'
                else if (associationCharterStatus === 'CHARTER_EXPIRED') charterStatus = 'EXPIRED'
                // Check if the charter has not been resigned
                if (charterStatus === 'PROCESSING' && validatedDate) {
                    validatedDate = ''
                    expirationDate = ''
                } else if (validatedDate) {
                    const splitValidatedDate = validatedDate.split('-')
                    expirationDate = [(parseInt(splitValidatedDate[0]) + 1).toString(), splitValidatedDate[1], splitValidatedDate[2]].join('-')
                }
                /*const formatedExpirationDate = new Date(expirationDate)
                if (formatedExpirationDate >= todayDate) {
                    charterStatus = 'VALIDATED'
                } else {
                    charterStatus = 'EXPIRED'
                }*/
            } else {
                // First, we check if the charter has been validated
                if (uploadedCharter) {
                    if (uploadedCharter.uploadDate && !uploadedCharter.validatedDate) { // if document has been uploaded but is not validated yet
                        if (uploadedCharter.comment) {
                            charterStatus = 'REJECTED'
                        } else {
                            charterStatus = 'PROCESSING'
                        }
                    }
                } else { // If so, we calculate the expiration date
                    const currentYear = new Date().getFullYear().toString()
                    const nextYear = (new Date().getFullYear() + 1).toString()
                    const factory: string[] = document.expirationDay.split('-')
                    factory.splice(0, 0, currentYear)
                    const currentYearExpirationDate = factory.join('-')
                    const formatedCurrentYearExpirationDate = new Date(currentYearExpirationDate)
                    // Determine if expiration date is this year or next year
                    if (formatedCurrentYearExpirationDate >= todayDate) { // if expiration date is yet to come this year
                        expirationDate = currentYearExpirationDate
                    } else { // if expiration date is passed this year
                        factory.splice(0, 1, nextYear)
                        expirationDate = factory.join('-')
                    }
                    // Check if expiration date is inferior to today
                    const formatedExpirationDate = new Date(expirationDate)
                    if (formatedExpirationDate >= todayDate) {
                        charterStatus = 'VALIDATED'
                    } else {
                        charterStatus = 'EXPIRED'
                    }
                }
            }
        }
        return {
            validatedDate,
            expirationDate,
            charterStatus
        }
    }

    async function uploadCharter(documentUploadId: number | undefined | null, associationId: number, documentId: number, charter: Blob) {
        if (documentUploadId) {
            await axiosAuthenticated.delete(`/documents/uploads/${documentUploadId}`)
        }
        const charterData = new FormData()
        charterData.append('pathFile', charter)
        charterData.append('document', documentId.toString())
        charterData.append('association', associationId.toString())
        await axiosAuthenticated.post('/documents/uploads', charterData)
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

    // TODO
    async function patchCharterDocument(action: 'validate' | 'reject' | 'return', id: number, comment: string) {
        let dataToPatch = {}
        if (comment) {
            dataToPatch = Object.assign(dataToPatch, {comment})
        }
        if (action === 'validate') {
            const todayDate = new Date().toJSON().slice(0, 10)
            dataToPatch = Object.assign(dataToPatch, {validatedDate: formatDate(todayDate)})
        }
        await axiosAuthenticated.patch(`/documents/uploads/${id}`, dataToPatch)
    }

    // TODO
    async function patchCharterStatus(charterStatus: AssociationCharterStatus, associationId: number) {
        await axiosAuthenticated.patch(`/associations/${associationId}/status`, {charterStatus})
    }

    return {
        getCharterDocuments,
        charterDocuments,
        initCharters,
        manageCharters,
        uploadCharter,
        downloadCharter,
        associationCharters,
        charterProcesses,
        getCharters,
        initAssociationCharters,
        processingCharters,
        initProcessingCharters,
        patchCharterDocument,
        patchCharterStatus
    }
}
