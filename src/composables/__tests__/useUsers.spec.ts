import { createTestingPinia } from '@pinia/testing'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { config } from '@vue/test-utils'

import { _userAssociationDetail, _userAssociationsManagement, _userGroupList } from '~/fixtures/user.mock'
import useUserGroups from '@/composables/useUserGroups'
import useUsers from '@/composables/useUsers'
import { useUserManagerStore } from '@/stores/useUserManagerStore'
import { _axiosFixtures } from "../../../tests/fixtures/axios.mock";
import { createPinia, setActivePinia } from "pinia";

vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))

setActivePinia(createPinia())

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
            const { getUsers } = useUsers()
            getUsers("ManageUsers")
            expect(spies.getUsers).toHaveBeenCalledOnce()
        })
        it('should call getUnvalidatedUsers if route is /validate-users', () => {
            const { getUsers } = useUsers()
            getUsers("ValidateUsers")
            expect(spies.getUnvalidatedUsers).toHaveBeenCalledOnce()
        })
    })
    describe('validateUser', () => {
        const { newGroups } = useUserGroups()
        const spies = {
            updateUserGroups: vi.spyOn(userManagerStore, 'updateUserGroups'),
            deleteUserGroups: vi.spyOn(userManagerStore, 'deleteUserGroups'),
            validateUser: vi.spyOn(userManagerStore, 'validateUser'),
        }
        describe('If newGroups and oldGroups are not the same', () => {
            it('should update groups and call API for post and delete', async () => {
                newGroups.value = [7, 8, 3]
                userManagerStore.user = _user
                const { validateUser } = useUsers()
                await validateUser()
                expect(spies.updateUserGroups).toHaveBeenCalledOnce()
                expect(spies.deleteUserGroups).toHaveBeenCalledOnce()
                expect(spies.validateUser).toHaveBeenCalledOnce()
            })
        })
        describe('If newGroups and oldGroups are the same', () => {
            it('should not update groups', async () => {
                userManagerStore.user = _user
                newGroups.value = _userGroupList
                const { validateUser } = useUsers()
                await validateUser()
                expect(spies.updateUserGroups).toHaveBeenCalledTimes(0)
                expect(spies.deleteUserGroups).toHaveBeenCalledTimes(0)
                expect(spies.validateUser).toHaveBeenCalledOnce()
            })
        })
    })
    describe('updateUserAssociations', () => {
        it('should delete or patch associations infos', () => {
            const { userAssociations, updateUserAssociations } = useUsers()
            const spies = {
                deleteUserAssociation: vi.spyOn(userManagerStore, 'deleteUserAssociation'),
                patchUserAssociations: vi.spyOn(userManagerStore, 'patchUserAssociations')
            }
            userAssociations.value = _userAssociationsManagement
            userManagerStore.userAssociations = [_userAssociationDetail]
            const dataToPatch = {
                isPresident: false,
                canBePresident: true,
                isTreasurer: true,
            }
            updateUserAssociations()
            expect(spies.deleteUserAssociation).toHaveBeenCalledOnce()
            expect(spies.deleteUserAssociation).toHaveBeenCalledWith(_userAssociationsManagement[2].associationId)
            expect(spies.patchUserAssociations).toHaveBeenCalledOnce()
            expect(spies.patchUserAssociations).toHaveBeenCalledWith(_userAssociationsManagement[1].associationId, dataToPatch)
        })
    })
})
