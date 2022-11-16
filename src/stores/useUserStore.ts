import { defineStore } from 'pinia'
import type {UserStore, LocalLogin, CasLogin, GroupList} from '#/user'
import _axios from '@/plugins/axios'
import router from '@/router'
import {setTokens, removeTokens, setBearer} from '@/services/userService'
import type {UserGroup} from "#/user";


export const useUserStore = defineStore('userStore', {
    state: (): UserStore => ({
        user: undefined,
        newUser: undefined,
        isCAS: false,
        groups: []
    }),

    getters: {
        isAdmin: (state: UserStore): boolean => state.user?.status === 'admin',
        isAuth: (state: UserStore): boolean => !!state.user,
        userNameFirstLetter: (state: UserStore): string | undefined => {
            return state.user?.first_name.charAt(0).toUpperCase()
        },
        groupList: (state: UserStore): GroupList => {
            return state.groups
                .map(group => ({
                    value: group.id,
                    label: group.name
                }))
        }
    },
    actions: {
        async logIn(data: LocalLogin | CasLogin) {
            const response = await _axios.post('/users/auth/login/', data)
            const { access_token, refresh_token, user } = response.data
            setTokens(access_token, refresh_token)
            this.user = user
            // TODO : push to previous page
            await router.push({ name: 'Home' })
        },
        async logOut() {
            removeTokens()
            this.user = undefined
            await router.push({ name: 'Login' })
        },
        async loadUser() {
            setBearer()
            const response = await _axios.get('/users/auth/user/')
            this.user = response.data
        },
        async loadCASUser(ticket: string) {
            const response = await _axios.post('/users/auth/cas/login/', {ticket, service: import.meta.env.VITE_APP_FRONT_URL + '/cas-register'})
            const { access_token, refresh_token, user } = response.data
            setTokens(access_token, refresh_token)
            this.newUser = user
            this.isCAS = true
        },
        async getGroups() {
            this.groups = (await _axios.get<UserGroup[]>('/users/groups/')).data
        }
    }
})

