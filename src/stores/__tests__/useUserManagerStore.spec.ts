import {createPinia, setActivePinia} from 'pinia'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {_manager, _newUserGroups, _student, _userAssociations, _users, _usersNames} from '~/fixtures/user.mock'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {useAxios} from '@/composables/useAxios'
import {useUserStore} from "../useUserStore";
import type {AxiosResponse} from "axios";


vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))


setActivePinia(createPinia())
let userManagerStore = useUserManagerStore()
let userStore = useUserStore()

describe('User manager store', () => {
    beforeEach(() => {
        userManagerStore = useUserManagerStore()
        userStore = useUserStore()

    })
    afterEach(() => {
        vi.restoreAllMocks()
        userStore.user = undefined
    })

    describe('userNames', () => {
        it('should return an array of user objects with user IDs ans concatenated names', () => {
            userManagerStore.users = _users
            expect(userManagerStore.userNames).toEqual(_usersNames)
        })
    })

    describe('userGroups', () => {
        it('should return an array of group IDs', () => {
            userManagerStore.user = _manager
            expect(userManagerStore.userGroups).toEqual([1, 2, 3])
        })
    })

    describe('getUsers', () => {
        const {axiosAuthenticated} = useAxios()
        const mockedAxios = vi.mocked(axiosAuthenticated, true)

        it('should call API once on /users/?institutions if user is linked to institutions', async () => {
            userStore.user = _manager
            mockedAxios.get.mockResolvedValueOnce({data: _users})
            const {axiosAuthenticated} = useAxios()
            await userManagerStore.getUsers()
            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith(`/users/?institutions=${userStore.userInstitutions?.join(',')}`)
            expect(userManagerStore.users).toEqual(_users)
        })
    })

    describe('getUnvalidatedUsers', () => {
        afterEach(() => {
            userStore.user = undefined
            userManagerStore.users = []
            userManagerStore.user = undefined
        })

        const {axiosAuthenticated} = useAxios()
        const mockedAxios = vi.mocked(axiosAuthenticated, true)

        it('should call API once on /users/?is_validated_by_admin=false&institutions if user is linked to institutions', async () => {
            userStore.user = _manager
            mockedAxios.get.mockResolvedValueOnce({data: _users} as AxiosResponse)
            const url = '/users/?is_validated_by_admin=false&institutions=' + userStore.userInstitutions?.join(',')
            const {axiosAuthenticated} = useAxios()
            await userManagerStore.getUnvalidatedUsers()
            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith(url)
            expect(userManagerStore.users).toEqual(_users)
        })

        it('should do nothing if user is linked to no association', async () => {
            console.log(userStore.userInstitutions)
            mockedAxios.get.mockResolvedValueOnce({data: _users} as AxiosResponse)
            const {axiosAuthenticated} = useAxios()
            await userManagerStore.getUnvalidatedUsers()
            expect(axiosAuthenticated.get).toHaveBeenCalledTimes(0)
            expect(userManagerStore.users).toEqual([])
        })
    })

    describe('getUserDetail', () => {
        afterEach(() => {
            userManagerStore.user = undefined
        })
        it('should call API once on /user/id and populate user in store', async () => {
            const {axiosAuthenticated} = useAxios()
            const mockedAxios = vi.mocked(axiosAuthenticated, true)
            mockedAxios.get.mockResolvedValueOnce({data: _student})

            await userManagerStore.getUserDetail(_student.id)

            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith(`/users/${_student.id}`)
            expect(userManagerStore.user).toEqual(_student)
        })
    })

    describe('updateUserGroups', () => {
        it('should call API once on /users/groups/ with groups as payload', async () => {
            userManagerStore.user = _student
            const {axiosAuthenticated} = useAxios()
            await userManagerStore.updateUserGroups(_newUserGroups)
            expect(axiosAuthenticated.post).toHaveBeenCalledTimes(_newUserGroups.length)
            expect(axiosAuthenticated.post).toHaveBeenLastCalledWith('/users/groups/', {
                username: userManagerStore.user?.username,
                group: _newUserGroups[_newUserGroups.length - 1]
            })
        })
    })

    describe('deleteUserGroups', () => {
        it('should call API for each group on /users/groups/userId/groupId', async () => {
            userManagerStore.user = _student
            await userManagerStore.deleteUserGroups([3, 2])
            const {axiosAuthenticated} = useAxios()
            expect(axiosAuthenticated.delete).toHaveBeenCalledTimes(2)
            expect(axiosAuthenticated.delete).toHaveBeenLastCalledWith(
                `/users/groups/${userManagerStore.user?.id}/${2}`
            )
        })
    })

    describe('validateUser', () => {
        it('should call API once on /users/id with isValidated as payload', async () => {
            userManagerStore.user = _student
            await userManagerStore.validateUser()
            const {axiosAuthenticated} = useAxios()
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith(`/users/${userManagerStore.user?.id}`, {
                isValidatedByAdmin: true
            })
        })
    })

    describe('deleteUser', () => {
        it('should call API once on /users/id', () => {
            userManagerStore.user = _student
            userManagerStore.deleteUser()
            const {axiosAuthenticated} = useAxios()
            expect(axiosAuthenticated.delete).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.delete).toHaveBeenCalledWith(`/users/${userManagerStore.user?.id}`)
        })
    })

    describe('getUserAssociations', () => {
        it('should call API once on /users/associations/id and populate userAssociations', async () => {
            const {axiosAuthenticated} = useAxios()
            const mockedAxios = vi.mocked(axiosAuthenticated, true)
            mockedAxios.get.mockResolvedValueOnce({data: _userAssociations})
            await userManagerStore.getUserAssociations(1)
            expect(mockedAxios.get).toHaveBeenCalledOnce()
            expect(mockedAxios.get).toHaveBeenCalledWith('/users/associations/1')
            expect(userManagerStore.userAssociations).toEqual(_userAssociations)
        })
    })

    describe('deleteUserAssociation', () => {
        it('should call API once on /users/associations/userId/associationId', async () => {
            userManagerStore.user = _student
            const {axiosAuthenticated} = useAxios()
            await userManagerStore.deleteUserAssociation(1)
            expect(axiosAuthenticated.delete).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.delete).toHaveBeenCalledWith(`/users/associations/${userManagerStore.user?.id}/1`)
        })
    })

    describe('patchUserAssociations', () => {
        it('should call API once on /users/associations/userId/associationId with data to patch as payload', async () => {
            userManagerStore.user = _student
            const dataToPatch = {
                isPresident: false,
                canBePresident: true,
                isSecretary: false,
                isTreasurer: true,
            }
            await userManagerStore.patchUserAssociations(1, dataToPatch)
            const {axiosAuthenticated} = useAxios()
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith(`/users/associations/${userManagerStore.user?.id}/1`, dataToPatch)
        })
    })

    describe('updateUserInfos', () => {
        it('should only patch changed infos on /users/userId', async () => {
            userManagerStore.user = _student
            const userToUpdate = {
                username: _student.username,
                firstName: 'Jane',
                lastName: _student.lastName,
                email: 'jane@lennon.uk',
                phone: _student.phone
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
            userManagerStore.user = _student
            const userToUpdate = {
                username: _student.username,
                firstName: _student.firstName,
                lastName: _student.lastName,
                email: _student.email,
                phone: _student.phone
            }
            await userManagerStore.updateUserInfos(userToUpdate)
            const {axiosAuthenticated} = useAxios()
            expect(axiosAuthenticated.patch).toHaveBeenCalledTimes(0)
        })
    })
})
