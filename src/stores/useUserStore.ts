import {defineStore} from 'pinia'
import type {UserFilters, UserStore} from '#/user'
import useSecurity from '@/composables/useAuthentication'
import type {SelectLabel} from '#/global'
import * as userService from '@/services/UserService'
import * as documentUploadService from '@/services/DocumentUploadService'

export const useUserStore = defineStore('userStore', {
  state: (): UserStore => ({
    user: undefined,
    users: [],
    userAssociations: [],
    userDocuments: []
  }),

  getters: {
    userNames: (state: UserStore): SelectLabel[] => {
      return state.users
        .map(user => ({
          value: user.id,
          label: user.firstName + ' ' + user.lastName
        }))
    },

    userGroups: (state: UserStore): number[] => {
      return [...new Set(state.user?.groups?.map<number>(group => group.groupId))]
    },
  },

  actions: {
    async getUsers(filters?: UserFilters) {
      const {hasPerm} = useSecurity()
      if (!hasPerm('view_user')) return
      this.users = await userService.getUsers(filters)
    },

    async getUserDetail(userId: number) {
      this.user = await userService.getUserDetail(userId)
    },

    async validateUser() {
      await userService.validateUser(this.user.id)
    },

    async deleteUser() {
      await userService.deleteUser(this.user.id)
    },

    async getUserDocumentUploads() {
      this.userDocuments = await documentUploadService.getUserDocumentUploads(this.user.id)
    },

    async getUserAssociations(userId: number) {
      this.userAssociations = await userService.getUserAssociations(userId)
    },
  }
})
