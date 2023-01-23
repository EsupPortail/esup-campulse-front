import {createTestingPinia} from '@pinia/testing'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {config} from '@vue/test-utils'
import useDirectory from '@/composables/useDirectory'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {associations, associationSearchSettings, associationWrongSearchSettings} from '~/mocks/association.mock'


vi.mock('@/plugins/axios')

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
            associationStore.associations = associations
            const {advancedSearch} = useDirectory()
            const matches = advancedSearch(associationSearchSettings)
            expect(matches).toEqual([associations[1]])
        })
        it('should not return the associations with no matching search parameters', () => {
            associationStore.associations = associations
            const {advancedSearch} = useDirectory()
            const matches = advancedSearch(associationWrongSearchSettings)
            expect(matches).not.toEqual([associations[1]])
        })
    })
})
