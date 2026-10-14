import {defineStore} from 'pinia'
import type {User, UserAssociation, UserGroupRegister, UserNames, UserStore} from '#/user'
import {useAxios} from '@/composables/useAxios'
import useSecurity from '@/composables/useAuthentication'
import useUserGroups from '@/composables/useUserGroup'
import type {DocumentUpload} from '#/document'

export const useUserStore = defineStore('userStore', {
  state: (): UserStore => ({
    user: undefined,
    users: [],
    userAssociations: [],
    userDocuments: []
  }),

  getters: {
    userNames: (state: UserStore): UserNames => {
      return state.users
        .map(user => ({
          value: user.id,
          label: user.firstName + ' ' + user.lastName
        }))
    },
    userGroups: (state: userStore): number[] => {
      return [...new Set(state.user?.groups?.map<number>(group => group.groupId))]
    },
    userFunds: (state: userStore): number[] => {
      return state.user?.groups?.reduce((factory, group) => {
        if (group.fundId) {
          factory.push(group.fundId)
        }
        return factory
      }, [])
    }
  },

  actions: {
    async getUsers(status: 'all' | 'validated' | 'unvalidated' | string) {
      const {hasPerm} = useSecurity()
      if (!hasPerm('view_user')) return

      const {axiosAuthenticated} = useAxios()

      const urlString = '/users/?'
      const urlArray = []

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
      for (const group of groupsToDelete) {
        if (group === commissionGroup.value?.id) {
          for (const fund of this.userFunds) {
            const url = `/users/${this.user?.id}/groups/${commissionGroup.value?.id}/funds/${fund}`
            await axiosAuthenticated.delete(url)
          }
        } else {
          const url = `/users/${this.user?.id}/groups/${group}`
          await axiosAuthenticated.delete(url)
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
    async searchUsers(searchQuery: string, status?: 'validated' | 'unvalidated' | '') {
      if (!searchQuery) return

      const {hasPerm} = useSecurity()
      if (!hasPerm('view_user')) return

      const {axiosAuthenticated} = useAxios()

      const urlString = '/users/?'
      const urlArray = []

      urlArray.push(`search=${searchQuery}`)

      if (status) {
        urlArray.push(`is_validated_by_admin=${status === 'validated'}`)
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
