import { defineStore } from 'pinia'
import _axios from '@/plugins/axios'
import type { UserLogin } from "#/user"
import router  from '@/router'


interface UserLoginStore {
    user: UserLogin
}

export const useUserLoginStore = defineStore('UserLogin', {
    state: (): UserLoginStore => ({
        user: {
            username: '',
            password: ''
        }
    }),
    getters: {},
    actions: {
        login() {
            const url = 'api/token/'
                return _axios.post(url, this.user)
                    .then(response => {
                        const {access, refresh} = response.data
                        localStorage.setItem('access', access)
                        localStorage.setItem('refresh', refresh)
                    })
                    .then(() => (
                        router.push({name: 'home'})
                    )
                )

        }
    }
})
