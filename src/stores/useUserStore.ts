import { defineStore } from 'pinia'
import type { UserAPIList } from '#/index'
import _axios from '@/plugins/axios'
import { ref } from 'vue'

interface UserStateStore {
  users: UserAPIList[]
}

const useUserStore = defineStore('User', {
  state: (): UserStateStore => ({
    users: []
  }),

  getters: {},

  actions: {
    async fetchUsers() {
      const { data } = await _axios.get<UserAPIList[]>('/users')
      this.users = data
    }
  }
})
