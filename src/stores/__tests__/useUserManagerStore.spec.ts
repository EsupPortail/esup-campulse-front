import {createPinia, setActivePinia} from 'pinia'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {
    mockedGroups,
    mockedUser,
    mockedUserAssociationDetail,
    mockedUserGroups,
    mockedUsers
} from '~/fixtures/user.mock'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {axiosFixtures} from '~/fixtures/axios.mock'
import {useAxios} from '@/composables/useAxios'


vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: axiosFixtures,
        axiosAuthenticated: axiosFixtures
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
            const {axiosAuthenticated} = useAxios()
            const mockedAxios = vi.mocked(axiosAuthenticated, true)
            mockedAxios.get.mockResolvedValueOnce({data: mockedUsers})
            userManagerStore.getUsers()
        })
        it('should call API once on /users/', () => {
            const {axiosAuthenticated} = useAxios()
            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith('/users/')
        })
        it('should populate users state', () => {
            expect(userManagerStore.users).toEqual(mockedUsers)
        })
    })
    describe('getUnvalidatedUsers', () => {
        beforeEach(() => {
            const {axiosAuthenticated} = useAxios()
            const mockedAxios = vi.mocked(axiosAuthenticated, true)
            mockedAxios.get.mockResolvedValueOnce({data: mockedUsers})
            userManagerStore.getUnvalidatedUsers()
        })
        it('should call API once on /users/?is_validated_by_admin=false', () => {
            const {axiosAuthenticated} = useAxios()
            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith('/users/?is_validated_by_admin=false')
        })
        it('should populate users state', () => {
            expect(userManagerStore.users).toEqual(mockedUsers)
        })
    })
    describe('getUserDetail', () => {
        beforeEach(() => {
            const {axiosAuthenticated} = useAxios()
            const mockedAxios = vi.mocked(axiosAuthenticated, true)
            mockedAxios.get.mockResolvedValueOnce({data: mockedUser})
            mockedAxios.get.mockResolvedValueOnce({data: mockedGroups})
            userManagerStore.getUserDetail(mockedUser.id)
        })
        it('should call API to get user and groups', () => {
            const {axiosAuthenticated} = useAxios()
            expect(axiosAuthenticated.get).toHaveBeenCalledTimes(2)
            expect(axiosAuthenticated.get).toHaveBeenCalledWith(`/users/${mockedUser.id}`)
            expect(axiosAuthenticated.get).toHaveBeenCalledWith(`/users/groups/${mockedUser.id}`)
        })
        it('should populate user state and groups', () => {
            expect(userManagerStore.user).toEqual(mockedUser)
            expect(userManagerStore.user?.groups).toEqual(mockedGroups)
        })
    })
    describe('updateUserGroups', () => {
        beforeEach(() => {
            userManagerStore.user = mockedUser
            userManagerStore.updateUserGroups(mockedUserGroups)
        })
        it('should call API once on /users/groups/ with groups as payload', () => {
            const {axiosAuthenticated} = useAxios()
            expect(axiosAuthenticated.post).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.post).toHaveBeenCalledWith('/users/groups/', {
                username: userManagerStore.user?.username,
                groups: mockedUserGroups
            })
        })
    })
    describe('deleteUserGroups', () => {
        beforeEach(() => {
            userManagerStore.user = mockedUser
            userManagerStore.deleteUserGroups([3, 2])
        })
        it('should call API for each group', () => {
            const {axiosAuthenticated} = useAxios()
            expect(axiosAuthenticated.delete).toHaveBeenCalledTimes(2)
        })
        it('should call API on /users/groups/userId/groupId', () => {
            const {axiosAuthenticated} = useAxios()
            expect(axiosAuthenticated.delete).toHaveBeenCalledWith(
                `/users/groups/${userManagerStore.user?.id}/${3}`
            )
        })
    })
    describe('validateUser', () => {
        beforeEach(() => {
            userManagerStore.user = mockedUser
            userManagerStore.validateUser()
        })
        it('should call API once on /users/id with isValidated as payload', () => {
            const {axiosAuthenticated} = useAxios()
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith(`/users/${userManagerStore.user?.id}`, {
                isValidatedByAdmin: true
            })
        })
    })
    describe('deleteUser', () => {
        beforeEach(() => {
            userManagerStore.user = mockedUser
            userManagerStore.deleteUser()
        })
        it('should call API once on /users/id', () => {
            const {axiosAuthenticated} = useAxios()
            expect(axiosAuthenticated.delete).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.delete).toHaveBeenCalledWith(`/users/${userManagerStore.user?.id}`)
        })
    })
    describe('getUserAssociations', () => {
        it('should call API once on /users/associations/id and populate userAssociations', async () => {
            const {axiosAuthenticated} = useAxios()
            const mockedAxios = vi.mocked(axiosAuthenticated, true)
            mockedAxios.get.mockResolvedValueOnce({data: mockedUserAssociationDetail})
            await userManagerStore.getUserAssociations(1)
            expect(mockedAxios.get).toHaveBeenCalledOnce()
            expect(mockedAxios.get).toHaveBeenCalledWith('/users/associations/1')
            expect(userManagerStore.userAssociations).toEqual(mockedUserAssociationDetail)
        })
    })
    describe('deleteUserAssociation', () => {
        it('should call API once on /users/associations/userId/associationId', async () => {
            userManagerStore.user = mockedUser
            const {axiosAuthenticated} = useAxios()
            await userManagerStore.deleteUserAssociation(1)
            expect(axiosAuthenticated.delete).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.delete).toHaveBeenCalledWith(`/users/associations/${userManagerStore.user.id}/1`)
        })
    })
    describe('patchUserAssociations', () => {
        it('should call API once on /users/associations/userId/associationId with data to patch as payload', async () => {
            userManagerStore.user = mockedUser
            const dataToPatch = {
                roleName: 'Trésorier',
                hasOfficeStatus: true,
                isPresident: false
            }
            await userManagerStore.patchUserAssociations(1, dataToPatch)
            const {axiosAuthenticated} = useAxios()
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith(`/users/associations/${userManagerStore.user.id}/1`, dataToPatch)
        })
    })
    describe('updateUserInfos', () => {
        it('should only patch changed infos on /users/userId', async () => {
            userManagerStore.user = mockedUser
            const userToUpdate = {
                firstName: 'Jane',
                lastName: mockedUser.lastName,
                email: 'jane@lennon.uk',
                phone: mockedUser.phone
            }
            await userManagerStore.updateUserInfos(userToUpdate)
            const {axiosAuthenticated} = useAxios()
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith(`/users/${userManagerStore.user?.id}`, {
                firstName: 'Jane',
                email: 'jane@lennon.uk'
            })
        })
        it('should not patch anything if there are no changes', async () => {
            userManagerStore.user = mockedUser
            const userToUpdate = {
                firstName: mockedUser.firstName,
                lastName: mockedUser.lastName,
                email: mockedUser.email,
                phone: mockedUser.phone
            }
            await userManagerStore.updateUserInfos(userToUpdate)
            const {axiosAuthenticated} = useAxios()
            expect(axiosAuthenticated.patch).toHaveBeenCalledTimes(0)
        })
    })
})