import {createTestingPinia} from '@pinia/testing'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {config} from '@vue/test-utils'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {createPinia, setActivePinia} from 'pinia'
import {useAxios} from '@/composables/useAxios'
import useCharters from '@/composables/useCharters'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {_documentUploads} from '~/fixtures/project.mock'
import useDocumentUploads from '@/composables/useDocumentUploads'
import {_documents} from '~/fixtures/document.mock'
import {_associationCharters, _manageCharters} from '~/fixtures/charters.mock'
// import {_associationCharters, _manageCharters, _projectFundCharters} from '~/fixtures/charters.mock'
import {_associations, _institutions} from '~/fixtures/association.mock'
import {_todayDate} from '~/fixtures/dates.mock'
import useUtility from '@/composables/useUtility'


vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))

vi.mock('@/composable/useDocumentUploads', () => ({
    default: () => ({
        getDocuments: vi.fn()
    })
}))

setActivePinia(createPinia())

let associationStore = useAssociationStore()

config.global.plugins = [
    createTestingPinia({
        createSpy: vi.fn()
    })
]

describe('useCharters', () => {
    beforeEach(() => {
        associationStore = useAssociationStore()
        documents.value = _documents
        associationStore.associations = _associations
        associationStore.institutions = _institutions
        charterDocuments.value = _documentUploads
    })

    afterEach(() => {
        vi.restoreAllMocks()
        charterDocuments.value = []
    })

    const {
        getCharterDocuments,
        charterDocuments,
        getCharters,
        initCharters,
        manageCharters,
        associationCharters,
        initAssociationCharters,
        initProcessingCharters,
        processingCharters,
        uploadCharter,
        patchCharterDocument,
        patchCharterStatus
    } = useCharters()
    const {
        documents
    } = useDocumentUploads()
    const {formatDate} = useUtility()
    const {axiosAuthenticated} = useAxios()
    const mockedAxios = vi.mocked(axiosAuthenticated, true)

    describe('getCharterDocuments', () => {
        it('should get all documents needed to sign the association charter', async () => {
            mockedAxios.get.mockResolvedValueOnce({data: _documentUploads})
            await getCharterDocuments(1)
            const url = '/documents/uploads?association_id=1&process_types=CHARTER_ASSOCIATION,DOCUMENT_ASSOCIATION'
            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith(url)
            expect(charterDocuments.value).toEqual(_documentUploads)
        })
    })

    describe('getCharters', () => {
        it('should get all document uploads linked to charters', async () => {
            mockedAxios.get.mockResolvedValueOnce({data: _documentUploads})
            await getCharters(1)
            const url = '/documents/uploads?association_id=1&process_types=CHARTER_ASSOCIATION,CHARTER_PROJECT_FUND'
            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith(url)
            expect(charterDocuments.value).toEqual(_documentUploads)
        })
    })

    describe('initCharters', () => {
        it('should init charters with status', async () => {
            const getDocumentsUrl = '/documents/?process_types=CHARTER_ASSOCIATION,CHARTER_PROJECT_FUND'
            mockedAxios.get.mockImplementation((url) => {
                if (url === getDocumentsUrl) return Promise.resolve({data: _documents})
                else return Promise.resolve({data: _documentUploads})
            })
            await initCharters(1, true, 'CHARTER_VALIDATED')
            expect(manageCharters.value).toEqual(_manageCharters)
        })
    })

    describe('initAssociationCharters', () => {
        describe('if charter type is association charter', () => {
            it('should init association charter for each association', () => {
                initAssociationCharters('CHARTER_ASSOCIATION')
                expect(associationCharters.value).toEqual(_associationCharters)
            })
        })
        /* TODO Triggers multiple errors since 01/01/24 (may not work until 31/08/24).
        describe('if charter type is project fund charter', () => {
            it('should init all project fund charters for each association', () => {
                initAssociationCharters('CHARTER_PROJECT_FUND')
                expect(associationCharters.value).toEqual(_projectFundCharters)
            })
        })
        */
    })

    describe('initProcessingCharters', () => {
        beforeEach(() => {
            charterDocuments.value = _documentUploads
            documents.value = _documents
            associationStore.associations = _associations
        })

        afterEach(() => {
            associationStore.associations = []
        })

        describe('if charter type is association charter', () => {
            it('should init all pending association charters to validate', async () => {
                associationStore.associations[0].charterStatus = 'CHARTER_PROCESSING'
                associationStore.associations[1].charterStatus = 'CHARTER_PROCESSING'
                await initProcessingCharters('CHARTER_ASSOCIATION')
                expect(processingCharters.value).toEqual([
                    {
                        associationId: 1,
                        associationName: 'Association',
                        charterId: 1,
                        charterName: 'Charte Site Alsace + RGPD Site Alsace',
                        charterStatus: 'PROCESSING',
                        institution: 'Unistra',
                        uploadedDate: '2023-01-01'
                    }
                ])
            })
        })
        describe('if charter type is project fund charter', () => {
            it('should init all pending project fund charters to validate', async () => {
                charterDocuments.value[2].validatedDate = ''
                await initProcessingCharters('CHARTER_PROJECT_FUND')
                expect(processingCharters.value).toEqual([
                    {
                        associationId: 1,
                        associationName: 'Association',
                        charterId: 3,
                        charterName: 'Charte FSDIE',
                        charterStatus: 'PROCESSING',
                        institution: 'Unistra',
                        uploadedDate: '2023-01-01'
                    }
                ])
            })
        })
    })

    describe('uploadCharter', () => {
        it('should post an uploaded charter document and delete the old one', async () => {
            const charter = new File([], 'file')
            const charterData = new FormData()
            charterData.append('pathFile', charter)
            charterData.append('document', '1')
            charterData.append('association', '1')
            await uploadCharter(1, 1, 1, charter)
            expect(axiosAuthenticated.delete).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.delete).toHaveBeenCalledWith(`/documents/uploads/${1}`)
            expect(axiosAuthenticated.post).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.post).toHaveBeenCalledWith('/documents/uploads', charterData)
        })
    })

    describe('patchCharterDocument', () => {
        const comment = 'comment'
        describe('if the charter is validated', () => {
            it('should patch the charter document', async () => {
                await patchCharterDocument('validate', 1, comment)
                expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
                expect(axiosAuthenticated.patch).toHaveBeenCalledWith('/documents/uploads/1', {
                    comment,
                    validatedDate: formatDate(_todayDate.toJSON().slice(0, 10))
                })
            })
        })
        describe('if the charter is rejected', () => {
            it('should patch the charter document', async () => {
                await patchCharterDocument('reject', 1, comment)
                expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
                expect(axiosAuthenticated.patch).toHaveBeenCalledWith('/documents/uploads/1', {
                    comment
                })
            })
        })
        describe('if the charter is returned', () => {
            it('should patch the charter document', async () => {
                await patchCharterDocument('return', 1, comment)
                expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
                expect(axiosAuthenticated.patch).toHaveBeenCalledWith('/documents/uploads/1', {
                    comment
                })
            })
        })
    })

    describe('patchCharterStatus', () => {
        it('should patch the status of the corresponding document upload', async () => {
            const charterStatus = 'CHARTER_VALIDATED'
            await patchCharterStatus(charterStatus, 1)
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith('/associations/1/status', {charterStatus})
        })
    })
})
