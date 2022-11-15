import { defineStore } from 'pinia'
import _axios from '@/plugins/axios'
import type { User, LocalLogin, CasLogin, UserRegister, UserAssociations } from '#/user'
import router from '@/router'


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
            localStorage.setItem('access', access_token)
            localStorage.setItem('refresh', refresh_token)
            this.user = user
        },
        async userLocalRegister(newUser: UserRegister) {
            await _axios.post('/users/auth/registration/', newUser)
        },
        async userCASRegister(newUserInfo: string | null) {
            const access = localStorage.getItem('access')
            _axios.defaults.headers.common['Authorization'] = 'Bearer ' + access
            await _axios.patch('/users/auth/user/', { phone: newUserInfo })
        },
        async userAssociationsRegister(username: string, newUserAssociations: UserAssociations) {
            for (let i = 0; i < newUserAssociations.length; i++) {
                await _axios.post('/users/association/', {
                    user: username,
                    association: newUserAssociations[i].id,
                    has_office_status: newUserAssociations[i].has_office_status
                })
            }
        },
        async logOut() {
            localStorage.removeItem('access')
            localStorage.removeItem('refresh')
            this.user = undefined
            await router.push({ name: 'Login' })
        }
    }
})

