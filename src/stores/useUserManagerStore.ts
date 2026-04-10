import {defineStore} from 'pinia'
import type {User, UserAssociation, UserGroupRegister, UserManagerStore, UserNames} from '#/user'
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
        async getUsers(status: 'all' | 'validated' | 'unvalidated' | string) {
            const {hasPerm} = useSecurity()
            if (!hasPerm('view_user')) return

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
        },

        async getUserDetail(id: number) {
            const {axiosAuthenticated} = useAxios()
            this.user = (await axiosAuthenticated.get<User>(`/users/${id}`)).data
        },

        async updateUserGroups(groupsToAdd: number[], fundsToUpdate: number[]) {
            const {commissionGroup} = useUserGroups()
            const {axiosAuthenticated} = useAxios()

            // Initialize object to post
            const data: UserGroupRegister = {
                user: this.user?.id,
                group: null,
                institution: null,
                fund: null
            }

            for (const group of groupsToAdd) {
                data.group = group
                // if groupsToAdd includes commissionGroup
                if (group === commissionGroup.value?.id) {
                    for (const fund of fundsToUpdate) {
                        data.fund = fund
                        await axiosAuthenticated.post('/users/groups/', data)
                    }
                } else {
                    data.fund = null
                    await axiosAuthenticated.post('/users/groups/', data)
                }
            }

            const needToAddCommissionGroup = groupsToAdd.includes(commissionGroup.value?.id as number)
            const hasFundsToUpdate = !!fundsToUpdate.length

            if (!needToAddCommissionGroup && hasFundsToUpdate) {
                data.group = commissionGroup.value?.id as number
                for (const fund of fundsToUpdate) {
                    data.fund = fund
                    await axiosAuthenticated.post('/users/groups/', data)
                }
            }
        },

        async deleteUserGroups(groupsToDelete: number[], fundsToDelete: number[]) {
            const {axiosAuthenticated} = useAxios()
            const {commissionGroup} = useUserGroups()
            const {userFunds} = useCommissions()
            for (const group of groupsToDelete) {
                if (group !== commissionGroup.value?.id) {
                    const url = `/users/${this.user?.id}/groups/${group}`
                    await axiosAuthenticated.delete(url)
                } else {
                    for (const fund of userFunds.value) {
                        const url = `/users/${this.user?.id}/groups/${commissionGroup.value?.id}/funds/${fund}`
                        await axiosAuthenticated.delete(url)
                    }
                }
            }
            for (const fund of fundsToDelete) {
                const url = `/users/${this.user?.id}/groups/${commissionGroup.value?.id}/funds/${fund}`
                await axiosAuthenticated.delete(url)
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
            if (!searchQuery) return

            const {hasPerm} = useSecurity()
            if (!hasPerm('view_user')) return

            const {axiosAuthenticated} = useAxios()

            const userStore = useUserStore()

            const urlString = '/users/?'
            const urlArray = []

            urlArray.push(`search=${searchQuery}`)

            if (userStore.userInstitutions?.length) {
                let institutions = 'institutions='
                institutions += userStore.userInstitutions?.join(',')
                if (hasPerm('view_user_misc')) institutions += ','
                urlArray.push(institutions)
            }

            this.users = (await axiosAuthenticated.get<User[]>(urlString + urlArray.join('&'))).data
        },
        async getUserDocuments() {
            const {axiosAuthenticated} = useAxios()
            const url = `/documents/uploads?user_id=${this.user?.id}`
            this.userDocuments = (await axiosAuthenticated.get<DocumentUpload[]>(url)).data
        },

        async getUserAssociations(userId: number | null | undefined) {
            const {axiosAuthenticated} = useAxios()

            const url = `/users/${userId}/associations/`

            const response = await axiosAuthenticated.get<UserAssociation[]>(url)
            this.userAssociations = response.data
        }
    }
})
