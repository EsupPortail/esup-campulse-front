import {defineStore} from 'pinia'
import type {PaginatedList, SelectLabel} from '#/global'
import {useAxios} from '@/composables/useAxios'
import useUtility from '@/composables/useUtil'
import type {Commission, CommissionFund, CommissionStore, NewCommission, UpdateCommission} from '#/commission'

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
    async getCommissionsForManagers(
      withActiveProjects: boolean | undefined,
      onlyWithActiveProjects: boolean | undefined,
      isOpenToProjects: boolean | undefined,
      isSite: boolean | undefined,
      managedProjects: boolean | undefined,
      funds?: number[]) {

      let urlString = '/commissions/'
      const urlArray = []

      if (withActiveProjects !== undefined) urlArray.push(`with_active_projects=${withActiveProjects}`)
      if (onlyWithActiveProjects !== undefined) urlArray.push(`only_with_active_projects=${onlyWithActiveProjects}`)
      if (isOpenToProjects !== undefined) urlArray.push(`is_open_to_projects=${isOpenToProjects}`)
      if (isSite !== undefined) urlArray.push(`is_site=${isSite}`)
      if (managedProjects !== undefined) urlArray.push(`managed_projects=${managedProjects}`)
      if (funds?.length) urlArray.push(`funds=${funds.join(',')}`)

      if (urlArray.length) urlString += `?${urlArray.join('&')}`
      const {axiosPublic} = useAxios()
      this.commissions = (await axiosPublic.get<PaginatedList<Commission>>(urlString)).data
    },

    async getCommissionsToPostponeProject(projectId: number) {
      const {axiosPublic} = useAxios()
      const url = `/commissions/?to_postpone_project=${projectId}`
      this.commissions = (await axiosPublic.get<PaginatedList<Commission>>(url)).data
    },

    async getCommissionsForStudents(isOpenToProjects: boolean | undefined, isSite: boolean | undefined) {
      let urlString = '/commissions/'
      const urlArray = []

      if (isOpenToProjects !== undefined) urlArray.push(`is_open_to_projects=${isOpenToProjects}`)
      if (isSite !== undefined) urlArray.push(`is_site=${isSite}`)

      if (urlArray.length) urlString += `?${urlArray.join('&')}`

      const {axiosPublic} = useAxios()
      this.commissions = (await axiosPublic.get<PaginatedList<Commission>>(urlString)).data
    },

    async getCommission(id: number) {
      const {axiosPublic} = useAxios()
      this.commission = (await axiosPublic.get<Commission>(`/commissions/${id}`)).data
    },

    async getNextCommission() {
      const {axiosPublic} = useAxios()
      const url = '/commissions/?is_open_to_projects=true'
      const openCommissions = (await axiosPublic.get<Commission[]>(url)).data
      this.commission = openCommissions[0]
    },

    async getAllCommissions() {
      const {axiosPublic} = useAxios()
      this.commissions = (await axiosPublic.get<PaginatedList<Commission>>('/commissions/')).data
    },

    async getCommissionFunds(forceRefresh?: boolean) {
      if (!this.commissionFunds.length || forceRefresh) {
        const {axiosPublic} = useAxios()
        this.commissionFunds = (await axiosPublic.get<CommissionFund[]>('/commissions/funds')).data
      }
    },

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

    async deleteCommission(id: number) {
      const {axiosAuthenticated} = useAxios()
      await axiosAuthenticated.delete(`/commissions/${id}`)
    },

    async getCommissionExport(id: number, mode: 'csv' | 'pdf' | 'xlsx', projects: number[] | undefined) {
      const {axiosAuthenticated} = useAxios()
      const url = `/commissions/${id}/export?mode=${mode}&project_ids=${projects?.join(',')}`
      return await axiosAuthenticated.get(url, {responseType: 'arraybuffer'})
    }
  }
})
