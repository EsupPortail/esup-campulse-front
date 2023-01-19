import { mockedAxios } from '~/mocks/axios.mock'
import useAssociation from '@/composables/useAssociation'
import { describe, expect, it, vi } from 'vitest'
import { config } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'


config.global.plugins = [
    createTestingPinia({ createSpy: vi.fn() }),
]

describe('useAssociation', () => {
    const { createAssociation } = useAssociation()
    /*let userStore = useUserStore()
    let associationStore = useAssociationStore()
    beforeEach(() => {
        userStore = useUserStore()
        associationStore = useAssociationStore()
    })*/

    describe('createAssociation', () => {
        it('should call API only once on /associations/ with name as payload', async () => {
            const { createAssociation } = useAssociation()
            await createAssociation("Association test")
            expect(mockedAxios.post).toHaveBeenCalledOnce()
            expect(mockedAxios.post).toHaveBeenCalledWith('/associations/', { name: 'Association test' })
        })
    })
})
