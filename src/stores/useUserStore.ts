import { defineStore } from 'pinia'
import _axios from '@/plugins/axios'
import type { User } from '#/user'
import router  from '@/router'
import axios from "axios";


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
            const url = '/dj-rest-auth/login/'
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
                )
        },
        isAuth():boolean {
            const accessToken = localStorage.getItem('access')
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken
            axios.get('/dj-rest-auth/login/').then(response => {
                this.user = response.data.user
            }).catch(error => {
                    return false
                })
            return true
        }
    }
})


