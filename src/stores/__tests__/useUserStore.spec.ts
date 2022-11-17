import { beforeEach, describe, it, expect, vi, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { AxiosResponse } from "axios";
import type { User } from '#/user'
import _axios from '@/plugins/axios'
import { useUserStore } from '@/stores/useUserStore'

// mock Axios
vi.mock('@/plugins/axios', () => {
    return {
        default: { post: vi.fn() }
    }
})
const mockedAxios = vi.mocked(_axios, true)

// mock User
const user: User = {
    id: 1,
    password: 'motdepasse',
    lastLogin: null,
    isSuperuser: false,
    username: 'john.lennon@bbc.com',
    firstName: 'John',
    lastName: 'Lennon',
    phone: null,
    email: 'john.lennon@bbc.com',
    isStaff: false,
    isActive: false,
    dateJoined: '',
    isCas: null,
    status: 'user'
}

// mock access_token
const accessToken = '0123456789'
const refreshToken = '0123456789'

setActivePinia(createPinia())
let userStore = useUserStore()

describe('User store', () => {
    beforeEach(() => {
        userStore = useUserStore()
        userStore.user = user
    })
    afterEach(() => {
        mockedAxios.post.mockRestore()
    })
    describe('User auth', () => {
        it('should be true if user has data', () => {
            expect(userStore.isAuth).toBeTruthy()
        })
        it('should be false if user has no data', () => {
            userStore.user = undefined
            expect(userStore.isAuth).toBeFalsy()
        })
    })
    describe('User avatar', () => {
        it('should display capitalized first letter of firstname', () => {
            expect(userStore.userNameFirstLetter).toBe('J')
        })
        it('should not display first letter of firstname in lower case', () => {
            (userStore.user as User).firstName = 'john'
            expect(userStore.userNameFirstLetter).not.toBe('j')
        })
    })
    describe('User logout', () => {
        it('should clear local storage', () => {
            localStorage.setItem('access', accessToken)
            userStore.logOut()
            expect(localStorage.getItem('access')).toBeNull()
        })
        it('should clear user data', () => {
            userStore.logOut()
            expect(userStore.user).toBeUndefined()
        })
    })
    describe('User login', () => {
        beforeEach(() => {
            mockedAxios.post.mockResolvedValueOnce({ data: { user, accessToken, refreshToken } } as AxiosResponse)
            userStore.logIn({ username: user.username, password: user.password as string })
        })
        it('should call API only once', () => {
            expect(mockedAxios.post).toHaveBeenCalledOnce()
        })
        it('should populate user data', () => {
            expect(userStore.user).toBeTruthy()
        })
        it('should set user\'s access and refresh tokens', () => {
            expect(localStorage.getItem('access')).toBe(accessToken)
            expect(localStorage.getItem('refresh')).toBe(refreshToken)
        })

    })
    describe('Load CAS user', () => {
        beforeEach(() => {
            mockedAxios.post.mockResolvedValueOnce({ data: { user, accessToken, refreshToken } } as AxiosResponse)
            userStore.loadCASUser('ticket')
        })
        it('should populate newUser data', () => {
            expect(userStore.newUser).toBeTruthy()
        })
        it('should set user\'s access and refresh tokens', () => {
            expect(localStorage.getItem('access')).toBe(accessToken)
            expect(localStorage.getItem('refresh')).toBe(refreshToken)
        })
    })
})

