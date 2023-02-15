import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { _manager, _newUser, _student } from '~/fixtures/user.mock'
import { useUserStore } from '@/stores/useUserStore'
import { _axiosFixtures } from '~/fixtures/axios.mock'
import type { User } from "#/user";
import { _tokens } from "~/fixtures/tokens.mock";
import { useAxios } from "@/composables/useAxios";

vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))

setActivePinia(createPinia())
let userStore = useUserStore()

describe('User store', () => {
    beforeEach(() => {
        userStore = useUserStore()
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })
    // PASSED
    describe('isAuth', () => {
        it('should be true if user has data', () => {
            userStore.user = _student
            expect(userStore.isAuth).toBeTruthy()
        })
        it('should be false if user has no data', () => {
            userStore.user = undefined
            expect(userStore.isAuth).toBeFalsy()
        })
    })
    // PASSED
    describe('isCas', () => {
        beforeEach(() => {
            userStore.user = _student
            userStore.user.isCas = false
            userStore.newUser = _newUser
            userStore.newUser.isCas = false
        })
        it('should be true if user isCas', () => {
            (userStore.user as User).isCas = true
            expect(userStore.isCas).toBeTruthy()
        })
        it('should be false is user !isCas', () => {
            expect(userStore.isCas).toBeFalsy()
        })
        it('should be true if newUser isCas', () => {
            (userStore.newUser as User).isCas = true;
            expect(userStore.isCas).toBeTruthy()
        })
        it('should be false is newUser !isCas', () => {
            expect(userStore.isCas).toBeFalsy()
        })
    })
    // PASSED
    describe('userNameFirstLetter', () => {
        it('should display capitalized first letter of firstname', () => {
            userStore.user = _manager
            expect(userStore.userNameFirstLetter).toBe('M')
        })
        it('should not display first letter of firstname in lower case', () => {
            userStore.user = _student
            userStore.user.firstName = 'student'
            expect(userStore.userNameFirstLetter).not.toBe('s')
        })
        it('should not be displayed if user !isAuth', () => {
            userStore.user = undefined
            expect(userStore.userNameFirstLetter).toBeUndefined()
        })
    })
    // PASSED
    describe('User logout', () => {
        it('should clear local storage', () => {
            localStorage.setItem('JWT__access__token', _tokens.access)
            localStorage.setItem('JWT__refresh__token', _tokens.refresh)
            userStore.logOut()
            expect(localStorage.getItem('JWT__access__token')).toBeNull()
            expect(localStorage.getItem('JWT__refresh__token')).toBeNull()
        })
        it('should clear user data', () => {
            userStore.logOut()
            expect(userStore.user).toBeUndefined()
        })
    })
    // PASSED
    describe('Load CAS user', () => {
        beforeEach(() => {
            const { axiosAuthenticated } = useAxios()
            const mockedAxios = vi.mocked(axiosAuthenticated, true)
            mockedAxios.post.mockResolvedValueOnce({
                data: {
                    user: _student,
                    accessToken: _tokens.access,
                    refreshToken: _tokens.refresh
                }
            })
            userStore.loadCASUser('ticket')
        })
        it('should populate newUser data', () => {
            expect(userStore.newUser).toEqual(_student)
        })
        it('should set user\'s access and refresh tokens', () => {
            expect(localStorage.getItem('JWT__access__token')).toEqual(_tokens.access)
            expect(localStorage.getItem('JWT__refresh__token')).toEqual(_tokens.refresh)
        })
        /*it('should be called once', () => {
            expect(mockedAxios.post).toHaveBeenCalledOnce()
        })*/
        /*it('should call API on /users/auth/cas/login/', () => {
            // const service = 'http://localhost:3000/cas-register'
            expect(mockedAxios.post).toHaveBeenCalledWith('/users/auth/cas/login/', {
                ticket: 'ticket',
                service: 'service'
            })
        })*/
    })
    // PASSED
    describe('Unload user', () => {
        it('should clear all data from user', () => {
            userStore.user = _student
            userStore.unLoadUser()
            expect(userStore.user).toBeUndefined()
        })
    })
    // PASSED
    describe('Unload newUser', () => {
        beforeEach(() => {
            userStore.newUser = _newUser
            localStorage.setItem('JWT__access__token', _tokens.access)
            localStorage.setItem('JWT__refresh__token', _tokens.refresh)
            userStore.unLoadNewUser()
        })
        it('should remove tokens', () => {
            expect(localStorage.getItem('JWT__access__token')).toBeNull()
            expect(localStorage.getItem('JWT__refresh__token')).toBeNull()
        })
        it('should remove all data from newUser', () => {
            expect(userStore.newUser).toBeUndefined()
        })
    })
    // PASSED
    describe('getUserAssociations', () => {
        afterEach(() => {
            userStore.user = undefined
            userStore.userAssociations = []
        })
        describe('If user has associations', () => {
            it('should call API once on /users/associations/ and populate userAssociations in store', async () => {
                userStore.user = _student
                const data = [
                    {
                        user: 'john',
                        isPresident: false,
                        canBePresident: true,
                        isTreasurer: false,
                        association: 1
                    }
                ]
                const { axiosAuthenticated } = useAxios()
                const mockedAxios = vi.mocked(axiosAuthenticated, true)
                mockedAxios.get.mockResolvedValueOnce({ data })
                await userStore.getUserAssociations()
                expect(mockedAxios.get).toHaveBeenCalledOnce()
                expect(mockedAxios.get).toHaveBeenCalledWith('/users/associations/')
                expect(userStore.userAssociations).toEqual(data)
            })
        })
        // PASSED
        describe('If user has no association', () => {
            it('should not call API and do nothing to the store', async () => {
                await userStore.getUserAssociations()
                const { axiosAuthenticated } = useAxios()
                expect(axiosAuthenticated.get).toHaveBeenCalledTimes(0)
                expect(userStore.userAssociations).toEqual([])
            })
        })
    })
    /*describe('hasOfficeStatus', () => {
        describe('If user has associations', () => {
            afterEach(() => {
                userStore.userAssociations = []
            })
            it('should find the right association by id and check is canBePresident is true', () => {
                const roles = [
                    {
                        user: 'john',
                        isPresident: false,
                        canBePresident: true,
                        isTreasurer: false,
                        association: 1
                    }
                ]
                userStore.userAssociations = roles
                expect(userStore.canBePresident(roles[0].association)).toBeTruthy()
            })
            it('should return false if canBePresident is false', () => {
                const roles = [
                    {
                        user: 'jane',
                        isPresident: false,
                        canBePresident: false,
                        isTreasurer: false,
                        association: 1
                    }
                ]
                userStore.userAssociations = roles
                expect(userStore.canBePresident(roles[0].association)).toBeFalsy()
            })
        })
        describe('If user has no associations', () => {
            it('should return false', () => {
                expect(userStore.canBePresident(undefined)).toBeFalsy()
            })
        })
    })*/
})
