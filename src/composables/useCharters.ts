import {ref} from 'vue'
import {useAxios} from '@/composables/useAxios'
import type {Document, DocumentProcessType, DocumentUpload} from '#/documents'
import useDocumentUploads from '@/composables/useDocumentUploads'
import type {AssociationCharter, CharterStatus, ManageCharter, ProcessingCharter} from '#/charters'
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

    async function signCharter(associationId: number) {
        await axiosAuthenticated.patch(`/associations/${associationId}/status`, {charterStatus: 'CHARTER_PROCESSING'})
    }

    async function getCharters(associationId?: number) {
        const processes: string = charterProcesses.join(',')
        const params = []
        if (associationId) params.push(`association_id=${associationId}`)
        params.push(`process_types=${processes}`)
        const url = `/documents/uploads?${params.join('&')}`
        charterDocuments.value = (await axiosAuthenticated.get<DocumentUpload[]>(url)).data
    }

    const initCharters = async (associationId: number, isSite: boolean) => {
        const {getDocuments, documents} = useDocumentUploads()
        await getDocuments(charterProcesses)
        await getCharters(associationId)
        manageCharters.value = []
        documents.value.forEach(document => {
            const uploadedCharter = charterDocuments.value.find(x => x.document === document.id)
            const charterStatus = initCharterStatus(isSite, document, uploadedCharter)
            manageCharters.value.push({
                associationId: uploadedCharter?.association,
                documentId: document.id,
                documentAcronym: document.acronym,
                documentProcessType: document.processType,
                documentUploadId: uploadedCharter?.id ?? 0,
                documentName: document.name,
                pathTemplate: document.pathTemplate,
                pathFile: uploadedCharter?.pathFile,
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
                    const charterStatus = initCharterStatus(association.isSite, charter, uploadedCharter)
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
                    const charterStatus = initCharterStatus(association.isSite, document, uploadCharter)
                    if (charterStatus.charterStatus === 'PROCESSING') {
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

    const initCharterStatus = (isSite: boolean, document: Document, uploadedCharter: DocumentUpload | undefined) => {
        let charterStatus: CharterStatus = 'NO_CHARTER'
        let validatedDate = ''
        let expirationDate = ''
        const todayDate = new Date()
        todayDate.setHours(0, 0, 0, 0)
        if (!isSite && document.acronym === 'CHARTE_SITE_ALSACE') charterStatus = 'NOT_SITE'
        else if (uploadedCharter) {
            validatedDate = formatDate(uploadedCharter.validatedDate) as string
            if (uploadedCharter.uploadDate && !uploadedCharter.validatedDate) { // if document has been uploaded but is not validated yet
                charterStatus = 'PROCESSING'
            } else if (document.daysBeforeExpiration) { // if document must be signed once a year
                const splitValidatedDate = validatedDate.split('-')
                expirationDate = [(parseInt(splitValidatedDate[0]) + 1).toString(), splitValidatedDate[1], splitValidatedDate[2]].join('-')
                // check if expiration date is inferior to today
                const formatedExpirationDate = new Date(expirationDate)
                if (formatedExpirationDate <= todayDate) {
                    charterStatus = 'VALIDATED'
                } else {
                    charterStatus = 'EXPIRED'
                }
            } else { // if document has a fixed expiration date
                const currentYear = new Date().getFullYear().toString()
                const nextYear = (new Date().getFullYear() + 1).toString()
                const factory: string[] = document.expirationDay.split('-')
                factory.splice(0, 0, currentYear)
                const currentYearExpirationDate = factory.join('-')
                const formatedCurrentYearExpirationDate = new Date(currentYearExpirationDate)
                // determine if expiration date is this year or next year
                if (formatedCurrentYearExpirationDate >= todayDate) { // if expiration date is yet to come this year
                    expirationDate = currentYearExpirationDate
                } else { // if expiration date is passed this year
                    factory.splice(0, 1, nextYear)
                    expirationDate = factory.join('-')
                }
                // check if expiration date is inferior to today
                const formatedExpirationDate = new Date(expirationDate)
                if (formatedExpirationDate >= todayDate) {
                    charterStatus = 'VALIDATED'
                } else {
                    charterStatus = 'EXPIRED'
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
    async function validateCharter(action: 'validate' | 'return' | 'reject', id: number, comment: string) {
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

    return {
        getCharterDocuments,
        charterDocuments,
        signCharter,
        initCharters,
        manageCharters,
        uploadCharter,
        downloadCharter,
        associationCharters,
        charterProcesses,
        getCharters,
        initAssociationCharters,
        processingCharters,
        initProcessingCharters
    }
}
