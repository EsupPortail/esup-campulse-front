import {defineStore} from 'pinia'
import type {User, UserDirectory, UserList, UserManagerStore, UserNames} from '#/user'
import _axios from '@/plugins/axios'


export const useUserManagerStore = defineStore('userManagerStore', {
    state: (): UserManagerStore => ({
        user: undefined,
        users: [],
        allUsers: false
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
            if (this.users.length === 0 || this.allUsers === false) {
                this.users = (await _axios.get<UserList[]>('/users/')).data
                this.allUsers = true
            }
        },
        async getUnvalidatedUsers() {
            if (this.users.length === 0 || this.allUsers === true) {
                this.users = (await _axios.get<UserList[]>('/users/?is_validated_by_admin=false')).data
                this.allUsers = false
            }
        },
        async getUserDetail(id: number) {
            if (this.user?.id !== id) {
                this.user = (await _axios.get<User>(`/users/${id}`)).data
            }
        },
        async updateUserGroups(userGroups: number[]) {
            await _axios.post('/users/groups/', {username: this.user?.username, groups: userGroups})
        },
        async validateUser() {
            await _axios.patch(`/users/${this.user?.id}`, {isValidatedByAdmin: true})
        },
        async deleteUser() {
            await _axios.delete(`/users/${this.user?.id}`)
        },
        async deleteUserGroups() {
            for (let i = 0; i < this.userGroups.length; i++) {
                await _axios.delete(`/users/groups/${this.user?.id}/${this.userGroups[i]}`)
            }
        },
        unLoadUsers() {
            this.user = undefined
            this.users = []
        }
    }
})


