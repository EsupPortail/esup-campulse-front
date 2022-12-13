import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {config} from '@vue/test-utils'
import {createTestingPinia} from '@pinia/testing'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import useUsers from '@/composables/useUsers'
import {mockedUser, mockedUserGroups} from '~/mocks/user.mock'


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
            updateUserGroups: vi.spyOn(userManagerStore, 'updateUserGroups'),
            deleteUserGroups: vi.spyOn(userManagerStore, 'deleteUserGroups'),
            validateUser: vi.spyOn(userManagerStore, 'validateUser'),
            unLoadUsers: vi.spyOn(userManagerStore, 'unLoadUsers')
        }
        describe('If newGroups and oldGroups are not the same', () => {
            it('should update groups and call API for post and delete', async () => {
                const newGroups = [7, 8, 3]
                userManagerStore.user = mockedUser
                const {validateUser} = useUsers()
                await validateUser(newGroups)
                expect(spies.updateUserGroups).toHaveBeenCalledOnce()
                expect(spies.deleteUserGroups).toHaveBeenCalledOnce()
                expect(spies.validateUser).toHaveBeenCalledOnce()
                expect(spies.unLoadUsers).toHaveBeenCalledOnce()
            })
        })
        describe('If newGroups and oldGroups are the same', () => {
            it('should not update groups', async () => {
                userManagerStore.user = mockedUser
                const {validateUser} = useUsers()
                await validateUser(mockedUserGroups)
                expect(spies.updateUserGroups).toHaveBeenCalledTimes(0)
                expect(spies.deleteUserGroups).toHaveBeenCalledTimes(0)
                expect(spies.validateUser).toHaveBeenCalledOnce()
                expect(spies.unLoadUsers).toHaveBeenCalledOnce()
            })
        })
    })
})