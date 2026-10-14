import {defineStore} from 'pinia'
import type {Fund} from '#/commission'
import type {FundStore} from '#/fund'
import {useAxios} from '@/composables/useAxios'
import type {SelectLabel} from '#/global'

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
      if (this.funds.length) return
      const {axiosPublic} = useAxios()
      this.funds = (await axiosPublic.get<Fund[]>('/commissions/funds/names')).data
    }
  }
})
