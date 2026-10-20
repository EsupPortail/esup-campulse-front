import {defineStore} from 'pinia'
import type {SelectLabel} from '#/global'
import {useAxios} from '@/composables/useAxios'
import useUtility from '@/composables/useUtil'
import type {Commission, CommissionFilters, CommissionStore, NewCommission, UpdateCommission} from '#/commission'
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

    // todo refactor with default function
    async getNextCommission() {
      const {axiosPublic} = useAxios()
      const url = '/commissions/?is_open_to_projects=true'
      const openCommissions = (await axiosPublic.get<Commission[]>(url)).data
      this.commission = openCommissions[0]
    },

    async getCommissionFunds() {
      this.commissionFunds = await commissionService.getCommissionFunds()
    },

    // todo refactor
    async postNewCommission(commission: NewCommission) {
      const {axiosAuthenticated} = useAxios()
      const newCommission: Commission = (await axiosAuthenticated.post('/commissions/', {
        commissionDate: commission.commissionDate,
        submissionDate: commission.submissionDate,
        isOpenToProjects: commission.isOpenToProjects,
        name: commission.name
      })).data
      for (const fund of commission.funds) {
        await axiosAuthenticated.post('/commissions/funds', {
          commission: newCommission.id,
          fund
        })
      }
    },

    // todo refactor
    async updateCommission(commission: UpdateCommission) {
      const {axiosAuthenticated} = useAxios()
      let dataToPatch = {}
      if (commission.newName !== commission.oldName)
        dataToPatch = Object.assign(dataToPatch, {name: commission.newName})
      if (commission.newCommissionDate !== commission.oldCommissionDate)
        dataToPatch = Object.assign(dataToPatch, {commissionDate: commission.newCommissionDate})
      if (commission.newSubmissionDate !== commission.oldSubmissionDate)
        dataToPatch = Object.assign(dataToPatch, {submissionDate: commission.newSubmissionDate})
      if (commission.newIsOpenToProjects !== commission.oldIsOpenToProjects)
        dataToPatch = Object.assign(dataToPatch, {isOpenToProjects: commission.newIsOpenToProjects})
      if (Object.entries(dataToPatch).length) {
        await axiosAuthenticated.patch(`/commissions/${commission.id}`, dataToPatch)
      }
      const {arraysAreEqual} = useUtility()
      if (arraysAreEqual(commission.oldFunds, commission.newFunds)) return
      const newFundsToPost = commission.newFunds.filter(x => commission.oldFunds.indexOf(x) === -1)
      const oldFundsToDelete = commission.oldFunds.filter(x => commission.newFunds.indexOf(x) === -1)

      for (const fund of newFundsToPost) {
        await axiosAuthenticated.post('/commissions/funds', {
          commission: commission.id,
          fund
        })
      }
      for (const fund of oldFundsToDelete) {
        await axiosAuthenticated.delete(`/commissions/${commission.id}/funds/${fund}`)
      }
    },
  }
})
