import type {Mock} from 'vitest'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import type {AxiosResponse} from 'axios'
import {mockedAxios} from '~/mocks/axios.mock'
import {useUserStore} from '@/stores/useUserStore'
import {tokens} from '~/mocks/tokens.mock'
import {groupList, groups, user} from '~/mocks/user.mock'
import type {User} from '#/user'
import {setTokens} from '@/services/userService'


setActivePinia(createPinia())
let userStore = useUserStore()

describe('User store', () => {
    beforeEach(() => {
        userStore = useUserStore()
    })
    afterEach(() => {
        vi.restoreAllMocks()
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
        beforeEach(() => {
            userStore.user = user
            userStore.user.isCas = false
            userStore.newUser = user
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
            (userStore.newUser as User).isCas = true
            expect(userStore.isCas).toBeTruthy()
        })
        it('should be false is newUser !isCas', () => {
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
                mockedAxios.post.mockResolvedValueOnce({
                    data: {
                        user,
                        accessToken: tokens.access,
                        refreshToken: tokens.refresh
                    }
                } as AxiosResponse)
                userStore.logIn('url', {username: user.username, password: user.password as string})
            })
            afterEach(() => {
                userStore.user = undefined
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
            it('should auth user', () => {
                expect(userStore.isAuth).toBeTruthy()
            })
        })
        /*describe('If user is not validated by admin', () => {
            beforeEach(() => {
                user.isValidatedByAdmin = false
                mockedAxios.post.mockResolvedValueOnce({
                    data: {
                        user: user,
                        accessToken: tokens.access,
                        refreshToken: tokens.refresh
                    }
                } as AxiosResponse)
                userStore.logIn('url', {
                    username: user.username,
                    password: user.password as string
                })
            })
            afterEach(() => {
                user.isValidatedByAdmin = true
                userStore.user = undefined
            })
            it('should not populate user data', () => {
                expect(userStore.user).toBeUndefined()
            })
            it('should not auth user', () => {
                expect(userStore.isAuth).toBeFalsy()
            })
            it('should throw an error', () => {
                expect(() => {
                    userStore.logIn('url', {username: user.username, password: user.password as string})
                }).toThrow(new Error)
            })
        })*/
    })
    describe('Load CAS user', () => {
        beforeEach(() => {
            mockedAxios.post.mockResolvedValueOnce({
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
                mockedAxios.get.mockResolvedValueOnce({data: user} as AxiosResponse)
                userStore.getUser()
            })
            afterEach(() => {
                userStore.user = undefined
            })
            it('should be called once', () => {
                expect(mockedAxios.get).toHaveBeenCalledOnce()
            })
            it('should call API on /users/auth/user/', () => {
                expect(mockedAxios.get).toHaveBeenCalledWith('/users/auth/user/')
            })
            // user mock validated by default
            it('should populate user data', () => {
                expect(userStore.user).toEqual(user)
            })
        })
        describe('If user is not validated by admin', () => {
            beforeEach(() => {
                user.isValidatedByAdmin = false
            })
            afterEach(() => {
                userStore.user = undefined
                userStore.newUser = undefined
            })
            describe('If user isCas', () => {
                beforeEach(() => {
                    user.isCas = true
                    mockedAxios.get.mockResolvedValueOnce({data: user} as AxiosResponse)
                    userStore.getUser()
                })
                afterEach(() => {
                    user.isCas = false
                })
                it('should populate newUser data', () => {
                    expect(userStore.newUser).toEqual(user)
                })
                it('should not populate user data', () => {
                    expect(userStore.user).toBeUndefined()
                })
            })
            describe('If user !isCas', () => {
                beforeEach(() => {
                    setTokens(tokens.access, tokens.refresh)
                    mockedAxios.get.mockResolvedValueOnce({data: user} as AxiosResponse)
                    userStore.getUser()
                })
                it('should remove tokens', () => {
                    expect(localStorage.getItem('access')).toBeNull()
                    expect(localStorage.getItem('refresh')).toBeNull()
                })
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
    describe('Unload newUser', () => {
        beforeEach(() => {
            userStore.newUser = user
            setTokens(tokens.access, tokens.refresh)
            userStore.unLoadNewUser()
        })
        it('should remove tokens', () => {
            expect(localStorage.getItem('access')).toBeNull()
            expect(localStorage.getItem('refresh')).toBeNull()
        })
        it('should remove all data from newUser', () => {
            expect(userStore.newUser).toBeUndefined()
        })
    })
    describe('Get groups', () => {
        beforeEach(() => {
            mockedAxios.get.mockResolvedValueOnce({data: groups} as AxiosResponse)
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
