import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {config} from '@vue/test-utils'
import {createTestingPinia} from '@pinia/testing'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import useUsers from '@/composables/useUsers'
import {mockedUserGroups} from "../../../tests/mocks/user.mock";


config.global.plugins = [
    createTestingPinia({createSpy: vi.fn()}),
]

describe('useUsers', () => {
    let userManagerStore = useUserManagerStore()

    beforeEach(() => {
        userManagerStore = useUserManagerStore()
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })
    describe('getUser', () => {
        it('should call getUserDetail in store with id type number', async () => {
            const spy = vi.spyOn(userManagerStore, 'getUserDetail')
            const {getUser} = useUsers()

            await getUser('1')

            expect(spy).toHaveBeenCalledOnce()
            expect(spy).toHaveBeenCalledWith(1)
        })
    })
    describe('validateUser', () => {
        const spies = {
            validateUser: vi.spyOn(userManagerStore, 'validateUser')
        }
        describe('If ')
        it('should call validateUser in store', async () => {
            const {validateUser} = useUsers()

            await validateUser(mockedUserGroups)

            expect(spies.validateUser).toHaveBeenCalledOnce()
        })
    })
})