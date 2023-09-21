import {createTestingPinia} from '@pinia/testing'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {config} from '@vue/test-utils'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {createPinia, setActivePinia} from 'pinia'
import useDocumentUploads from '@/composables/useDocumentUploads'
import {useAxios} from '@/composables/useAxios'
import {_document, _documents, _processDocuments, _projectDocuments} from '~/fixtures/document.mock'
import {useProjectStore} from '@/stores/useProjectStore'
import {_documentUploads, _project} from '~/fixtures/project.mock'
import type {ProcessDocument} from '#/documents'
import useCharters from '@/composables/useCharters'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {useUserStore} from '@/stores/useUserStore'

vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))

setActivePinia(createPinia())

let projectStore = useProjectStore()
let userManagerStore = useUserManagerStore()
let userStore = useUserStore()

config.global.plugins = [
    createTestingPinia({
        createSpy: vi.fn()
    })
]

describe('useDocumentUploads', () => {
    beforeEach(() => {
        projectStore = useProjectStore()
        userManagerStore = useUserManagerStore()
        userStore = useUserStore()
    })

    afterEach(() => {
        vi.restoreAllMocks()
        projectStore.project = undefined
        documentUploads.value = []
        documents.value = []
        processDocuments.value = []
        projectStore.projectDocuments = []
    })

    const {
        documents,
        getDocuments,
        DocumentUpload,
        processDocuments,
        uploadDocuments,
        deleteDocumentUpload,
        documentUploads,
        getFile,
        initProcessDocuments,
        initProjectDocumentUploads,
        initCharterDocumentUploads,
        initManagedUserDocumentUploads,
        initUserDocumentUploads,
        getStudentCertificate,
        createUploadedFileLink
    } = useDocumentUploads()
    const {charterDocuments} = useCharters()
    const {axiosPublic, axiosAuthenticated} = useAxios()
    const mockedAxios = vi.mocked(axiosPublic, true)

    describe('initProcessDocuments', () => {
        beforeEach(() => {
            documents.value = _documents
        })
        afterEach(() => {
            processDocuments.value = []
        })
        describe('if we do not filter by fund', () => {
            it('should initialize documents and pathFiles', () => {
                initProcessDocuments()
                expect(processDocuments.value).toEqual(_documents.map(doc => ({
                    document: doc.id,
                    isMultiple: doc.isMultiple,
                    description: doc.description,
                    pathFile: doc.isMultiple ? [] : undefined,
                    isRequiredInProcess: doc.isRequiredInProcess,
                    mimeTypes: doc.mimeTypes
                })))
            })
        })
        describe('if we filter by fund', () => {
            it('should initialize documents and pathFiles based on funds', () => {
                initProcessDocuments(true, [1])
                expect(processDocuments.value).toEqual(_documents.map(doc => ({
                    document: doc.id,
                    isMultiple: doc.isMultiple,
                    description: doc.description,
                    pathFile: doc.isMultiple ? [] : undefined,
                    isRequiredInProcess: doc.isRequiredInProcess,
                    mimeTypes: doc.mimeTypes
                })))
            })
        })
    })

    describe('initProjectDocumentUploads', () => {
        it('should initialize documents and pathFiles', () => {
            projectStore.projectDocuments = _projectDocuments
            processDocuments.value = _processDocuments
            const test: ProcessDocument[] = []
            const documentIds = processDocuments.value.map((document) => (document.document))
            projectStore.projectDocuments.forEach((document) => {
                if (documentIds.includes(document.document)) {
                    test.push({
                        id: document.id,
                        document: document.document,
                        pathFile: import.meta.env.VITE_APP_BASE_URL + document.pathFile as string,
                        name: document.name as string
                    })
                }
            })
            initProjectDocumentUploads()
            expect(documentUploads.value).toEqual(test)
        })
    })

    describe('initCharterDocumentUploads', () => {
        it('should init all charters uploaded by a user', () => {
            charterDocuments.value = _documentUploads
            processDocuments.value = _processDocuments
            const documentIds = processDocuments.value.map((document) => (document.document))
            const test: ProcessDocument[] = []
            charterDocuments.value.forEach((document) => {
                if (documentIds.includes(document.document)) {
                    test.push({
                        id: document.id,
                        document: document.document,
                        pathFile: import.meta.env.VITE_APP_BASE_URL + document.pathFile as string,
                        name: document.name as string
                    })
                }
            })
            initCharterDocumentUploads()
            expect(documentUploads.value).toEqual(test)
        })
    })

    describe('initManagedUserDocumentUploads', () => {
        it('should init the documents uploads of a managed user', () => {
            userManagerStore.userDocuments = _documentUploads
            processDocuments.value = _processDocuments
            const test: ProcessDocument[] = []
            const documentIds = processDocuments.value.map((document) => (document.document))
            userManagerStore.userDocuments.forEach((document) => {
                if (documentIds.includes(document.document)) {
                    test.push({
                        id: document.id,
                        document: document.document,
                        pathFile: import.meta.env.VITE_APP_BASE_URL + document.pathFile as string,
                        name: document.name as string
                    })
                }
            })
            initManagedUserDocumentUploads()
            expect(documentUploads.value).toEqual(test)
        })
    })

    describe('initUserDocumentUploads', () => {
        it('should init the document uploads of a user', () => {
            userStore.userDocuments = _documentUploads
            processDocuments.value = _processDocuments
            const test: ProcessDocument[] = []
            const documentIds = processDocuments.value.map((document) => (document.document))
            userStore.userDocuments.forEach((document) => {
                if (documentIds.includes(document.document)) {
                    test.push({
                        id: document.id,
                        document: document.document,
                        pathFile: import.meta.env.VITE_APP_BASE_URL + document.pathFile as string,
                        name: document.name as string
                    })
                }
            })
            initUserDocumentUploads()
            expect(documentUploads.value).toEqual(test)
        })
    })

    describe('getDocuments', () => {
        describe('if all process documents are required', () => {
            it('should get all documents', async () => {
                mockedAxios.get.mockResolvedValueOnce({data: _documents})
                await getDocuments('all')
                expect(axiosPublic.get).toHaveBeenCalledOnce()
                expect(axiosPublic.get).toHaveBeenCalledWith('/documents/')
                expect(documents.value).toEqual(_documents)
            })
        })
        describe('if all process documents are required', () => {
            it('should get specified document process type', async () => {
                mockedAxios.get.mockResolvedValueOnce({data: _documents})
                await getDocuments(['DOCUMENT_PROJECT', 'DOCUMENT_PROJECT_REVIEW'])
                expect(axiosPublic.get).toHaveBeenCalledOnce()
                expect(axiosPublic.get).toHaveBeenCalledWith('/documents/?process_types=DOCUMENT_PROJECT,DOCUMENT_PROJECT_REVIEW')
                expect(documents.value).toEqual(_documents)
            })
        })
    })

    describe('getStudentCertificate', () => {
        it('should call the API (get) to get the corresponding document', async () => {
            mockedAxios.get.mockResolvedValueOnce({data: [_document]})
            await getStudentCertificate()
            expect(axiosPublic.get).toHaveBeenCalledOnce()
            expect(axiosPublic.get).toHaveBeenCalledWith('/documents/?process_types=DOCUMENT_USER')
            expect(documents.value).toEqual([_document])
        })
    })

    describe('DocumentUpload class', () => {
        describe('if the upload is made by an association', () => {
            describe('constructor', () => {
                it('should construct an upload document object', () => {
                    projectStore.project = _project
                    const _blob = new Blob
                    const documentUpload = new DocumentUpload(_blob, 1, undefined, 12)
                    expect(documentUpload.file).toEqual(_blob)
                    expect(documentUpload.association).toEqual('1')
                    expect(documentUpload.user).toEqual('')
                    expect(documentUpload.document).toEqual('12')
                    expect(documentUpload.project).toEqual(projectStore.project?.id.toString())
                })
            })

            describe('formData', () => {
                it('should return a new formData', () => {
                    const _blob = new Blob
                    projectStore.project = _project
                    const documentUpload = new DocumentUpload(_blob, 1, undefined, 12)
                    const _formData = new FormData()
                    _formData.append('pathFile', _blob)
                    _formData.append('document', '12')
                    _formData.append('project', projectStore.project?.id.toString())
                    _formData.append('association', '1')
                    expect(documentUpload.formData()).toEqual(_formData)
                })
            })
        })
        describe('if the upload is made by a user', () => {
            describe('constructor', () => {
                it('should construct an upload document object', () => {
                    projectStore.project = _project
                    const _blob = new Blob
                    const documentUpload = new DocumentUpload(_blob, undefined, 'username', 12)
                    expect(documentUpload.file).toEqual(_blob)
                    expect(documentUpload.association).toEqual('')
                    expect(documentUpload.user).toEqual('username')
                    expect(documentUpload.document).toEqual('12')
                    expect(documentUpload.project).toEqual(projectStore.project?.id.toString())
                })
            })

            describe('formData', () => {
                it('should return a new formData', () => {
                    const _blob = new Blob
                    projectStore.project = _project
                    const documentUpload = new DocumentUpload(_blob, undefined, 'username', 12)
                    const _formData = new FormData()
                    _formData.append('pathFile', _blob)
                    _formData.append('document', '12')
                    _formData.append('project', projectStore.project?.id.toString())
                    _formData.append('user', 'username')
                    expect(documentUpload.formData()).toEqual(_formData)
                })
            })
        })
    })

    describe('uploadDocuments', () => {
        it('should post all documents required in the ongoing process', async () => {
            processDocuments.value = _processDocuments as ProcessDocument[]
            await uploadDocuments(1, undefined, false)
            expect(axiosAuthenticated.post).toHaveBeenCalledTimes(3)
            const documentUpload = new DocumentUpload(processDocuments.value[1].pathFile as Blob, 1, undefined, processDocuments.value[1].document as number)
            const documentData = documentUpload.formData()
            expect(axiosAuthenticated.post).toHaveBeenLastCalledWith('/documents/uploads', documentData)
        })
    })

    describe('deleteDocumentUpload', () => {
        it('should delete document on the API and splice it from documentUploads ref', async () => {
            documentUploads.value = _processDocuments as ProcessDocument[]
            await deleteDocumentUpload(1)
            expect(axiosAuthenticated.delete).toHaveBeenCalledOnce()
            expect(documentUploads.value.length).toEqual(1)
            expect(documentUploads.value[0].id).toEqual(2)
        })
    })

    describe('getFile', () => {
        it('should get file', async () => {
            mockedAxios.get.mockResolvedValueOnce({data: {}})
            const file = await getFile('path')
            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith('path', {responseType: 'blob'})
            expect(file).toEqual({})
        })
    })
})
