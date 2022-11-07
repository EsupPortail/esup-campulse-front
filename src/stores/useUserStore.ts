import { defineStore } from 'pinia'
import _axios from '@/plugins/axios'
import type { User } from '#/user'
import router  from '@/router'
import axios from 'axios'


interface UserStore {
    user: User | undefined
}

export const useUserStore = defineStore('userStore', {
    state: (): UserStore => ({
        user: undefined
    }),

    getters: {
        userNameFirstLetter(state): string | undefined {
            return state.user?.first_name.charAt(0)
        }
    },

    actions: {
        async fetchUser() {
            const data = await fetch("/user")
            this.user = await data.json()
        },
        logIn(username: string | null, password: string | null) {
            const url = '/users/auth/login/'
            return _axios.post(url, {username: username, password: password})
                .then(response => {
                    const {access_token, refresh_token, user} = response.data
                    localStorage.setItem('access', access_token)
                    localStorage.setItem('refresh', refresh_token)
                    this.user = user
                    // this.isLogged = true
                })
                .then(() => (
                        router.push({name: 'Home'})
                    )
                ).catch(error => {
                    window.confirm("Erreur identifiants, veuillez réessayer.")
                    console.log(error)
                })
        },
        isAuth() {
            const access = localStorage.getItem('access')
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + access
            _axios.post('/users/auth/token/verify/').then(() => {
                return true
            }).catch(() => {
                    return false
                })
        },
        register(first_name: string, last_name: string, email: string, phone: string | null,
                 asso_name: string | null, asso_has_office_status: boolean) {
            const url = '/users/auth/registration/'
            const data = { first_name: first_name, last_name: last_name, email: email,
            phone: phone, asso_name: asso_name, asso_has_office_status: asso_has_office_status }

            _axios.post(url, data).then(response => {
                console.log(response)
            })
                .catch(error => {
                    console.log(error)
                })
        }
    }
})

