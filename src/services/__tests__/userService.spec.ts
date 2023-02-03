import {createPinia, setActivePinia} from 'pinia'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {_newUser, _newUserGroups, _user, _userAssociations} from '~/fixtures/user.mock'
import {_tokens} from '~/fixtures/tokens.mock'
import * as userService from '@/services/userService'
import {useUserStore} from '@/stores/useUserStore'

setActivePinia(createPinia())
let userStore = useUserStore()

describe('User service', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })
    describe('Tokens', () => {
        beforeEach(() => {
            userService.setTokens(_tokens.access, _tokens.refresh)
        })
        describe('Set token', () => {
            it('should set access and refresh', () => {
                expect(localStorage.getItem('JWT__access__token')).toBe(_tokens.access)
                expect(localStorage.getItem('JWT__refresh__token')).toBe(_tokens.refresh)
            })
        })
        describe('Remove tokens', () => {
            it('should unset access and refresh tokens', () => {
                userService.removeTokens()
                expect(localStorage.getItem('JWT__access__token')).toBeNull()
                expect(localStorage.getItem('JWT__refresh__token')).toBeNull()
            })
        })
        /*describe('Refresh token', () => {
            beforeEach(() => {
                mockedAxios.post.mockResolvedValueOnce({data: {access: _tokens.accessRefreshed}} as AxiosResponse)
                userService.refreshToken()
            })
            it('should set a new access token', () => {
                expect(localStorage.getItem('JWT__access__token')).toEqual(_tokens.accessRefreshed)
            })

            it('should call API on /users/auth/token/refresh/ with refresh token as data', () => {
                expect(mockedAxios.post).toHaveBeenCalledWith('/users/auth/token/refresh/', {refresh: _tokens.refresh})
            })
        })*/
        /*describe('Set bearer', () => {
            it('should set the access token as authorization header', () => {
                userService.setTokens(tokens.access, tokens.refresh)
                userService.setBearer()
                expect(mockedAxios.defaults.headers.common['Authorization']).toBe('Bearer ' + tokens.access)
            })
        })*/
    })
    /*describe('Load user', () => {
        beforeEach(() => {
            userStore = useUserStore()
        })
        it('should not execute if not access token', () => {
            userService.removeTokens()
            userService.loadUser()
            expect(userStore.user).toBeUndefined()
        })
    })*/
    describe('Register', () => {
        beforeEach(() => {
            userStore = useUserStore()
        })
        describe('locally', () => {
            beforeEach(() => {
                userService.userLocalRegister(_newUser)
            })
            it('should call API once', () => {
                expect(mockedAxios.post).toHaveBeenCalledOnce()
            })
            it('should call API on /users/auth/registration/ with newUser as data', () => {
                expect(mockedAxios.post).toHaveBeenLastCalledWith('/users/auth/registration/', _newUser)
            })
        })
        describe('from CAS', () => {
            beforeEach(() => {
                userService.setTokens(_tokens.access, _tokens.refresh)
                userService.userCASRegister('new info to patch')
            })
            it('should call API once', () => {
                expect(mockedAxios.patch).toHaveBeenCalledOnce()
            })
            it('should call API on /users/auth/user/ with new info to patch', () => {
                expect(mockedAxios.patch).toHaveBeenCalledWith('/users/auth/user/', {phone: 'new info to patch'})
            })
        })
        describe('Association register', () => {
            beforeEach(() => {
                userService.userAssociationsRegister(_newUser.username, _userAssociations)
            })
            it('should be called for each association', () => {
                expect(mockedAxios.post).toHaveBeenCalledTimes(_userAssociations.length)
            })
            it('should call API on /users/associations/ with user, association id and other data', () => {
                expect(mockedAxios.post).toHaveBeenLastCalledWith('/users/associations/',
                    {
                        user: _newUser.username,
                        association: _userAssociations[(_userAssociations.length) - 1].id,
                        roleName: _userAssociations[(_userAssociations.length) - 1].roleName,
                        hasOfficeStatus: _userAssociations[(_userAssociations.length) - 1].hasOfficeStatus,
                        isPresident: _userAssociations[(_userAssociations.length) - 1].isPresident
                    }
                )
            })
        })
        describe('User groups register', () => {
            beforeEach(() => {
                userService.userGroupsRegister(_user.username, _newUserGroups)
            })
            it('should be called once', () => {
                expect(mockedAxios.post).toHaveBeenCalledOnce()
            })
            it('should call API on /users/groups/ with username and newUserGroups as data', () => {
                expect(mockedAxios.post).toHaveBeenCalledWith('/users/groups/', {
                    username: _user.username,
                    groups: _newUserGroups
                })
            })
        })
    })
    describe('Verify email', () => {
        beforeEach(() => {
            userService.verifyEmail('key')
        })
        it('should be called once', () => {
            expect(mockedAxios.post).toHaveBeenCalledOnce()
        })
        it('should call API on /users/auth/registration/verify-email/ with key as data', () => {
            expect(mockedAxios.post).toHaveBeenCalledWith('/users/auth/registration/verify-email/', {key: 'key'})
        })
    })
    describe('Password reset', () => {
        beforeEach(() => {
            userService.passwordReset(_user.email)
        })
        it('should be called once', () => {
            expect(mockedAxios.post).toHaveBeenCalledOnce()
        })
        it('should call API on /users/auth/password/reset with user email as data', () => {
            expect(mockedAxios.post).toHaveBeenCalledWith('/users/auth/password/reset/', {email: _user.email})
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
