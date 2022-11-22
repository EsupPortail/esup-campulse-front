import {describe, it, expect, beforeEach, afterEach} from 'vitest'
import {tokens} from '~/mocks/tokens.mock'
import {mockedAxios} from '~/mocks/axios.mock'
import {newUser, user, userAssociations, newUserGroups} from '~/mocks/user.mock'
import * as userService from '@/services/userService'
import type {AxiosResponse} from 'axios'
import {useUserStore} from '@/stores/useUserStore'
import {createPinia, setActivePinia} from 'pinia'


// TODO : set bearer


setActivePinia(createPinia())
let userStore = useUserStore()

describe('User service', () => {
    afterEach(() => {
        mockedAxios.post.mockRestore()
    })
    describe('Tokens', () => {
        beforeEach(() => {
            userService.setTokens(tokens.access, tokens.refresh)
        })
        describe('Set token', () => {
            it('should set access and refresh', () => {
                expect(localStorage.getItem('access')).toBe(tokens.access)
                expect(localStorage.getItem('refresh')).toBe(tokens.refresh)
            })
        })
        describe('Remove tokens', () => {
            it('should unset access and refresh tokens', () => {
                userService.removeTokens()
                expect(localStorage.getItem('access')).toBeNull()
                expect(localStorage.getItem('refresh')).toBeNull()
            })
        })
        describe('Refresh token', () => {
            beforeEach(() => {
                mockedAxios.post.mockResolvedValueOnce({ data: tokens.access } as AxiosResponse)
                userService.refreshToken()
            })
            it('should set a new access token', () => {
                userService.setTokens(tokens.access, tokens.refresh)
                expect(localStorage.getItem('access')).toBe(tokens.access)
            })

            it('should call API on /users/auth/token/refresh/ with refresh token as data', () => {
                expect(mockedAxios.post).toHaveBeenLastCalledWith('/users/auth/token/refresh/', { refresh: tokens.refresh })
            })
        })
    })
    describe('Load user', () => {
        beforeEach(() => {
            userStore = useUserStore()
        })
        it('should not execute if not access token', () => {
            userService.loadUser()
            expect(userStore.user).toBeUndefined()
        })
    })
    describe('Register', () => {
        beforeEach(() => {
            userStore = useUserStore()
        })
        describe('locally', () => {
            beforeEach(() => {
                userService.userLocalRegister(newUser)
            })
            it('should call API once', () => {
                expect(mockedAxios.post).toHaveBeenCalledOnce()
            })
            it('should call API on /users/auth/registration/ with newUser as data', () => {
                expect(mockedAxios.post).toHaveBeenLastCalledWith('/users/auth/registration/', newUser)
            })
        })
        /*describe('from CAS', () => {
            it('should set bearer before call', () => {
                userService.userCASRegister('new info to patch')
                expect(userService.setBearer).toHaveBeenCalledOnce()
            })
        })*/
        describe('Association register', () => {
            beforeEach(() => {
                userService.userAssociationsRegister(newUser.username, userAssociations)
            })
            it('should be called for each association', () => {
                expect(mockedAxios.post).toHaveBeenCalledTimes(userAssociations.length)
            })
            it('should call API on /users/associations/ with user, association id and hasOfficeStatus as data', () => {
                expect(mockedAxios.post).toHaveBeenLastCalledWith('/users/associations/',
                    {
                        user: user.username,
                        association: userAssociations[(userAssociations.length) - 1].id,
                        has_office_status: userAssociations[(userAssociations.length) - 1].hasOfficeStatus
                    }
                )
            })
        })
        describe('User groups register', () => {
            beforeEach(() => {
                userService.userGroupsRegister(user.username, newUserGroups)
            })
            it('should be called once', () => {
                expect(mockedAxios.post).toHaveBeenCalledOnce()
            })
            it('should call API on /users/groups/ with username and newUserGroups as data', () => {
                expect(mockedAxios.post).toHaveBeenCalledWith('/users/groups/', {user: user.username, groups: newUserGroups})
            })
        })
    })
    describe('Password reset', () => {
        beforeEach(() => {
            userService.passwordReset(user.email)
        })
        it('should be called once', () => {
            expect(mockedAxios.post).toHaveBeenCalledOnce()
        })
        it('should call API on /users/auth/password/reset with user email as data', () => {
            expect(mockedAxios.post).toHaveBeenCalledWith('/users/auth/password/reset/', {email: user.email})
        })
    })
    describe('Password reset confirm', () => {
        beforeEach(() => {
            userService.passwordResetConfirm('uid', 'token', 'newPassword', 'newPassword')
        })
        it('should be called once', () => {
            expect(mockedAxios.post).toHaveBeenCalledOnce()
        })
        it('should call API on /users/auth/password/reset/confirm/ with uid, token, and new password as data', () => {
            expect(mockedAxios.post).toHaveBeenCalledWith('/users/auth/password/reset/confirm/',
                {
                    uid: 'uid',
                    token: 'token',
                    newPassword1: 'newPassword',
                    newPassword2: 'newPassword'
                }
            )
        })
    })
})