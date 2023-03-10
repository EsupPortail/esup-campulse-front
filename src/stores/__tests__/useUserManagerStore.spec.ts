import {createPinia, setActivePinia} from 'pinia'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {_institutionManager, _institutionStudent, _newUserGroups, _users, _usersNames} from '~/fixtures/user.mock'
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
            userManagerStore.user = _institutionManager
            expect(userManagerStore.userGroups).toEqual([2, 3])
        })
    })

    describe('getUsers', () => {
        const {axiosAuthenticated} = useAxios()
        const mockedAxios = vi.mocked(axiosAuthenticated, true)

        it('should call API once on /users/?institutions if user is linked to institutions', async () => {
            userStore.user = _institutionManager
            mockedAxios.get.mockResolvedValueOnce({data: _users})
            const {axiosAuthenticated} = useAxios()
            await userManagerStore.getUsers()
            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith(`/users/?institutions=${userStore.userInstitutions?.join(',')},`)
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
            userStore.user = _institutionManager
            mockedAxios.get.mockResolvedValueOnce({data: _users} as AxiosResponse)
            const url = '/users/?is_validated_by_admin=false&institutions=' + userStore.userInstitutions?.join(',') + ','
            const {axiosAuthenticated} = useAxios()
            await userManagerStore.getUnvalidatedUsers()
            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith(url)
            expect(userManagerStore.users).toEqual(_users)
        })

        it('should do nothing if user is linked to no association', async () => {
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
            mockedAxios.get.mockResolvedValueOnce({data: _institutionStudent})

            await userManagerStore.getUserDetail(_institutionStudent.id)

            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith(`/users/${_institutionStudent.id}`)
            expect(userManagerStore.user).toEqual(_institutionStudent)
        })
    })

    describe('updateUserGroups', () => {
        it('should call API once on /users/groups/ with groups as payload', async () => {
            userManagerStore.user = _institutionStudent
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
            userManagerStore.user = _institutionStudent
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
            userManagerStore.user = _institutionStudent
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
            userManagerStore.user = _institutionStudent
            userManagerStore.deleteUser()
            const {axiosAuthenticated} = useAxios()
            expect(axiosAuthenticated.delete).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.delete).toHaveBeenCalledWith(`/users/${userManagerStore.user?.id}`)
        })
    })
})
