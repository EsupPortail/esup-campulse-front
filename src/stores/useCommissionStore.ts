import {defineStore} from 'pinia'
import type {PaginatedList, SelectLabel} from '#/global'
import type {CommissionFilters, CommissionStore, ManagedCommission} from '#/commission'
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
    },
    managedCommissions: (state: CommissionStore): PaginatedList<ManagedCommission> | undefined =>
      state.commissions as PaginatedList<ManagedCommission> | undefined,
    managedCommission: (state: CommissionStore): ManagedCommission | undefined =>
      state.commission as ManagedCommission | undefined
  },

  actions: {
    async getCommissions(filters?: Partial<CommissionFilters>) {
      this.commissions = await commissionService.getCommissions(filters)
    },

    async getManagedCommissions(filters?: Partial<CommissionFilters>) {
      this.commissions = await commissionService.getManagedCommissions(filters)
    },

    async getCommission(commissionId: number) {
      this.commission = await commissionService.getCommission(commissionId)
    },

    async getManagedCommission(commissionId: number) {
      this.commission = await commissionService.getManagedCommission(commissionId)
    },

    async getCommissionFunds() {
      this.commissionFunds = await commissionService.getCommissionFunds()
    }
  }
})
