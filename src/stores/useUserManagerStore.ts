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
import {useAxios} from '@/plugins/axios'

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
            const {axiosAuthenticated} = useAxios()
            this.users = (await axiosAuthenticated.value.get<ManagedUsers>('/users/')).data
        },
        async getUnvalidatedUsers() {
            const {axiosAuthenticated} = useAxios()
            this.users = (await axiosAuthenticated.value.get<ManagedUsers>('/users/?is_validated_by_admin=false')).data
        },
        async getUserDetail(id: number) {
            const {axiosAuthenticated} = useAxios()
            this.user = (await axiosAuthenticated.value.get<ManagedUser>(`/users/${id}`)).data
            this.user.groups = (await axiosAuthenticated.value.get<UserGroup[]>(`/users/groups/${id}`)).data
        },
        async updateUserGroups(userGroups: number[]) {
            const {axiosAuthenticated} = useAxios()
            await axiosAuthenticated.value.post('/users/groups/', {username: this.user?.username, groups: userGroups})
        },
        async deleteUserGroups(groupsToDelete: number[]) {
            const {axiosAuthenticated} = useAxios()
            for (let i = 0; i < groupsToDelete.length; i++) {
                await axiosAuthenticated.value.delete(`/users/groups/${this.user?.id}/${groupsToDelete[i]}`)
            }
        },
        async validateUser() {
            const {axiosAuthenticated} = useAxios()
            await axiosAuthenticated.value.patch(`/users/${this.user?.id}`, {isValidatedByAdmin: true})
        },
        async deleteUser() {
            const {axiosAuthenticated} = useAxios()
            await axiosAuthenticated.value.delete(`/users/${this.user?.id}`)
        },
        async getUserAssociations(id: number) {
            const {axiosAuthenticated} = useAxios()
            this.userAssociations = (await axiosAuthenticated.value.get<UserAssociationDetail[]>(`/users/associations/${id}`)).data
        },
        async deleteUserAssociation(associationId: number) {
            const {axiosAuthenticated} = useAxios()
            await axiosAuthenticated.value.delete(`/users/associations/${this.user?.id}/${associationId}`)
        },
        async patchUserAssociations(associationId: number, infosToPatch: UserAssociationPatch) {
            const {axiosAuthenticated} = useAxios()
            await axiosAuthenticated.value.patch(`/users/associations/${this.user?.id}/${associationId}`, infosToPatch)
        },
        async updateUserInfos(user: UserToUpdate) {
            let infosToPatch = {}
            for (const [key, value] of Object.entries(user)) {
                if (value !== this.user?.[key as keyof typeof this.user]) {
                    infosToPatch = Object.assign(infosToPatch, {[key]: value})
                }
            }
            if (Object.keys(infosToPatch).length > 0) {
                const {axiosAuthenticated} = useAxios()
                await axiosAuthenticated.value.patch(`/users/${this.user?.id}`, infosToPatch)
            }
        }
    }
})


