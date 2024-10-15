import {createPinia, setActivePinia} from 'pinia'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {
    _institutionManager,
    _institutionStudent,
    _newUser,
    _userGroups
} from '~/fixtures/user.mock'
import {_tokens, tokenMock} from '~/fixtures/tokens.mock'
import {useUserStore} from '@/stores/useUserStore'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import type {User} from '#/user'
import {useAxios} from '@/composables/useAxios'

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
            /*            it('should set user access and refresh tokens', async () => {
                expect(localStorage.getItem('JWT__access__token')).toEqual(_tokens.access)
                expect(localStorage.getItem('JWT__refresh__token')).toEqual(_tokens.refresh)
            })*/
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
})
