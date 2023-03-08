import {createTestingPinia} from '@pinia/testing'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {config} from '@vue/test-utils'
import useUsers from '@/composables/useUsers'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {createPinia, setActivePinia} from 'pinia'
import {useUserStore} from '@/stores/useUserStore'
import {_institutionManager} from '~/fixtures/user.mock'
import useUserGroups from '@/composables/useUserGroups'
import {_groups} from '~/fixtures/group.mock'

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
    let userStore = useUserStore()

    beforeEach(() => {
        userManagerStore = useUserManagerStore()
        userStore = useUserStore()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('getUsers', () => {
        const spies = {
            getUsers: vi.spyOn(userManagerStore, 'getUsers'),
            getUnvalidatedUsers: vi.spyOn(userManagerStore, 'getUnvalidatedUsers')
        }

        userStore.user = _institutionManager

        it('should call getUsers if route is ManageUsers and manager has permission', async () => {
            const {getUsers} = useUsers()
            await getUsers('ManageUsers')
            expect(spies.getUsers).toHaveBeenCalledOnce()
        })

        it('should call getUnvalidatedUsers if route is ValidateUsers and manager has permission', async () => {
            const {getUsers} = useUsers()
            await getUsers('ValidateUsers')
            expect(spies.getUnvalidatedUsers).toHaveBeenCalledOnce()
        })
    })

    /*describe('validateUser', () => {
        const {newGroups} = useUserGroups()
        const spies = {
            updateUserGroups: vi.spyOn(userManagerStore, 'updateUserGroups'),
            deleteUserGroups: vi.spyOn(userManagerStore, 'deleteUserGroups'),
            validateUser: vi.spyOn(userManagerStore, 'validateUser'),
        }
        describe('If newGroups and oldGroups are not the same', () => {
            it('should update groups and call API for post and delete', async () => {
                newGroups.value = [7, 8, 3]
                userManagerStore.user = _institutionStudent
                const {validateUser} = useUsers()
                await validateUser()
                expect(spies.updateUserGroups).toHaveBeenCalledOnce()
                expect(spies.deleteUserGroups).toHaveBeenCalledOnce()
                expect(spies.validateUser).toHaveBeenCalledOnce()
            })
        })

        describe('If newGroups and oldGroups are the same', () => {
            it('should not update groups', async () => {
                userManagerStore.user = _institutionStudent
                newGroups.value = [6]
                const {validateUser} = useUsers()
                await validateUser()
                expect(spies.updateUserGroups).toHaveBeenCalledTimes(0)
                expect(spies.deleteUserGroups).toHaveBeenCalledTimes(0)
                expect(spies.validateUser).toHaveBeenCalledOnce()
            })
        })
    })*/

    /*describe('updateUserAssociations', () => {
        const {userAssociations, updateUserAssociations} = useUsers()

        const spies = {
            deleteUserAssociation: vi.spyOn(userManagerStore, 'deleteUserAssociation'),
            patchUserAssociations: vi.spyOn(userManagerStore, 'patchUserAssociations')
        }

        it('should delete userAssociations if the associations deleteAssociation params are set to true', () => {
            userAssociations.value = JSON.parse(JSON.stringify([_associationRole]))
            userAssociations.value[0].deleteAssociation = true
            updateUserAssociations()
            expect(spies.deleteUserAssociation).toHaveBeenCalledOnce()
        })

        it('should patch userAssociations if there are changes', () => {
            userAssociations.value = JSON.parse(JSON.stringify([_associationRole]))
            userManagerStore.userAssociations = JSON.parse(JSON.stringify([_userAssociationDetail]))
            userManagerStore.userAssociations[0].isPresident = false
            userManagerStore.userAssociations[0].isSecretary = true
            updateUserAssociations()
            expect(spies.patchUserAssociations).toHaveBeenCalledTimes(userAssociations.value.length)
        })
    })*/

    describe('canEditUser', () => {
        const {groups} = useUserGroups()
        const {canEditUser} = useUsers()

        beforeEach(() => {
            groups.value = _groups
        })

        afterEach(() => {
            groups.value = []
        })

        it('should return true if the user is not a member of a private group', () => {
            const perm = canEditUser([{userId: 1, groupId: 6}])
            expect(perm).toBeTruthy()
        })

        it('should return false if the user is a member of a private group', () => {
            const perm = canEditUser([{userId: 2, groupId: 1}])
            expect(perm).toBeFalsy()
        })
    })
})
