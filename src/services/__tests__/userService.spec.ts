import {describe, it, expect, beforeEach} from 'vitest'
import {tokens} from '~/mocks/tokens.mock'
import {mockedAxios} from '~/mocks/axios.mock'
import {user} from '~/mocks/user.mock'
import * as userService from '@/services/userService'
import type {AxiosResponse} from 'axios'
import {useUserStore} from '@/stores/useUserStore'
import {createPinia, setActivePinia} from 'pinia'


// TODO : set bearer
// TODO : load user
// TODO : register functions
// TODO : password reset
// TODO : password confirmation

setActivePinia(createPinia())
let userStore = useUserStore()

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
        it('should set a new access token', () => {
            mockedAxios.post.mockResolvedValueOnce({ data: tokens.access } as AxiosResponse)
            expect(localStorage.getItem('access')).toBe(tokens.access)
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
    /*describe('with access', () => {
        beforeEach(() => {
            userService.setTokens(tokens.access, tokens.refresh)
        })
        it('should populate user data', () => {
            mockedAxios.get.mockResolvedValueOnce({ data: user } as AxiosResponse)
            userService.loadUser()
            expect(userStore.user).toBe(user)
        })
    })*/
})

