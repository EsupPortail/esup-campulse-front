import {defineStore} from 'pinia'
import type {FundStore} from '#/fund'
import type {SelectLabel} from '#/global'
import * as commissionService from '@/services/CommissionService'

export const useFundStore = defineStore('fundStore', {
  state: (): FundStore => ({
    funds: []
  }),

  getters: {
    fundLabels: (state: FundStore): SelectLabel[] => {
      return state.funds.map(fund => ({
        value: fund.id,
        label: fund.acronym
      }))
    }
  },

  actions: {
    async getFunds() {
      this.funds = await commissionService.getFunds()
    }
  }
})
