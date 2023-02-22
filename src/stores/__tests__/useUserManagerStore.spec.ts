import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { _user, _userAssociationDetail, _userGroupList, _userGroups, _users } from '~/fixtures/user.mock'
import { useUserManagerStore } from '@/stores/useUserManagerStore'
import { _axiosFixtures } from '~/fixtures/axios.mock'
import { useAxios } from '@/composables/useAxios'


vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))


setActivePinia(createPinia())
let userManagerStore = useUserManagerStore()

describe('User manager store', () => {
    beforeEach(() => {
        userManagerStore = useUserManagerStore()
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })
    describe('getUsers', () => {
        beforeEach(() => {
            const { axiosAuthenticated } = useAxios()
            const mockedAxios = vi.mocked(axiosAuthenticated, true)
            mockedAxios.get.mockResolvedValueOnce({ data: _users })
            userManagerStore.getUsers()
        })
        it('should call API once on /users/', () => {
            const { axiosAuthenticated } = useAxios()
            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith('/users/')
        })
        it('should populate users state', () => {
            expect(userManagerStore.users).toEqual(_users)
        })
    })
    describe('getUnvalidatedUsers', () => {
        beforeEach(() => {
            const { axiosAuthenticated } = useAxios()
            const mockedAxios = vi.mocked(axiosAuthenticated, true)
            mockedAxios.get.mockResolvedValueOnce({ data: _users })
            userManagerStore.getUnvalidatedUsers()
        })
        it('should call API once on /users/?is_validated_by_admin=false', () => {
            const { axiosAuthenticated } = useAxios()
            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith('/users/?is_validated_by_admin=false')
        })
        it('should populate users state', () => {
            expect(userManagerStore.users).toEqual(_users)
        })
    })
    describe('getUserDetail', () => {
        beforeEach(() => {
            const { axiosAuthenticated } = useAxios()
            const mockedAxios = vi.mocked(axiosAuthenticated, true)
            mockedAxios.get.mockResolvedValueOnce({ data: _user })
            mockedAxios.get.mockResolvedValueOnce({ data: _userGroups })
            userManagerStore.getUserDetail(_user.id)
        })
        it('should call API to get user and groups', () => {
            const { axiosAuthenticated } = useAxios()
            expect(axiosAuthenticated.get).toHaveBeenCalledTimes(2)
            expect(axiosAuthenticated.get).toHaveBeenCalledWith(`/users/${_user.id}`)
            expect(axiosAuthenticated.get).toHaveBeenCalledWith(`/users/groups/${_user.id}`)
        })
        it('should populate user state and groups', () => {
            expect(userManagerStore.user).toEqual(_user)
            expect(userManagerStore.user?.groups).toEqual(_userGroups)
        })
    })
    describe('updateUserGroups', () => {
        beforeEach(() => {
            userManagerStore.user = _user
            userManagerStore.updateUserGroups(_userGroupList)
        })
        it('should call API once on /users/groups/ with groups as payload', () => {
            const { axiosAuthenticated } = useAxios()
            expect(axiosAuthenticated.post).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.post).toHaveBeenCalledWith('/users/groups/', {
                username: userManagerStore.user?.username,
                groups: _userGroupList
            })
        })
    })
    describe('deleteUserGroups', () => {
        beforeEach(() => {
            userManagerStore.user = _user
            userManagerStore.deleteUserGroups([3, 2])
        })
        it('should call API for each group', () => {
            const { axiosAuthenticated } = useAxios()
            expect(axiosAuthenticated.delete).toHaveBeenCalledTimes(2)
        })
        it('should call API on /users/groups/userId/groupId', () => {
            const { axiosAuthenticated } = useAxios()
            expect(axiosAuthenticated.delete).toHaveBeenCalledWith(
                `/users/groups/${userManagerStore.user?.id}/${3}`
            )
        })
    })
    describe('validateUser', () => {
        beforeEach(() => {
            userManagerStore.user = _user
            userManagerStore.validateUser()
        })
        it('should call API once on /users/id with isValidated as payload', () => {
            const { axiosAuthenticated } = useAxios()
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith(`/users/${userManagerStore.user?.id}`, {
                isValidatedByAdmin: true
            })
        })
    })
    describe('deleteUser', () => {
        beforeEach(() => {
            userManagerStore.user = _user
            userManagerStore.deleteUser()
        })
        it('should call API once on /users/id', () => {
            const { axiosAuthenticated } = useAxios()
            expect(axiosAuthenticated.delete).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.delete).toHaveBeenCalledWith(`/users/${userManagerStore.user?.id}`)
        })
    })
    describe('getUserAssociations', () => {
        it('should call API once on /users/associations/id and populate userAssociations', async () => {
            const { axiosAuthenticated } = useAxios()
            const mockedAxios = vi.mocked(axiosAuthenticated, true)
            mockedAxios.get.mockResolvedValueOnce({ data: _userAssociationDetail })
            await userManagerStore.getUserAssociations(1)
            expect(mockedAxios.get).toHaveBeenCalledOnce()
            expect(mockedAxios.get).toHaveBeenCalledWith('/users/associations/1')
            expect(userManagerStore.userAssociations).toEqual(_userAssociationDetail)
        })
    })
    describe('deleteUserAssociation', () => {
        it('should call API once on /users/associations/userId/associationId', async () => {
            userManagerStore.user = _user
            const { axiosAuthenticated } = useAxios()
            await userManagerStore.deleteUserAssociation(1)
            expect(axiosAuthenticated.delete).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.delete).toHaveBeenCalledWith(`/users/associations/${userManagerStore.user?.id}/1`)
        })
    })
    describe('patchUserAssociations', () => {
        it('should call API once on /users/associations/userId/associationId with data to patch as payload', async () => {
            userManagerStore.user = _user
            const dataToPatch = {
                isPresident: false,
                canBePresident: true,
                isSecretary: false,
                isTreasurer: true,
            }
            await userManagerStore.patchUserAssociations(1, dataToPatch)
            const { axiosAuthenticated } = useAxios()
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith(`/users/associations/${userManagerStore.user?.id}/1`, dataToPatch)
        })
    })
    describe('updateUserInfos', () => {
        it('should only patch changed infos on /users/userId', async () => {
            userManagerStore.user = _user
            const userToUpdate = {
                firstName: 'Jane',
                lastName: _user.lastName,
                email: 'jane@lennon.uk',
                phone: _user.phone
            }
            await userManagerStore.updateUserInfos(userToUpdate)
            const { axiosAuthenticated } = useAxios()
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith(`/users/${userManagerStore.user?.id}`, {
                firstName: 'Jane',
                email: 'jane@lennon.uk'
            })
        })
        it('should not patch anything if there are no changes', async () => {
            userManagerStore.user = _user
            const userToUpdate = {
                firstName: _user.firstName,
                lastName: _user.lastName,
                email: _user.email,
                phone: _user.phone
            }
            await userManagerStore.updateUserInfos(userToUpdate)
            const { axiosAuthenticated } = useAxios()
            expect(axiosAuthenticated.patch).toHaveBeenCalledTimes(0)
        })
    })
})
