import {defineStore} from 'pinia'
import type {SelectLabel} from '#/global'
import type {CommissionFilters, CommissionStore} from '#/commission'
import * as commissionService from '@/services/CommissionService'

export const useCommissionStore = defineStore('commissionStore', {
  state: (): CommissionStore => ({
    commissions: undefined,
    commission: undefined,
    commissionFunds: []
  }),

  getters: {
    commissionLabels: (state: CommissionStore): SelectLabel[] => {
      return state.commissions?.results.map(commission => ({
        value: commission.id,
        label: commission.name + ' ('
          + commission.commissionDate.split('-').reverse().join('/') + ')'
      }))
    }
  },

  actions: {
    async getCommissions(filters?: CommissionFilters) {
      this.commissions = await commissionService.getCommissions(filters)
    },

    async getCommission(commissionId: number) {
      this.commission = await commissionService.getCommission(commissionId)
    },

    async getCommissionFunds() {
      this.commissionFunds = await commissionService.getCommissionFunds()
    }
  }
})
