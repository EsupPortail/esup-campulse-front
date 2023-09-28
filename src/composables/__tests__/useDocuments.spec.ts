import {createTestingPinia} from '@pinia/testing'
import {afterEach, beforeEach, describe, vi, it, expect} from 'vitest'
import {config} from '@vue/test-utils'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {createPinia, setActivePinia} from 'pinia'
import {useAxios} from '@/composables/useAxios'
import {useProjectStore} from '@/stores/useProjectStore'
import useDocuments from '@/composables/useDocuments'

vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))

setActivePinia(createPinia())

let projectStore = useProjectStore()

config.global.plugins = [
    createTestingPinia({
        createSpy: vi.fn()
    })
]

describe('useDocuments', () => {
    beforeEach(() => {
        projectStore = useProjectStore()
    })

    afterEach(() => {
        vi.restoreAllMocks()
        projectStore.project = undefined
    })

    const {
        getLibraryDocuments,
        documents,
        postNewDocument,
        patchDocument,
        deleteDocument,
        libraryProcesses
    } = useDocuments()
    const {axiosPublic, axiosAuthenticated} = useAxios()
    const mockedPublicAxios = vi.mocked(axiosPublic, true)

    const name = 'document'
    const file = new File([], 'file')
    const newDocument = new FormData()
    newDocument.append('name', name)
    newDocument.append('pathTemplate', file)

    describe('getLibraryDocuments', () => {
        it('should get documents of the library processes', async () => {
            mockedPublicAxios.get.mockResolvedValueOnce({data: []})
            await getLibraryDocuments()
            expect(axiosPublic.get).toHaveBeenCalledOnce()
            expect(axiosPublic.get).toHaveBeenCalledWith(`/documents/?process_types=${libraryProcesses.join(',')}`)
            expect(documents.value).toEqual([])
        })
    })
    describe('postNewDocument', () => {
        it('should post a new document', async () => {
            await postNewDocument(name, file)
            expect(axiosAuthenticated.post).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.post).toHaveBeenCalledWith('/documents/', newDocument)
        })
    })
    describe('patchDocument', () => {
        it('should patch document', async () => {
            await patchDocument(1, name, file)
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith('/documents/1', newDocument)
        })
    })
    describe('deleteDocument', () => {
        it('should delete document', async () => {
            await deleteDocument(1)
            expect(axiosAuthenticated.delete).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.delete).toHaveBeenCalledWith('/documents/1')
        })
    })
})
