import { defineStore } from 'pinia'
import type { UserStore, LocalLogin, CasLogin } from '#/user'
import _axios from '@/plugins/axios'
import router from '@/router'
import { setTokens, removeTokens } from '@/services/userService'
import type {LocationQueryValue} from "vue-router";


export const useUserStore = defineStore('userStore', {
    state: (): UserStore => ({
        user: undefined,
        newUser: undefined
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
        },
        async loadCASUser(ticket: string) {
            const response = await _axios.post('/users/auth/cas/login/', {ticket, service: import.meta.env.VITE_APP_FRONT_URL + '/cas-register'})
            const { access_token, refresh_token, user } = response.data
            setTokens(access_token, refresh_token)
            this.newUser = user
        }
    }
})

