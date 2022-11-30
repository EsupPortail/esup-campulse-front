import type {Mock} from 'vitest'
import {afterEach, beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import type {AxiosResponse} from 'axios'
import {mockedAxios} from '~/mocks/axios.mock'
import {useUserStore} from '@/stores/useUserStore'
import {tokens} from '~/mocks/tokens.mock'
import {groupList, groups, nonValidatedUser, user} from '~/mocks/user.mock'


setActivePinia(createPinia())
let userStore = useUserStore()

describe('User store', () => {
    beforeEach(() => {
        userStore = useUserStore()
        // userStore.user = user
    })
    afterEach(() => {
        mockedAxios.post.mockRestore()
        // vi.restoreAllMocks
    })
    describe('isAuth', () => {
        it('should be true if user has data', () => {
            userStore.user = user
            expect(userStore.isAuth).toBeTruthy()
        })
        it('should be false if user has no data', () => {
            userStore.user = undefined
            expect(userStore.isAuth).toBeFalsy()
        })
    })
    describe('isCas', () => {
        it('should be true if user isCas', () => {
            userStore.user = user
            userStore.user.isCas = true
            expect(userStore.isCas).toBeTruthy()
        })
        it('should be false is user !isCas', () => {
            userStore.user = user
            userStore.user.isCas = false
            expect(userStore.isCas).toBeFalsy()
        })
        it('should be true if newUser isCas', () => {
            userStore.newUser = user
            userStore.newUser.isCas = true
            expect(userStore.isCas).toBeTruthy()
        })
        it('should be false is newUser !isCas', () => {
            userStore.newUser = user
            userStore.newUser.isCas = false
            expect(userStore.isCas).toBeFalsy()
        })
    })
    describe('User avatar', () => {
        it('should display capitalized first letter of firstname', () => {
            userStore.user = user
            expect(userStore.userNameFirstLetter).toBe('J')
        })
        it('should not display first letter of firstname in lower case', () => {
            userStore.user = user
            userStore.user.firstName = 'john'
            expect(userStore.userNameFirstLetter).not.toBe('j')
        })
        it('should not be displayed if user !isAuth', () => {
            userStore.user = undefined
            expect(userStore.userNameFirstLetter).toBeUndefined()
        })
    })
    describe('User logout', () => {
        it('should clear local storage', () => {
            localStorage.setItem('access', tokens.access)
            localStorage.setItem('refresh', tokens.refresh)
            userStore.logOut()
            expect(localStorage.getItem('access')).toBeNull()
            expect(localStorage.getItem('refresh')).toBeNull()
        })
        it('should clear user data', () => {
            userStore.logOut()
            expect(userStore.user).toBeUndefined()
        })
    })
    describe('User login', () => {
        describe('If user is validated by admin', () => {
            beforeEach(() => {
                (mockedAxios.post as Mock).mockResolvedValueOnce({
                    data: {
                        user,
                        accessToken: tokens.access,
                        refreshToken: tokens.refresh
                    }
                } as AxiosResponse)
                userStore.logIn('url', {username: user.username, password: user.password as string})
            })
            afterEach(() => {
                (mockedAxios.post as Mock).mockRestore()
            })
            it('should call API once', () => {
                expect(mockedAxios.post).toHaveBeenCalledOnce()
            })
            it('should populate user data', () => {
                expect(userStore.user).toEqual(user)
            })
            it('should set user\'s access and refresh tokens', () => {
                expect(localStorage.getItem('access')).toBe(tokens.access)
                expect(localStorage.getItem('refresh')).toBe(tokens.refresh)
            })
        })
        /*describe('If user is not validated by admin', () => {
            beforeEach(() => {
                (mockedAxios.post as Mock).mockResolvedValueOnce({ data: { user: nonValidatedUser, accessToken: tokens.access, refreshToken: tokens.refresh } } as AxiosResponse)
                userStore.logIn('url', { username: nonValidatedUser.username, password: nonValidatedUser.password as string })
            })
            it('should not populate user data', () => {
                expect(userStore.user).toBeUndefined()
            })
        })*/
    })
    describe('Load CAS user', () => {
        beforeEach(() => {
            (mockedAxios.post as Mock).mockResolvedValueOnce({
                data: {
                    user,
                    accessToken: tokens.access,
                    refreshToken: tokens.refresh
                }
            } as AxiosResponse)
            userStore.loadCASUser('ticket')
        })
        it('should populate newUser data', () => {
            expect(userStore.newUser).toEqual(user)
        })
        it('should set user\'s access and refresh tokens', () => {
            expect(localStorage.getItem('access')).toBe(tokens.access)
            expect(localStorage.getItem('refresh')).toBe(tokens.refresh)
        })
        it('should be called once', () => {
            expect(mockedAxios.post).toHaveBeenCalledOnce()
        })
        it('should call API on /users/auth/cas/login/', () => {
            const service = 'http://localhost:3000/cas-register'
            expect(mockedAxios.post).toHaveBeenCalledWith('/users/auth/cas/login/', {ticket: 'ticket', service})
        })
    })
    describe('Get user', () => {
        describe('If user is validated by admin', () => {
            beforeEach(() => {
                (mockedAxios.get as Mock).mockResolvedValueOnce({data: user} as AxiosResponse)
                userStore.getUser()
            })
            afterEach(() => {
                (mockedAxios.get as Mock).mockRestore()
                userStore.user = undefined
            })
            it('should populate user data if user is validated by admin', () => {
                expect(userStore.user).toEqual(user)
            })
            it('should be called once', () => {
                expect(mockedAxios.get).toHaveBeenCalledOnce()
            })
            it('should call API on /users/auth/user/', () => {
                expect(mockedAxios.get).toHaveBeenCalledWith('/users/auth/user/')
            })
        })
        describe('If user is not validated by admin', () => {
            beforeEach(() => {
                (mockedAxios.get as Mock).mockResolvedValueOnce({data: nonValidatedUser} as AxiosResponse)
                userStore.getUser()
            })
            it('should not populate user data if user is not validated by admin', () => {
                expect(userStore.user).toBeUndefined()
            })
        })
    })
    describe('Unload user', () => {
        it('should clear all data from user', () => {
            userStore.user = user
            userStore.unLoadUser()
            expect(userStore.user).toBeUndefined()
        })
    })
    describe('Get groups', () => {
        beforeEach(() => {
            (mockedAxios.get as Mock).mockResolvedValueOnce({data: groups} as AxiosResponse)
            userStore.getGroups()
        })
        afterEach(() => {
            (mockedAxios.get as Mock).mockRestore()
        })
        it('should get user groups', () => {
            expect(userStore.groups).toEqual(groups)
        })
        it('should be called once', () => {
            expect(mockedAxios.get).toHaveBeenCalledOnce()
        })
        it('should call API on /groups/', () => {
            expect(mockedAxios.get).toHaveBeenCalledWith('/groups/')
        })
    })
    describe('Group list', () => {
        it('should create an array of value and label for each group', () => {
            userStore.groups = groups
            expect(userStore.groupList).toEqual(groupList)
        })
    })
    describe('Student group', () => {
        it('should return the student group object', () => {
            userStore.groups = groups
            expect(userStore.studentGroup).toEqual(groups[1])
        })
    })
})
