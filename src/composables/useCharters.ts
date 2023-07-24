import {ref} from 'vue'
import {useAxios} from '@/composables/useAxios'
import type {DocumentProcessType, DocumentUpload, Document} from '#/documents'
import useDocumentUploads from '@/composables/useDocumentUploads'
import type {AssociationCharter, CharterStatus, ChartersToManage, ManageCharter} from '#/charters'
import useUtility from '@/composables/useUtility'
import {useAssociationStore} from '@/stores/useAssociationStore'

const charterDocuments = ref<DocumentUpload[]>([])
const manageCharters = ref<ManageCharter[]>([])
const associationCharters = ref<AssociationCharter[]>([])
const chartersToManage = ref<ChartersToManage[]>([])

export default function () {
    const {formatDate, fromDateIsAnterior} = useUtility()
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
                documentUploadId: uploadedCharter?.id ?? 0,
                documentName: document.name,
                pathTemplate: document.pathTemplate,
                pathFile: uploadedCharter?.pathFile,
                validatedDate: charterStatus.validatedDate,
                expirationDate: charterStatus.expirationDate,
                charterStatus: charterStatus.charterStatus
            })
        })
    }

    const initAssociationCharters = async () => {
        const {getDocuments, documents} = useDocumentUploads()
        associationCharters.value = []
        await getDocuments(['CHARTER_ASSOCIATION'])
        await getCharters()
        const document = documents.value.find(doc => doc.acronym === 'CHARTE_SITE_ALSACE')
        if (document) {
            associationStore.associations.forEach(association => {
                const uploadedCharter = charterDocuments.value.find(doc => doc.document === document.id && doc.association === association.id)
                const charterStatus = initCharterStatus(association.isSite, document, uploadedCharter)
                associationCharters.value.push({
                    associationId: association.id,
                    associationName: association.name,
                    associationInstitution: associationStore.institutions.find(obj => obj.id === association.institution)?.acronym ?? '',
                    isSite: association.isSite,
                    charterStatus: charterStatus.charterStatus
                })
            })
        }
    }

    const initChartersToManage = async () => {
        const {getDocuments, documents} = useDocumentUploads()
        chartersToManage.value = []
        await getDocuments(charterProcesses)
        await getCharters()
        charterDocuments.value.forEach(charter => {
            if (charter.association) {
                const association = associationStore.associations.find(association => association.id === charter.association)
                if (association && association.isSite) {
                    const document = documents.value.find(doc => doc.id === charter.document)
                    if (document) {
                        const charterStatus = initCharterStatus(true, document, charter)
                        chartersToManage.value.push({
                            associationId: association.id,
                            associationName: association.name,
                            associationInstitution: associationStore.institutions.find(obj => obj.id === association.institution)?.acronym ?? '',
                            charterId: charter.document,
                            charterName: charter.name as string,
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
        if (!isSite && document.acronym === 'CHARTE_SITE_ALSACE') charterStatus = 'NOT_SITE'
        else if (uploadedCharter) {
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

    return {
        getCharterDocuments,
        charterDocuments,
        signCharter,
        initCharters,
        manageCharters,
        uploadCharter,
        downloadCharter,
        associationCharters,
        initAssociationCharters,
        getCharters
    }
}
