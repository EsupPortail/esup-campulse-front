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
        },
        userInfosUpdate: (state: UserManagerStore) => {
            return {
                firstName: state.user?.firstName as string,
                lastName: state.user?.lastName as string,
                email: state.user?.email as string,
                phone: state.user?.phone as string
            }
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
        // to re test
        async getUserAssociations(id: number) {
            let userId: number | undefined = undefined
            if (!this.user || (this.user?.id !== id)) {
                userId = id
            } else {
                userId = this.user?.id
            }
            this.userAssociations = (await _axios.get(`/users/associations/${userId}`)).data
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
            const userToUpdate: ManagedUser = this.users.find((user) => user.id === this.user?.id) as ManagedUser
            // Only patch those updates for non CAS users
            if (!this.user?.isCas) {
                if (updatedUser.firstName !== this.user?.firstName) {
                    (this.user as ManagedUser).firstName = updatedUser.firstName
                    userToUpdate.lastName = updatedUser.firstName
                    await _axios.patch(`/users/${this.user?.id}`, {firstName: updatedUser.firstName})
                }
                if (updatedUser.lastName !== this.user?.lastName) {
                    (this.user as ManagedUser).lastName = updatedUser.lastName
                    userToUpdate.lastName = updatedUser.lastName
                    await _axios.patch(`/users/${this.user?.id}`, {lastName: updatedUser.lastName})
                }
                if (updatedUser.email !== this.user?.email) {
                    (this.user as ManagedUser).email = updatedUser.email
                    userToUpdate.email = updatedUser.email;
                    // also patch username based on email
                    (this.user as ManagedUser).username = updatedUser.email
                    userToUpdate.username = updatedUser.email
                    await _axios.patch(`/users/${this.user?.id}`, {
                        email: updatedUser.email,
                        username: updatedUser.email
                    })
                }
            }
            if (updatedUser.phone != this.user?.phone) {
                (this.user as ManagedUser).phone = updatedUser.phone
                userToUpdate.phone = updatedUser.phone
                await _axios.patch(`/users/${this.user?.id}`, {phone: updatedUser.phone})
            }
        }
    }
})


