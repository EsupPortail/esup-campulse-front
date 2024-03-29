import {defineStore} from 'pinia'
import type {User, UserGroupRegister, UserManagerStore, UserNames} from '#/user'
import {useAxios} from '@/composables/useAxios'
import {useUserStore} from '@/stores/useUserStore'
import useSecurity from '@/composables/useSecurity'
import useUserGroups from '@/composables/useUserGroups'
import useCommissions from '@/composables/useCommissions'
import type {DocumentUpload} from '#/documents'

export const useUserManagerStore = defineStore('userManagerStore', {
    state: (): UserManagerStore => ({
        user: undefined,
        users: [],
        userAssociations: [],
        userDocuments: []
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
            return [...new Set(state.user?.groups?.map<number>(group => group.groupId))]
        },
        userCommissionFunds: (state: UserManagerStore): number[] => {
            const temp: number[] = []
            state.user?.groups?.forEach((group) => {
                if (group.fundId) temp.push(group.fundId)
            })
            return temp
        }
    },

    actions: {
        /**
         * It gets the users from the API, and if the user has institutions, it gets the users from those institutions
         */
        async getUsers(status: 'all' | 'validated' | 'unvalidated' | string) {
            const {hasPerm} = useSecurity()
            if (hasPerm('view_user')) {
                const {axiosAuthenticated} = useAxios()
                const userStore = useUserStore()

                const urlString = '/users/?'
                const urlArray = []

                if (userStore.userInstitutions?.length !== 0) {
                    let institutions = 'institutions='
                    institutions += userStore.userInstitutions?.join(',')
                    if (hasPerm('view_user_misc')) institutions += ','
                    urlArray.push(institutions)
                }

                if (status === 'validated') urlArray.push('is_validated_by_admin=true')
                else if (status === 'unvalidated') urlArray.push('is_validated_by_admin=false')

                this.users = (await axiosAuthenticated.get<User[]>(urlString + urlArray.join('&'))).data
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
         * @param fundsToUpdate
         */
        async updateUserGroups(groupsToAdd: number[], fundsToUpdate: number[]) {
            const {commissionGroup} = useUserGroups()
            const {axiosAuthenticated} = useAxios()

            // Initialize object to post
            const data: UserGroupRegister = {
                user: this.user?.username as string,
                group: null,
                institution: null,
                fund: null
            }

            for (let i = 0; i < groupsToAdd.length; i++) {
                data.group = groupsToAdd[i]
                // if groupsToAdd includes commissionGroup
                if (groupsToAdd[i] === commissionGroup.value?.id) {
                    for (let j = 0; j < fundsToUpdate.length; j++) {
                        data.fund = fundsToUpdate[j]
                        await axiosAuthenticated.post('/users/groups/', data)
                    }
                } else {
                    data.fund = null
                    await axiosAuthenticated.post('/users/groups/', data)
                }
            }

            if (!groupsToAdd.includes(commissionGroup.value?.id as number) && fundsToUpdate.length !== 0) {
                data.group = commissionGroup.value?.id as number
                for (let i = 0; i < fundsToUpdate.length; i++) {
                    data.fund = fundsToUpdate[i]
                    await axiosAuthenticated.post('/users/groups/', data)
                }
            }
        },
        /**
         * It deletes all the groups in the array `groupsToDelete` from the user with the id `this.user?.id`
         * @param {number[]} groupsToDelete - number[] - An array of group IDs to delete
         * @param fundsToDelete
         */
        async deleteUserGroups(groupsToDelete: number[], fundsToDelete: number[]) {
            const {axiosAuthenticated} = useAxios()
            const {commissionGroup} = useUserGroups()
            const {userFunds} = useCommissions()
            if (groupsToDelete.length) {
                for (let i = 0; i < groupsToDelete.length; i++) {
                    if (groupsToDelete[i] !== commissionGroup.value?.id) {
                        await axiosAuthenticated.delete(`/users/${this.user?.id}/groups/${groupsToDelete[i]}`)
                    } else {
                        for (let i = 0; i < userFunds.value.length; i++) {
                            const url = `/users/${this.user?.id}/groups/${commissionGroup.value?.id}/funds/${userFunds.value[i]}`
                            await axiosAuthenticated.delete(url)
                        }
                    }
                }
            }
            if (fundsToDelete.length) {
                for (let i = 0; i < fundsToDelete.length; i++) {
                    await axiosAuthenticated.delete(`/users/${this.user?.id}/groups/${commissionGroup.value?.id}/funds/${fundsToDelete[i]}`)
                }
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
        async searchUsers(searchQuery: string) {
            const {hasPerm} = useSecurity()
            if (hasPerm('view_user')) {
                const {axiosAuthenticated} = useAxios()
                const userStore = useUserStore()

                const urlString = '/users/?'
                const urlArray = []

                if (searchQuery) {
                    urlArray.push(`search=${searchQuery}`)

                    if (userStore.userInstitutions?.length !== 0) {
                        let institutions = 'institutions='
                        institutions += userStore.userInstitutions?.join(',')
                        if (hasPerm('view_user_misc')) institutions += ','
                        urlArray.push(institutions)
                    }

                    this.users = (await axiosAuthenticated.get<User[]>(urlString + urlArray.join('&'))).data
                }
            }
        },
        async getUserDocuments() {
            const {axiosAuthenticated} = useAxios()
            this.userDocuments = (await axiosAuthenticated.get<DocumentUpload[]>(`/documents/uploads?user_id=${this.user?.id}`)).data
        }
    }
})
