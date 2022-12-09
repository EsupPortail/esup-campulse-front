import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {mockedAxios} from '~/mocks/axios.mock'
import {user, users} from '~/mocks/user.mock'
import {useUserManagerStore} from '@/stores/useUserManagerStore'


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
        describe('If users are not populated yet', () => {
            beforeEach(() => {
                mockedAxios.get.mockResolvedValueOnce({data: users})
                userManagerStore.getUsers()
            })
            it('should call API once on /users/', () => {
                expect(mockedAxios.get).toHaveBeenCalledOnce()
                expect(mockedAxios.get).toHaveBeenCalledWith('/users/')
            })
            it('should populate users state', () => {
                expect(userManagerStore.users).toEqual(users)
            })
        })
        describe('If users are already populated', () => {
            beforeEach(() => {
                mockedAxios.get.mockResolvedValueOnce({data: users})
                userManagerStore.users = users
                userManagerStore.getUsers()
            })
            it('should not call API', () => {
                expect(mockedAxios.get).toHaveBeenCalledTimes(0)
            })
            it('should keep users in state', () => {
                expect(userManagerStore.users).toEqual(users)
            })
        })
    })
    describe('getUserDetail', () => {
        describe('If user not already in store', () => {
            beforeEach(() => {
                mockedAxios.get.mockResolvedValueOnce({data: user})
                userManagerStore.getUserDetail(user.id)
            })
            it('should call API once on /users/id', () => {
                expect(mockedAxios.get).toHaveBeenCalledOnce()
                expect(mockedAxios.get).toHaveBeenCalledWith(`/users/${user.id}`)
            })
            it('should populate user state', () => {
                expect(userManagerStore.user).toEqual(user)
            })
        })
        describe('If user already in store', () => {
            beforeEach(() => {
                mockedAxios.get.mockResolvedValueOnce({data: user})
                userManagerStore.user = user
                userManagerStore.getUserDetail(user.id)
            })
            it('should not call API', () => {
                expect(mockedAxios.get).toHaveBeenCalledTimes(0)
            })
            it('should not modify users state', () => {
                expect(userManagerStore.user).toEqual(user)
            })
        })
    })
})
