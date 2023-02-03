import {createTestingPinia} from '@pinia/testing'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {config} from '@vue/test-utils'
import useDirectory from '@/composables/useDirectory'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {_associations, _associationSearchSettings, _associationWrongSearchSettings} from '~/fixtures/association.mock'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {useAxios} from '@/composables/useAxios'


vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))

config.global.plugins = [
    createTestingPinia({createSpy: vi.fn()}),
]

describe('useDirectory', () => {
    let associationStore = useAssociationStore()

    beforeEach(() => {
        associationStore = useAssociationStore()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })
    describe('Get association detail', () => {
        it('should call getAssociationDetail in store with id type number', async () => {
            const spy = vi.spyOn(associationStore, 'getAssociationDetail')
            const {getAssociationDetail} = useDirectory()

            await getAssociationDetail('1')

            expect(spy).toHaveBeenCalledOnce()
            expect(spy).toHaveBeenCalledWith(1)
        })
    })
    describe('advancedSearch', () => {
        it('should return the associations with matching search parameters', () => {
            associationStore.associations = _associations
            const {advancedSearch} = useDirectory()
            const matches = advancedSearch(_associationSearchSettings)
            expect(matches).toEqual([_associations[1]])
        })
        it('should not return the associations with no matching search parameters', () => {
            associationStore.associations = _associations
            const {advancedSearch} = useDirectory()
            const matches = advancedSearch(_associationWrongSearchSettings)
            expect(matches).not.toEqual([_associations[1]])
        })
    })
    describe('simpleAssociationSearch', () => {
        it('should call API once on /associations/?is_public=true&search=query', () => {
            const {simpleAssociationSearch} = useDirectory()
            const {axiosPublic} = useAxios()
            const mockedAxios = vi.mocked(axiosPublic, true)
            mockedAxios.get.mockResolvedValueOnce({})
            simpleAssociationSearch('query')
            expect(axiosPublic.get).toHaveBeenCalledOnce()
            expect(axiosPublic.get).toHaveBeenCalledWith('/associations/?is_public=true&search=query')
        })
    })
})
