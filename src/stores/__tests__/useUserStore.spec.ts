import {createPinia, setActivePinia} from 'pinia'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {
    _institutionManager,
    _institutionStudent,
    _newUser,
    _userAssociationDetail,
    _userGroups
} from '~/fixtures/user.mock'
import {_tokens, tokenMock} from '~/fixtures/tokens.mock'
import {useUserStore} from '@/stores/useUserStore'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import type {User} from '#/user'
import {useAxios} from '@/composables/useAxios'
import useSecurity from '@/composables/useSecurity'
import type {AxiosResponse} from 'axios'


vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))

vi.mock('@/composables/useSecurity', () => ({
    default: () => ({
        setTokens: tokenMock,
        removeTokens: tokenMock,
        newUser: {
            isCas: false,
            firstName: '',
            lastName: '',
            email: '',
            username: '',
            phone: ''
        }
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
        userStore.user = undefined
        userStore.newUser = undefined
    })

    const {setTokens, removeTokens} = useSecurity()

    describe('isAuth', () => {
        it('should be true if user has data', () => {
            userStore.user = _institutionStudent
            expect(userStore.isAuth).toBeTruthy()
        })
        it('should be false if user has no data', () => {
            userStore.user = undefined
            expect(userStore.isAuth).toBeFalsy()
        })
    })

    describe('isCas', () => {
        beforeEach(() => {
            userStore.user = _institutionStudent
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
            (userStore.newUser as User).isCas = true
            expect(userStore.isCas).toBeTruthy()
        })
        it('should be false is newUser !isCas', () => {
            expect(userStore.isCas).toBeFalsy()
        })
    })

    describe('userInstitutions', () => {
        it('should return an array of institution IDs based on userGroups', () => {
            userStore.user = _institutionManager
            expect(userStore.userInstitutions).toEqual([2, 3])
        })
    })

    describe('isAssociationMember', () => {
        it('should return true if user is an association member', () => {
            userStore.user = _institutionStudent
            expect(userStore.isAssociationMember).toBeTruthy()
        })
        it('should return false if user is not an association member', () => {
            userStore.user = _institutionManager
            expect(userStore.isAssociationMember).toBeFalsy()
        })
    })

    describe('logIn', () => {
        afterEach(() => {
            _institutionStudent.isValidatedByAdmin = true
            data.user.groups = [_userGroups[3]]
        })
        const {axiosPublic} = useAxios()
        const mockedAxios = vi.mocked(axiosPublic, true)
        const data = {
            user: _institutionStudent,
            access: _tokens.access,
            refresh: _tokens.refresh
        }
        describe('if user account is complete', () => {
            describe('if user account is validated by admin', () => {
                it('should set tokens and populate user data in store', async () => {
                    mockedAxios.post.mockResolvedValueOnce({data})
                    await userStore.logIn('url', {username: 'john', password: 'password'})
                    expect(setTokens).toHaveBeenCalledOnce()
                    expect(setTokens).toHaveBeenCalledWith(_tokens.access, _tokens.refresh)
                    expect(userStore.user).toEqual(_institutionStudent)
                })
            })
            describe('if user account is not validated by admin', () => {
                it('should throw an error', async () => {
                    data.user.isValidatedByAdmin = false
                    mockedAxios.post.mockResolvedValueOnce({data})
                    await expect(() => userStore.logIn('url', {
                        username: 'john',
                        password: 'password'
                    })).rejects.toThrowError(/^USER_NOT_VALIDATED_BY_ADMIN$/)
                })
            })
        })
        describe('if user account is not complete', () => {
            it('should set tokens, populate user data in newUser and throw an error', async () => {
                data.user.groups = []
                mockedAxios.post.mockResolvedValueOnce({data})
                await expect(() => userStore.logIn('url', {
                    username: 'john',
                    password: 'password'
                })).rejects.toThrowError(/^USER_ACCOUNT_NOT_COMPLETE$/)
                expect(setTokens).toHaveBeenCalledOnce()
                expect(setTokens).toHaveBeenCalledWith(_tokens.access, _tokens.refresh)
            })
        })
    })

    describe('logOut', () => {
        it('should remove tokens and call unLoadUser', () => {
            const unLoadUser = vi.spyOn(userStore, 'unLoadUser')
            localStorage.setItem('JWT__access__token', _tokens.access)
            localStorage.setItem('JWT__refresh__token', _tokens.refresh)
            userStore.logOut()
            expect(removeTokens).toHaveBeenCalledOnce()
            expect(unLoadUser).toHaveBeenCalledOnce()
        })
    })

    describe('Load CAS user', () => {
        afterEach(() => {
            data.user.groups = [_userGroups[3]]
        })
        const {axiosAuthenticated} = useAxios()
        const mockedAxios = vi.mocked(axiosAuthenticated, true)
        const data = {
            user: _institutionStudent,
            accessToken: _tokens.access,
            refreshToken: _tokens.refresh
        }
        describe('if the user account exists', () => {
            it('should throw an error', async () => {
                mockedAxios.post.mockResolvedValueOnce({data})
                await expect(() => userStore.loadCASUser('ticket'))
                    .rejects.toThrowError(/^USER_ACCOUNT_ALREADY_EXISTS$/)
            })
        })
        describe('if the user account does not exist', () => {
            beforeEach(async () => {
                mockedAxios.post.mockResolvedValueOnce({data})
                data.user.groups = []
                await userStore.loadCASUser('ticket')
            })
            it('should set user access and refresh tokens', async () => {
                expect(localStorage.getItem('JWT__access__token')).toEqual(_tokens.access)
                expect(localStorage.getItem('JWT__refresh__token')).toEqual(_tokens.refresh)
            })
            it('should populate newUser data', async () => {
                mockedAxios.post.mockResolvedValueOnce({data})
                expect(userStore.newUser).toEqual(_institutionStudent)
            })
            it('should be called once', async () => {
                mockedAxios.post.mockResolvedValueOnce({data})
                expect(mockedAxios.post).toHaveBeenCalledOnce()
            })
            it('should call API on /users/auth/cas/login/', async () => {
                mockedAxios.post.mockResolvedValueOnce({data})
                const service = 'http://localhost:3000/cas-register'
                expect(mockedAxios.post).toHaveBeenCalledWith('/users/auth/cas/login/', {
                    ticket: 'ticket',
                    service
                })
            })
        })
    })

    describe('getUser', () => {
        afterEach(() => {
            userStore.user = undefined
            userStore.newUser = undefined
            _institutionStudent.isValidatedByAdmin = true
            _institutionStudent.isCas = false
        })

        const {axiosAuthenticated} = useAxios()
        const mockedAxios = vi.mocked(axiosAuthenticated, true)

        it('should getUser if user is validated by admin', async () => {
            mockedAxios.get.mockResolvedValueOnce({data: _institutionStudent} as AxiosResponse)
            await userStore.getUser()
            expect(userStore.user).toEqual(_institutionStudent)
            expect(userStore.newUser).toBeUndefined()
        })

        it('should populate newUser if user is not validated by admin and CAS', async () => {
            _institutionStudent.isValidatedByAdmin = false
            _institutionStudent.isCas = true
            mockedAxios.get.mockResolvedValueOnce({data: _institutionStudent} as AxiosResponse)
            await userStore.getUser()
            expect(userStore.user).toBeUndefined()
            expect(userStore.newUser).toEqual({
                firstName: _institutionStudent.firstName,
                lastName: _institutionStudent.lastName,
                isCas: true,
                username: _institutionStudent.username,
                email: _institutionStudent.email,
                phone: _institutionStudent.phone as string
            })
        })

        it('should logOut if user if not validated by admin and not CAS', async () => {
            _institutionStudent.isValidatedByAdmin = false
            mockedAxios.get.mockResolvedValueOnce({data: _institutionStudent} as AxiosResponse)
            const logOut = vi.spyOn(userStore, 'logOut')
            await userStore.getUser()
            expect(logOut).toHaveBeenCalledOnce()
            expect(userStore.user).toBeUndefined()
            expect(userStore.newUser).toBeUndefined()
        })
    })

    /*describe('unLoadUser', () => {
        it('should clear all data from user', () => {
            userStore.user = _institutionStudent
            userStore.userAssociations = _userAssociations
            userStore.unLoadUser()
            expect(userStore.user).toBeUndefined()
            expect(userStore.userAssociations).toEqual([])
        })
    })*/

    describe('unLoadNewUser', () => {
        it('should remove tokens and remove all data from newUser', () => {
            userStore.newUser = _newUser
            localStorage.setItem('JWT__access__token', _tokens.access)
            localStorage.setItem('JWT__refresh__token', _tokens.refresh)
            userStore.unLoadNewUser()
            const {removeTokens} = useSecurity()
            expect(removeTokens).toHaveBeenCalledOnce()
            expect(userStore.newUser).toBeUndefined()
        })
    })

    describe('hasPresidentStatus', () => {
        afterEach(() => {
            userStore.userAssociations = []
        })
        it('should return true if isPresident', () => {
            userStore.userAssociations = [_userAssociationDetail]
            expect(userStore.hasPresidentStatus(1)).toBeTruthy()
        })
        it('should return false if is President', () => {
            userStore.userAssociations = [_userAssociationDetail]
            userStore.userAssociations[0].isPresident = false
            expect(userStore.hasPresidentStatus(1)).toBeFalsy()
        })
    })
})
