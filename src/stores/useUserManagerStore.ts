import {defineStore} from 'pinia'
import type {User, UserAssociationPatch, UserManagerStore, UserNames} from '#/user'
import {useAxios} from '@/composables/useAxios'
import {useUserStore} from "@/stores/useUserStore";
import useSecurity from "@/composables/useSecurity";

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
        userGroups: (state: UserManagerStore): number[] => {
            return state.user?.groups?.map<number>(group => group.groupId) || []
        },
        /*userInfosUpdate: (state: UserManagerStore): UserToUpdate => {
            return {
                firstName: state.user?.firstName as string,
                lastName: state.user?.lastName as string,
                username: state.user?.username as string,
                email: state.user?.email as string,
                phone: state.user?.phone as string
            }
        },*/
        /*userAssociationStatus: (state: UserManagerStore): AssociationUser[] => {
            return state.userAssociations.map(association => ({
                association: association.association.id,
                name: association.association.name,
                isPresident: association.isPresident,
                canBePresident: association.canBePresident,
                isValidatedByAdmin: association.isValidatedByAdmin,
                isSecretary: association.isSecretary,
                isTreasurer: association.isTreasurer,
            }))
        }*/
    },

    actions: {
        /**
         * It gets the users from the API, and if the user has institutions, it gets the users from those institutions
         */
        async getUsers() {
            const {axiosAuthenticated} = useAxios()
            const {hasPerm} = useSecurity()
            const userStore = useUserStore()
            let url = '/users/?institutions='
            if (userStore.userInstitutions?.length !== 0) {
                url += userStore.userInstitutions?.join(',')
                if (hasPerm('change_user_misc')) url += ','
                this.users = (await axiosAuthenticated.get<User[]>(url)).data
            }
        },
        /**
         * It gets all the users that are not validated by the admin, and if the user is an admin, it filters the users by
         * the institutions the admin is associated with
         */
        async getUnvalidatedUsers() {
            const {axiosAuthenticated} = useAxios()
            const {hasPerm} = useSecurity()
            const userStore = useUserStore()
            let url = '/users/?is_validated_by_admin=false'
            if (userStore.userInstitutions && userStore.userInstitutions?.length !== 0) {
                url += `&institutions=${userStore.userInstitutions?.join(',')}`
                if (hasPerm('change_user_misc')) url += ','
                this.users = (await axiosAuthenticated.get<User[]>(url)).data
            }
        },
        /**
         * It gets the user detail from the API.
         * @param {number} id - number - The id of the user to get
         */
        async getUserDetail(id: number) {
            const {axiosAuthenticated} = useAxios()
            this.user = (await axiosAuthenticated.get<User>(`/users/${id}`)).data
        },
        /**
         * It takes an array of group IDs, and adds the user to each group
         * @param {number[]} groupsToAdd - number[] - An array of group IDs to add to the user.
         */
        async updateUserGroups(groupsToAdd: number[]) {
            const {axiosAuthenticated} = useAxios()
            for (const group of groupsToAdd) {
                await axiosAuthenticated.post('/users/groups/', {username: this.user?.username, group: group})
            }
        },
        /**
         * It deletes all the groups in the array `groupsToDelete` from the user with the id `this.user?.id`
         * @param {number[]} groupsToDelete - number[] - An array of group IDs to delete
         */
        async deleteUserGroups(groupsToDelete: number[]) {
            const {axiosAuthenticated} = useAxios()
            for (let i = 0; i < groupsToDelete.length; i++) {
                await axiosAuthenticated.delete(`/users/groups/${this.user?.id}/${groupsToDelete[i]}`)
            }
        },
        async validateUser() {
            const {axiosAuthenticated} = useAxios()
            await axiosAuthenticated.patch(`/users/${this.user?.id}`, {isValidatedByAdmin: true})
        },
        async deleteUser() {
            const {axiosAuthenticated} = useAxios()
            await axiosAuthenticated.delete(`/users/${this.user?.id}`)
        },
        async deleteUserAssociation(associationId: number) {
            const {axiosAuthenticated} = useAxios()
            await axiosAuthenticated.delete(`/users/associations/${this.user?.id}/${associationId}`)
        },
        async patchUserAssociations(associationId: number, infosToPatch: UserAssociationPatch) {
            const {axiosAuthenticated} = useAxios()
            await axiosAuthenticated.patch(`/users/associations/${this.user?.id}/${associationId}`, infosToPatch)
        }
    }
})


