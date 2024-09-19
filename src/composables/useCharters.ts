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

    const ASSOCIATION_CHARTER = 'CHARTE_SITE_ALSACE'

    const charterProcesses: DocumentProcessType[] = ['CHARTER_ASSOCIATION', 'CHARTER_PROJECT_FUND']

    // Get all documents uploads needed to sign the association charter
    async function getCharterDocuments(associationId?: number) {
        const params = []
        if (associationId) params.push(`association_id=${associationId}`)
        params.push('process_types=CHARTER_ASSOCIATION,DOCUMENT_ASSOCIATION')
        const url = `/documents/uploads?${params.join('&')}`
        charterDocuments.value = (await axiosAuthenticated.get<DocumentUpload[]>(url)).data
    }

    // Get all document uploads linked to charters
    async function getCharters(associationId?: number) {
        const processes: string = charterProcesses.join(',')
        const params = []
        if (associationId) params.push(`association_id=${associationId}`)
        params.push(`process_types=${processes}`)
        const url = `/documents/uploads?${params.join('&')}`
        charterDocuments.value = (await axiosAuthenticated.get<DocumentUpload[]>(url)).data
    }

    const initCharters = async (associationId: number, isSite: boolean, associationCharterStatus: AssociationCharterStatus | undefined) => {
        const {getDocuments, documents} = useDocumentUploads()
        await getDocuments(charterProcesses)
        await getCharters(associationId)
        manageCharters.value = []
        documents.value.forEach(document => {
            if (document.processType !== 'CHARTER_ASSOCIATION') {
                const uploadedCharter = charterDocuments.value.find(x => x.document === document.id)
                const charterStatus = initCharterStatus(isSite, associationCharterStatus, document, uploadedCharter)
                manageCharters.value.push({
                    associationId: uploadedCharter?.association,
                    documentId: document.id,
                    documentAcronym: document.acronym,
                    documentProcessType: document.processType,
                    documentUploadId: uploadedCharter?.id ?? 0,
                    documentName: document.name,
                    pathTemplate: [{
                        name: document.name ?? '',
                        path: document.pathTemplate ?? '',
                        documentId: document.id
                    }],
                    pathFile: uploadedCharter?.pathFile ?? '',
                    validatedDate: formatDate(charterStatus.validatedDate)?.split('-').reverse().join('/'),
                    expirationDate: formatDate(charterStatus.expirationDate)?.split('-').reverse().join('/'),
                    charterStatus: charterStatus.charterStatus,
                    mimeTypes: document.mimeTypes
                })
            }
        })
        const associationCharters = documents.value.filter(document => document.processType === 'CHARTER_ASSOCIATION')
        const associationCharter = associationCharters.find(document => document.acronym === ASSOCIATION_CHARTER)
        if (associationCharters.length && associationCharter) {
            const uploadedCharter = charterDocuments.value.find(x => x.document === associationCharter.id)
            const charterStatus = initCharterStatus(isSite, associationCharterStatus, associationCharter, uploadedCharter)
            const pathTemplates = associationCharters.map(document => ({
                name: document.name ?? '',
                path: document.pathTemplate ?? '',
                documentId: document.id
            }))
            manageCharters.value.splice(0, 0, {
                associationId: uploadedCharter?.association,
                documentId: associationCharter.id,
                documentAcronym: associationCharter.acronym,
                documentProcessType: associationCharter.processType,
                documentUploadId: uploadedCharter?.id ?? 0,
                documentName: associationCharters.map(document => document.name).join(' + '),
                pathTemplate: pathTemplates,
                pathFile: uploadedCharter?.pathFile ?? '',
                validatedDate: formatDate(charterStatus.validatedDate)?.split('-').reverse().join('/'),
                expirationDate: formatDate(charterStatus.expirationDate)?.split('-').reverse().join('/'),
                charterStatus: charterStatus.charterStatus
            })
        }
    }

    const initAssociationCharters = async (charterType: 'CHARTER_ASSOCIATION' | 'CHARTER_PROJECT_FUND') => {
        const {documents} = useDocumentUploads()
        associationCharters.value = []
        associationStore.associations.forEach(association => {
            const data: AssociationCharter = {
                associationId: association.id,
                associationName: association.name,
                institution: associationStore.institutions.find(obj => obj.id === association.institution)?.acronym ?? '',
                isSite: association.isSite,
                charters: []
            }
            const charters = documents.value.filter(obj => obj.processType === charterType)
            if (charterType === 'CHARTER_ASSOCIATION') {
                const associationCharter = charters.find(obj => obj.acronym === ASSOCIATION_CHARTER)
                if (associationCharter) {
                    const uploadedCharter = charterDocuments.value.find(obj => obj.document === associationCharter.id && obj.association === association.id)
                    const charterStatus = initCharterStatus(association.isSite, association.charterStatus, associationCharter, uploadedCharter)
                    data.charters.push({
                        charterId: associationCharter.id,
                        charterName: charters.map(x => x.name).join(' + '),
                        charterStatus: charterStatus.charterStatus
                    })
                }
            } else {
                charters.forEach(charter => {
                    if (charter.processType !== 'CHARTER_ASSOCIATION') {
                        const uploadedCharter = charterDocuments.value.find(obj => obj.document === charter.id && obj.association === association.id)
                        const charterStatus = initCharterStatus(association.isSite, association.charterStatus, charter, uploadedCharter)
                        data.charters.push({
                            charterId: charter.id,
                            charterName: charter.name,
                            charterStatus: charterStatus.charterStatus
                        })
                    }
                })
            }
            associationCharters.value.push(data)
        })
    }

    const initProcessingCharters = async (charterType: 'CHARTER_ASSOCIATION' | 'CHARTER_PROJECT_FUND') => {
        const {documents} = useDocumentUploads()
        processingCharters.value = []
        let charterAssociationStatus: CharterStatus | undefined = undefined
        const charterAssociationName = documents.value.filter(doc => doc.processType === 'CHARTER_ASSOCIATION').map(doc => doc.name).join(' + ')
        charterDocuments.value.forEach(uploadedCharter => {
            const association = associationStore.associations.find(association => association.id === uploadedCharter.association)
            const document = documents.value.find(doc => doc.id === uploadedCharter.document)
            if (document && association) {
                if (document.processType === charterType && uploadedCharter.association === association.id) {
                    if (document.processType === 'CHARTER_ASSOCIATION') {
                        if (document.acronym === ASSOCIATION_CHARTER) {
                            charterAssociationStatus = initCharterStatus(association.isSite, association.charterStatus, document, uploadedCharter).charterStatus
                            if (charterAssociationStatus === 'PROCESSING') {
                                processingCharters.value.push({
                                    associationId: association.id,
                                    associationName: association.name,
                                    institution: associationStore.institutions.find(obj => obj.id === association.institution)?.acronym ?? '',
                                    charterId: document.id,
                                    charterName: charterAssociationName,
                                    uploadedDate: uploadedCharter.uploadDate as string,
                                    charterStatus: charterAssociationStatus
                                })
                            }
                        }
                    } else {
                        const charterStatus = initCharterStatus(association.isSite, association.charterStatus, document, uploadedCharter)
                        if (charterStatus?.charterStatus === 'PROCESSING') {
                            processingCharters.value.push({
                                associationId: association.id,
                                associationName: association.name,
                                institution: associationStore.institutions.find(obj => obj.id === association.institution)?.acronym ?? '',
                                charterId: document.id,
                                charterName: document.name,
                                uploadedDate: uploadedCharter.uploadDate as string,
                                charterStatus: charterStatus.charterStatus
                            })
                        }
                    }
                }
            }
        })
    }

    const initCharterStatus = (isSite: boolean, associationCharterStatus: AssociationCharterStatus | undefined, document: Document, uploadedCharter: DocumentUpload | undefined) => {
        let charterStatus: CharterStatus = 'NO_CHARTER'
        let validatedDate = ''
        let expirationDate = ''
        let formatedExpirationDate = null
        // We set today's date
        const todayDate = new Date()
        todayDate.setHours(0, 0, 0, 0)
        if (uploadedCharter) {
            validatedDate = formatDate(uploadedCharter.validatedDate) ?? ''
            if (uploadedCharter.calculatedExpirationDate) {
                expirationDate = formatDate(uploadedCharter.calculatedExpirationDate) ?? ''
                formatedExpirationDate = new Date(uploadedCharter.calculatedExpirationDate)
            }
            // If the charter is the association charter, we can determine its status by the association's charter status
            if (document.processType === 'CHARTER_ASSOCIATION') {
                if (associationCharterStatus) {
                    charterStatus = initAssociationCharterStatus(associationCharterStatus, isSite)
                    if (validatedDate && (charterStatus === 'PROCESSING')) {
                        validatedDate = ''
                        expirationDate = ''
                    }
                }
            }
            // If the document has been validated, we calculate its expiration date
            else if (validatedDate !== '') {
                if (formatedExpirationDate && (formatedExpirationDate >= todayDate)) {
                    charterStatus = 'VALIDATED'
                } else {
                    charterStatus = 'EXPIRED'
                }
            }
            // If the document has been uploaded but is not validated yet
            else if (uploadedCharter.uploadDate) {
                if (uploadedCharter.comment) {
                    charterStatus = 'REJECTED'
                } else {
                    charterStatus = 'PROCESSING'
                }
            }
        }
        return {
            validatedDate,
            expirationDate,
            charterStatus
        }
    }

    const initAssociationCharterStatus = (charterStatus: AssociationCharterStatus | undefined, isSite: boolean) => {
        if (!isSite && charterStatus !== 'CHARTER_PROCESSING') {
            return 'NOT_SITE'
        } else {
            switch (charterStatus) {
            case 'CHARTER_PROCESSING':
                return 'PROCESSING'
            case 'CHARTER_VALIDATED':
                return 'VALIDATED'
            case 'CHARTER_REJECTED':
                return 'REJECTED'
            case 'CHARTER_DRAFT':
                return 'RETURNED'
            default:
                return 'EXPIRED'
            }
        }
    }

    async function uploadCharter(documentUploadId: number | undefined | null, associationId: number, documentId: number, charter: File) {
        if (documentUploadId) {
            await axiosAuthenticated.delete(`/documents/uploads/${documentUploadId}`)
        }
        const charterData = new FormData()
        charterData.append('pathFile', charter)
        charterData.append('document', documentId.toString())
        charterData.append('association', associationId.toString())
        await axiosAuthenticated.post('/documents/uploads', charterData)
    }

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

    async function patchCharterStatus(charterStatus: AssociationCharterStatus, associationId: number) {
        await axiosAuthenticated.patch(`/associations/${associationId}/status`, {charterStatus})
    }

    return {
        getCharterDocuments,
        charterDocuments,
        initCharters,
        manageCharters,
        uploadCharter,
        associationCharters,
        charterProcesses,
        getCharters,
        initAssociationCharters,
        processingCharters,
        initProcessingCharters,
        patchCharterDocument,
        patchCharterStatus,
        ASSOCIATION_CHARTER,
        initAssociationCharterStatus
    }
}
