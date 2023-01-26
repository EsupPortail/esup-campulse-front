import {defineStore} from 'pinia'
import type {
    ManagedUser,
    ManagedUsers,
    UserAssociationDetail,
    UserAssociationPatch,
    UserAssociationStatus,
    UserDirectory,
    UserGroup,
    UserManagerStore,
    UserNames,
    UserToUpdate
} from '#/user'
import _axios from '@/plugins/axios'

export const useUserManagerStore = defineStore('userManagerStore', {
    state: (): UserManagerStore => ({
        user: undefined,
        users: [],
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
        userDirectory: (state: UserManagerStore): UserDirectory[] => {
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
        userInfosUpdate: (state: UserManagerStore): UserToUpdate => {
            return {
                firstName: state.user?.firstName as string,
                lastName: state.user?.lastName as string,
                email: state.user?.email as string,
                phone: state.user?.phone as string
            }
        },
        userAssociationStatus: (state: UserManagerStore): UserAssociationStatus[] => {
            return state.userAssociations.map(association => ({
                associationId: association.association.id,
                associationName: association.association.name,
                roleName: association.roleName,
                hasOfficeStatus: association.hasOfficeStatus,
                isPresident: association.isPresident
            }))
        }
    },

    actions: {
        async getUsers() {
            this.users = (await _axios.get<ManagedUsers>('/users/')).data
        },
        async getUnvalidatedUsers() {
            this.users = (await _axios.get<ManagedUsers>('/users/?is_validated_by_admin=false')).data
        },
        async getUserDetail(id: number) {
            this.user = (await _axios.get<ManagedUser>(`/users/${id}`)).data
            this.user.groups = (await _axios.get<UserGroup[]>(`/users/groups/${id}`)).data
        },
        async updateUserGroups(userGroups: number[]) {
            await _axios.post('/users/groups/', {username: this.user?.username, groups: userGroups})
        },
        async deleteUserGroups(groupsToDelete: number[]) {
            for (let i = 0; i < groupsToDelete.length; i++) {
                await _axios.delete(`/users/groups/${this.user?.id}/${groupsToDelete[i]}`)
            }
        },
        // to re test
        async validateUser() {
            await _axios.patch(`/users/${this.user?.id}`, {isValidatedByAdmin: true})
        },
        async deleteUser() {
            await _axios.delete(`/users/${this.user?.id}`)
        },
        // to re test
        async getUserAssociations(id: number) {
            this.userAssociations = (await _axios.get<UserAssociationDetail[]>(`/users/associations/${id}`)).data
        },
        // to test for #8
        async deleteUserAssociation(associationId: number) {
            await _axios.delete(`/users/associations/${this.user?.id}/${associationId}`)
        },
        // to test for #8
        async patchUserAssociations(associationId: number, infosToPatch: UserAssociationPatch) {
            await _axios.patch(`/users/associations/${this.user?.id}/${associationId}`, infosToPatch)
        },
        // OK - to test for #8
        async updateUserInfos(user: UserToUpdate) {
            let infosToPatch = {}
            for (const [key, value] of Object.entries(user)) {
                if (value !== this.user?.[key as keyof typeof this.user]) {
                    infosToPatch = Object.assign(infosToPatch, {[key]: value})
                }
            }
            await _axios.patch(`/users/${this.user?.id}`, infosToPatch)
        }
    }
})


