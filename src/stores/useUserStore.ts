import { defineStore } from 'pinia'
import _axios from '@/plugins/axios'
import type { User, LoginLocale, CasLogin, UserRegister } from '#/user'


interface UserStore {
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
            return state.user?.first_name.charAt(0)
        }
    },

    actions: {
        async logIn(url: string, data: LoginLocale | CasLogin) {
            const response = await _axios.post(url, data)
            const {access_token, refresh_token, user} = response.data
            localStorage.setItem('access', access_token)
            localStorage.setItem('refresh', refresh_token)
            this.user = user
        },
        register(url: string, newUser: UserRegister) {
            const data = {
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
                phone: newUser.phone,
                associations: newUser.associations
            }
            _axios.post(url, data).then(response => {
                console.log(response)
            })
        }
    }
})

