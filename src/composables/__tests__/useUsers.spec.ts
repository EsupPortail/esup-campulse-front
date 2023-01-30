import type {RouteLocationNormalizedLoaded} from 'vue-router'
import {useRoute} from 'vue-router'
import {createTestingPinia} from '@pinia/testing'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {config} from '@vue/test-utils'

import {
    mockedUser,
    mockedUserAssociationDetail,
    mockedUserAssociationsManagement,
    mockedUserGroups
} from '~/mocks/user.mock'
import useUserGroups from '@/composables/useUserGroups'
import useUsers from '@/composables/useUsers'
import {useUserManagerStore} from '@/stores/useUserManagerStore'

vi.mock('vue-router', () => ({useRoute: vi.fn()}))

config.global.plugins = [
    createTestingPinia({
        createSpy: vi.fn()
    })
]

describe('useUsers', () => {
    let userManagerStore = useUserManagerStore()

    beforeEach(() => {
        userManagerStore = useUserManagerStore()
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })
    describe('getUsers', () => {
        const spies = {
            getUsers: vi.spyOn(userManagerStore, 'getUsers'),
            getUnvalidatedUsers: vi.spyOn(userManagerStore, 'getUnvalidatedUsers')
        }
        it('should call getUsers if route is /manage-users', () => {
            vi.mocked(useRoute).mockReturnValue({name: 'ManageUsers'} as RouteLocationNormalizedLoaded)
            const {getUsers} = useUsers()
            getUsers()
            expect(spies.getUsers).toHaveBeenCalledOnce()
        })
        it('should call getUnvalidatedUsers if route is /validate-users', () => {
            vi.mocked(useRoute).mockReturnValue({name: 'ValidateUsers'} as RouteLocationNormalizedLoaded)
            const {getUsers} = useUsers()
            getUsers()
            expect(spies.getUnvalidatedUsers).toHaveBeenCalledOnce()
        })
    })
    describe('validateUser', () => {
        const {newGroups} = useUserGroups()
        const spies = {
            updateUserGroups: vi.spyOn(userManagerStore, 'updateUserGroups'),
            deleteUserGroups: vi.spyOn(userManagerStore, 'deleteUserGroups'),
            validateUser: vi.spyOn(userManagerStore, 'validateUser'),
        }
        describe('If newGroups and oldGroups are not the same', () => {
            it('should update groups and call API for post and delete', async () => {
                newGroups.value = [7, 8, 3]
                userManagerStore.user = mockedUser
                const {validateUser} = useUsers()
                await validateUser()
                expect(spies.updateUserGroups).toHaveBeenCalledOnce()
                expect(spies.deleteUserGroups).toHaveBeenCalledOnce()
                expect(spies.validateUser).toHaveBeenCalledOnce()
            })
        })
        describe('If newGroups and oldGroups are the same', () => {
            it('should not update groups', async () => {
                userManagerStore.user = mockedUser
                newGroups.value = mockedUserGroups
                const {validateUser} = useUsers()
                await validateUser()
                expect(spies.updateUserGroups).toHaveBeenCalledTimes(0)
                expect(spies.deleteUserGroups).toHaveBeenCalledTimes(0)
                expect(spies.validateUser).toHaveBeenCalledOnce()
            })
        })
    })
    describe('updateUserAssociations', () => {
        it('should delete or patch associations infos', () => {
            const {userAssociations, updateUserAssociations} = useUsers()
            const spies = {
                deleteUserAssociation: vi.spyOn(userManagerStore, 'deleteUserAssociation'),
                patchUserAssociations: vi.spyOn(userManagerStore, 'patchUserAssociations')
            }
            userAssociations.value = mockedUserAssociationsManagement
            userManagerStore.userAssociations = [mockedUserAssociationDetail]
            const dataToPatch = {
                roleName: 'Trésorière',
                hasOfficeStatus: true,
                isPresident: false,
            }
            updateUserAssociations()
            expect(spies.deleteUserAssociation).toHaveBeenCalledOnce()
            expect(spies.deleteUserAssociation).toHaveBeenCalledWith(mockedUserAssociationsManagement[2].associationId)
            expect(spies.patchUserAssociations).toHaveBeenCalledOnce()
            expect(spies.patchUserAssociations).toHaveBeenCalledWith(mockedUserAssociationsManagement[1].associationId, dataToPatch)
        })
    })
})
