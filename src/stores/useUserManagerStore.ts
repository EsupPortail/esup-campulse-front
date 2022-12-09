import {defineStore} from 'pinia'
import type {User, UserDirectory, UserList, UserManagerStore, UserNames, UserValidate} from '#/user'
import _axios from '@/plugins/axios'


export const useUserManagerStore = defineStore('userManagerStore', {
    state: (): UserManagerStore => ({
        user: {} as User,
        users: []
    }),

    getters: {
        userNames: (state: UserManagerStore): UserNames => {
            return state.users
                .map(user => ({
                    value: user.id,
                    label: user.firstName + ' ' + user.lastName
                }))
        },
        userDirectory: (state: UserManagerStore): UserDirectory => {
            return state.users
                .map(user => ({
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    isValidatedByAdmin: user.isValidatedByAdmin
                }))
        },
        userGroups: (state: UserManagerStore): number[] => {
            return state.user?.groups?.map<number>(group => group.id) || []
        }
    },

    actions: {
        async getUsers() {
            if (this.users.length === 0) {
                this.users = (await _axios.get<UserList[]>('/users/')).data
            }
        },
        async getUsersAdmitted(isValidatedByAdmin = false) {
            if (this.users.length === 0) {
                this.users = (await _axios.get<UserList[]>(`/users/?is_validated_by_admin=${isValidatedByAdmin}`)).data
            }
        },
        async getUserDetail(id: number) {
            if (this.user?.id !== id) {
                this.user = (await _axios.get<User>(`/users/${id}`)).data
            }
        },
        async validateUser(id: number, data: UserValidate) {
            try {
                await _axios.patch(`/users/${id}`, data)
                this.users.forEach((user) => {
                    if (user.id === id) {
                        user.isValidatedByAdmin = !user.isValidatedByAdmin
                    }
                })
            } catch (e) {
                // code
            }
        },
        async deleteUser(id: number) {
            try {
                await _axios.delete(`/users/${id}`)
            } catch (e) {
                // code
            }
        },
    }
})

