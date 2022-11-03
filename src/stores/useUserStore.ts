import { defineStore } from 'pinia'
import _axios from '@/plugins/axios'
import type { User } from "#/user"
import router  from '@/router'


interface UserStore {
  user: User | null
}

export const useUserStore = defineStore('UserLogin', {
    state: (): UserStore => ({
        user: null
    }),

    getters: {
        userNameFirstLetter(state): string | null {
            return state.user.first_name.charAt(0)
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
                    const {access, refresh, user} = response.data
                    localStorage.setItem('access', access)
                    localStorage.setItem('refresh', refresh)
                    this.user = user
                })
                .then(() => (
                        router.push({name: 'Home'})
                    )
                )
        },
    }
})


