import {createTestingPinia} from '@pinia/testing'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {config} from '@vue/test-utils'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {createPinia, setActivePinia} from 'pinia'
import useProjectDocuments from '@/composables/useProjectDocuments'
import {useAxios} from '@/composables/useAxios'
import {_documents, _processDocuments} from '~/fixtures/document.mock'
import {useProjectStore} from '@/stores/useProjectStore'
import {_project} from '~/fixtures/project.mock'
import type {ProcessDocument} from '#/documents'

vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))

vi.mock('@/composable/useUserAssociations', () => ({
    default: () => ({
        updateUserAssociations: vi.fn(),
        deleteUserAssociation: vi.fn(),
        getUserAssociations: vi.fn(),
        patchUserAssociations: vi.fn()
    })
}))

setActivePinia(createPinia())

let projectStore = useProjectStore()

config.global.plugins = [
    createTestingPinia({
        createSpy: vi.fn()
    })
]

describe('useProjectDocuments', () => {
    beforeEach(() => {
        projectStore = useProjectStore()
    })

    afterEach(() => {
        vi.restoreAllMocks()
        projectStore.project = undefined
        documentUploads.value = []
    })

    const {
        documents,
        getDocuments,
        DocumentUpload,
        processDocuments,
        uploadDocuments,
        deleteDocumentUpload,
        documentUploads
    } = useProjectDocuments()
    const {axiosPublic, axiosAuthenticated} = useAxios()

    describe('getDocumentTypes', () => {
        it('should get documents on /documents/', async () => {
            const mockedAxios = vi.mocked(axiosPublic, true)
            mockedAxios.get.mockResolvedValueOnce({data: _documents})
            await getDocuments('all')
            expect(axiosPublic.get).toHaveBeenCalledOnce()
            expect(axiosPublic.get).toHaveBeenCalledWith('/documents/')
            expect(documents.value).toEqual(_documents)
        })
    })

    describe('DocumentUpload class', () => {
        describe('constructor', () => {
            it('should construct an upload document object', () => {
                projectStore.project = _project
                const _blob = new Blob
                const documentUpload = new DocumentUpload(_blob, 1, 12)
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
                const documentUpload = new DocumentUpload(_blob, 1, 12)
                const _formData = new FormData()
                _formData.append('pathFile', _blob)
                _formData.append('document', '12')
                _formData.append('project', projectStore.project?.id.toString())
                _formData.append('association', '1')
                expect(documentUpload.formData()).toEqual(_formData)
            })
        })
    })

    describe('uploadDocuments', () => {
        processDocuments.value = _processDocuments as ProcessDocument[]

        it('should post all documents required in the ongoing process', async () => {
            await uploadDocuments(1)
            expect(axiosAuthenticated.post).toHaveBeenCalledTimes(3)
            const documentUpload = new DocumentUpload(processDocuments.value[1].pathFile as Blob, 1, processDocuments.value[1].document as number)
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
})
