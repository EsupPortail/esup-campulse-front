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
    last_login: null,
    is_superuser: false,
    username: 'john.lennon@bbc.com',
    first_name: 'John',
    last_name: 'Lennon',
    phone: null,
    email: 'john.lennon@bbc.com',
    is_staff: false,
    is_active: false,
    date_joined: '',
    is_cas: null,
    status: 'user'
}

// mock access_token
const access_token = '0123456789'

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
            (userStore.user as User).first_name = 'john'
            expect(userStore.userNameFirstLetter).not.toBe('j')
        })
    })
    describe('User logout', () => {
        it('should clear local storage', () => {
            localStorage.setItem('access', access_token)
            userStore.logOut()
            expect(localStorage.getItem('access')).toBeNull()
        })
        it('should clear user data', () => {
            userStore.logOut()
            expect(userStore.user).toBeUndefined()
        })
    })
    describe('User login', () => {
        it('should populate user data', () => {
            mockedAxios.post.mockResolvedValueOnce({ data: { user } } as AxiosResponse)
            userStore.logIn('url', { username: user.username, password: user.password as string })
            expect(userStore.user).toBeTruthy()
        })
        it('should call API only once', () => {
            mockedAxios.post.mockResolvedValueOnce({ data: {} } as AxiosResponse)
            userStore.logIn('url', { username: user.username, password: user.password as string })
            expect(mockedAxios.post).toHaveBeenCalledOnce()
        })
    })
})

