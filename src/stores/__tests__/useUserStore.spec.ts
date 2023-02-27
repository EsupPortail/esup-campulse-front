import {createPinia, setActivePinia} from 'pinia'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {_manager, _newUser, _student, _userAssociations} from '~/fixtures/user.mock'
import {_tokens, tokenMock} from "~/fixtures/tokens.mock";
import {useUserStore} from '@/stores/useUserStore'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import type {User} from "#/user";
import {useAxios} from "@/composables/useAxios";
import useSecurity from "@/composables/useSecurity";
import type {AxiosResponse} from "axios";


vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))

vi.mock('@/composables/useSecurity', () => ({
    default: () => ({
        setTokens: tokenMock,
        removeTokens: tokenMock
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
            userStore.user = _student
            expect(userStore.isAuth).toBeTruthy()
        })
        it('should be false if user has no data', () => {
            userStore.user = undefined
            expect(userStore.isAuth).toBeFalsy()
        })
    })

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

    describe('userInstitutions', () => {
        it('should return an array of institution IDs based on userGroups', () => {
            userStore.user = _manager
            expect(userStore.userInstitutions).toEqual([1, 2, 3])
        })
    })

    describe('isAssociationMember', () => {
        it('should return true if user is an association member', () => {
            userStore.user = _student
            expect(userStore.isAssociationMember).toBeTruthy()
        })
        it('should return false if user is not an association member', () => {
            userStore.user = _manager
            expect(userStore.isAssociationMember).toBeFalsy()
        })
    })

    describe('logIn', () => {
        afterEach(() => {
            _student.isValidatedByAdmin = true
        })
        const {axiosAuthenticated} = useAxios()
        const mockedAxios = vi.mocked(axiosAuthenticated, true)
        const data = {
            user: _student,
            accessToken: _tokens.access,
            refreshToken: _tokens.refresh
        }
        it('should set tokens and populate user data in store', async () => {
            mockedAxios.post.mockResolvedValueOnce({data})
            const {setTokens} = useSecurity()
            await userStore.logIn('url', {username: 'john', password: 'password'})
            expect(setTokens).toHaveBeenCalledOnce()
            expect(setTokens).toHaveBeenCalledWith(_tokens.access, _tokens.refresh)
            expect(userStore.user).toEqual(_student)
        })
        it('should throw an error if user is not validated by admin', async () => {
            data.user.isValidatedByAdmin = false
            mockedAxios.post.mockResolvedValueOnce({data})
            const {setTokens} = useSecurity()
            await expect(userStore.logIn('url', {username: 'john', password: 'password'})).rejects.toThrow(Error)
            expect(setTokens).toHaveBeenCalledTimes(0)
            expect(userStore.user).toBeUndefined()
        })
    })

    describe('logOut', () => {
        it('should remove tokens and call unLoadUser', () => {
            const {removeTokens} = useSecurity()
            const unLoadUser = vi.spyOn(userStore, 'unLoadUser')
            localStorage.setItem('JWT__access__token', _tokens.access)
            localStorage.setItem('JWT__refresh__token', _tokens.refresh)
            userStore.logOut()
            expect(removeTokens).toHaveBeenCalledOnce()
            expect(unLoadUser).toHaveBeenCalledOnce()
        })
    })

    describe('Load CAS user', () => {
        beforeEach(() => {
            const {axiosAuthenticated} = useAxios()
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

    describe('getUser', () => {
        afterEach(() => {
            userStore.user = undefined
            userStore.newUser = undefined
            _student.isValidatedByAdmin = true
            _student.isCas = false
        })

        const {axiosAuthenticated} = useAxios()
        const mockedAxios = vi.mocked(axiosAuthenticated, true)

        it('should getUser if user is validated by admin', async () => {
            mockedAxios.get.mockResolvedValueOnce({data: _student} as AxiosResponse)
            await userStore.getUser()
            expect(userStore.user).toEqual(_student)
            expect(userStore.newUser).toBeUndefined()
        })

        it('should populate newUser if user is not validated by admin and CAS', async () => {
            _student.isValidatedByAdmin = false
            _student.isCas = true
            mockedAxios.get.mockResolvedValueOnce({data: _student} as AxiosResponse)
            await userStore.getUser()
            expect(userStore.user).toBeUndefined()
            expect(userStore.newUser).toEqual({
                firstName: _student.firstName,
                lastName: _student.lastName,
                isCas: true,
                username: _student.username,
                email: _student.email,
                phone: _student.phone as string
            })
        })

        it('should logOut if user if not validated by admin and not CAS', async () => {
            _student.isValidatedByAdmin = false
            mockedAxios.get.mockResolvedValueOnce({data: _student} as AxiosResponse)
            const logOut = vi.spyOn(userStore, 'logOut')
            await userStore.getUser()
            expect(logOut).toHaveBeenCalledOnce()
            expect(userStore.user).toBeUndefined()
            expect(userStore.newUser).toBeUndefined()
        })
    })

    describe('unLoadUser', () => {
        it('should clear all data from user', () => {
            userStore.user = _student
            userStore.userAssociations = _userAssociations
            userStore.unLoadUser()
            expect(userStore.user).toBeUndefined()
            expect(userStore.userAssociations).toEqual([])
        })
    })

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
                const {axiosAuthenticated} = useAxios()
                const mockedAxios = vi.mocked(axiosAuthenticated, true)
                mockedAxios.get.mockResolvedValueOnce({data})
                await userStore.getUserAssociations()
                expect(mockedAxios.get).toHaveBeenCalledOnce()
                expect(mockedAxios.get).toHaveBeenCalledWith('/users/associations/')
                expect(userStore.userAssociations).toEqual(data)
            })
        })

        describe('If user has no association', () => {
            it('should not call API and do nothing to the store', async () => {
                await userStore.getUserAssociations()
                const {axiosAuthenticated} = useAxios()
                expect(axiosAuthenticated.get).toHaveBeenCalledTimes(0)
                expect(userStore.userAssociations).toEqual([])
            })
        })
    })

    describe('hasPresidentStatus', () => {
        beforeEach(() => {
            userStore.userAssociations = _userAssociations
        })
        afterEach(() => {
            userStore.userAssociations = []
        })
        it('should return true if isPresident or canBePresident is true', () => {
            expect(userStore.hasPresidentStatus(1)).toBeTruthy()
            expect(userStore.hasPresidentStatus(2)).toBeTruthy()
        })
        it('should return false if is President or canBePresident is false', () => {
            expect(userStore.hasPresidentStatus(3)).toBeFalsy()
        })
    })
})
