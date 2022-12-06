import { defineStore } from 'pinia'
import type {
    User,
    UserDirectory,
    UserList,
    UserNames,
    UsersStore,
    UserValidate
} from '#/user'
import _axios from '@/plugins/axios'


export const useUsersStore = defineStore('usersStore', {
    state: (): UsersStore => ({
        user: {} as User,
        users: []
    }),

    getters: {
        userNames: (state: UsersStore): UserNames => {
            return state.users
                .map(user => ({
                    value: user.id,
                    label: user.firstName + ' ' + user.lastName
                }))
        },
        userDirectory: (state: UsersStore): UserDirectory => {
            return state.users
                .map(user => ({
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    isValidatedByAdmin: user.isValidatedByAdmin
                }))
        }
    },

    actions: {
        async getUsers() {
            if (this.users.length === 0) {
                this.users = (await _axios.get<UserList[]>('/users/')).data
            }
        },
        async getUserDetail(id: number) {
            if (this.user?.id !== id) {
                this.user = (await _axios.get<User>(`/users/${id}`)).data
            }
        },
        async validateUser(url: string, data: UserValidate) {
            await _axios.patch(url, data)
        },
    }
})


