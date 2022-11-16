import { defineStore } from 'pinia'
import type { User, LocalLogin, CasLogin } from '#/user'
import _axios from '@/plugins/axios'
import router from '@/router'
import { setTokens, removeTokens } from '@/services/userService'

export interface UserStore {
    user: User | undefined
}

export const useUserStore = defineStore('userStore', {
    state: (): UserStore => ({
        user: undefined
    }),

    getters: {
        isAdmin: (state: UserStore): boolean => state.user?.status === 'admin',
        isAuth: (state: UserStore): boolean => !!state.user,
        userNameFirstLetter(state): string | undefined {
            return state.user?.first_name.charAt(0).toUpperCase()
        }
    },

    actions: {
        async logIn(url: string, data: LocalLogin | CasLogin) {
            const response = await _axios.post(url, data)
            const { access_token, refresh_token, user } = response.data
            setTokens(access_token, refresh_token)
            this.user = user
        },
        async logOut() {
            removeTokens()
            this.user = undefined
            await router.push({ name: 'Login' })
        }
    }
})

