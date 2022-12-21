import {defineStore} from 'pinia'
import type {
    ManagedUser,
    ManagedUsers,
    UserAssociationDetail,
    UserDirectory,
    UserGroup,
    UserManagerStore,
    UserNames
} from '#/user'
import _axios from '@/plugins/axios'

export const useUserManagerStore = defineStore('userManagerStore', {
    state: (): UserManagerStore => ({
        user: undefined,
        users: [],
        allUsers: false,
        userAssociations: []
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
                    associations: user.associations,
                    groups: user.groups,
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
                this.users = (await _axios.get<ManagedUsers>('/users/')).data
                this.allUsers = true
            }
        },
        async getUnvalidatedUsers() {
            if (this.users.length === 0 || this.allUsers === true) {
                this.users = (await _axios.get<ManagedUsers>('/users/?is_validated_by_admin=false')).data
                this.allUsers = false
            }
        },
        async getUserDetail(id: number) {
            if (this.user?.id !== id) {
                if (this.users.length !== 0) {
                    this.user = this.users.find((user) => user.id === id)
                } else {
                    this.user = (await _axios.get<ManagedUser>(`/users/${id}`)).data
                    this.user.groups = (await _axios.get<UserGroup[]>(`/users/groups/${id}`)).data
                }
            }
        },
        async updateUserGroups(userGroups: number[]) {
            await _axios.post('/users/groups/', {username: this.user?.username, groups: userGroups})
        },
        async deleteUserGroups(groupsToDelete: number[]) {
            for (let i = 0; i < groupsToDelete.length; i++) {
                await _axios.delete(`/users/groups/${this.user?.id}/${groupsToDelete[i]}`)
            }
        },
        async validateUser() {
            await _axios.patch(`/users/${this.user?.id}`, {isValidatedByAdmin: true})
            const validatedUser = this.users.findIndex((user) => user.id === this.user?.id)
            this.users.splice(validatedUser, 1)
        },
        async deleteUser() {
            await _axios.delete(`/users/${this.user?.id}`)
            const userToDelete = this.users.findIndex((user) => user.id === this.user?.id)
            this.users.splice(userToDelete, 1)
        },
        async getUserAssociations() {
            this.userAssociations = (await _axios.get(`/users/associations/${this.user?.id}`)).data
        },
        // to test
        async deleteUserAssociation(associationId: number) {
            await _axios.delete(`/users/associations/${this.user?.id}/${associationId}`)
            const associationToDelete = this.userAssociations.findIndex((association) => association.association.id === associationId)
            this.userAssociations.splice(associationToDelete, 1)
        },
        // to test
        async updateUserAssociations(updatedUserAssociations: UserAssociationDetail[]) {
            if (JSON.stringify(updatedUserAssociations) !== JSON.stringify(this.userAssociations)) {
                await _axios.post('/users/associations/', updatedUserAssociations)
                this.userAssociations = updatedUserAssociations
            }
        },
        // to test
        async updateUserInfos(updatedUser: ManagedUser) {
            if (JSON.stringify(updatedUser) !== JSON.stringify(this.user)) {
                const userToUpdate: ManagedUser = this.users.find((user) => user.id === this.user?.id) as ManagedUser
                const infosToPatch = {
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: ''
                }
                // Only patch those updates for non CAS users
                if (!this.user?.isCas) {
                    if (updatedUser.firstName !== this.user?.firstName) {
                        (this.user as ManagedUser).firstName = updatedUser.firstName
                        userToUpdate.firstName = updatedUser.firstName
                        infosToPatch.firstName = updatedUser.firstName
                    }
                    if (updatedUser.lastName !== this.user?.lastName) {
                        (this.user as ManagedUser).lastName = updatedUser.lastName
                        userToUpdate.lastName = updatedUser.lastName
                        infosToPatch.lastName = updatedUser.lastName
                    }
                    if (updatedUser.email !== this.user?.email) {
                        (this.user as ManagedUser).email = updatedUser.email
                        userToUpdate.email = updatedUser.email
                        infosToPatch.email = updatedUser.email
                        // also patch username ?
                    }
                }
                if (updatedUser.phone != this.user?.phone) {
                    (this.user as ManagedUser).phone = updatedUser.phone
                    userToUpdate.phone = updatedUser.phone
                    infosToPatch.phone = updatedUser.phone as string
                }

                await _axios.patch(`/users/${this.user?.id}`, infosToPatch)
            }
        }
    }
})


