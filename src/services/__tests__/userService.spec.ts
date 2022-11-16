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
const refresh_token = '0123456789'

// setActivePinia(createPinia())
// let userStore = useUserStore()

describe('User store', () => {
    beforeEach(() => {
        //
    })
    afterEach(() => {
        mockedAxios.post.mockRestore()
    })
    /*describe('User auth', () => {
        it('should be true if user has data', () => {
            expect(userStore.isAuth).toBeTruthy()
        })
        it('should be false if user has no data', () => {
            userStore.user = undefined
            expect(userStore.isAuth).toBeFalsy()
        })
    })*/
})

