import {defineStore} from 'pinia'
import * as groupService from '@/services/GroupService'
import type {GroupStore} from '#/group'

export const useGroupStore = defineStore('groupStore', {
  state: (): GroupStore => ({
    groups: []
  }),

  getters: {
    //
  },

  actions: {
    async getGroups() {
      this.groups = await groupService.getGroups()
    }
  }
})
