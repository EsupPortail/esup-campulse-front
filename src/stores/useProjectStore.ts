import {defineStore} from 'pinia'
import type {
  Project,
  ProjectCategoryName,
  ProjectCommissionFund,
  ProjectReview,
  ProjectStatus,
  ProjectStore
} from '#/project'
import {useAxios} from '@/composables/useAxios'
import type {SelectLabel} from '#/global'
import type {DocumentUpload} from '#/document'
import useCommissions from '@/composables/useCommissionFund'


export const useProjectStore = defineStore('projectStore', {
  state: (): ProjectStore => ({
    project: undefined,
    projects: undefined,
    projectCommissionFunds: [],
    projectDocuments: [],
    projectCategoryNames: [],
    projectReview: undefined
  }),

  getters: {
    projectCategoriesLabels: (state: ProjectStore): SelectLabel[] => {
      return state.projectCategoryNames.map(category => ({
        value: category.id,
        label: category.name
      }))
    },
    projectCommission: (state: ProjectStore): number | undefined => {
      const {commissionFunds, commissions} = useCommissions()
      return commissions.value
        .find(commission => commission.id === (commissionFunds.value
          .find(commissionFund => commissionFund.id === (state.projectCommissionFunds[0]?.commissionFund))?.commission))?.id
    },
    projectFunds: (state: ProjectStore): number[] => {
      const {commissionFunds} = useCommissions()
      const projectFunds: number[] = []
      state.projectCommissionFunds.forEach(projectCommissionFund => {
        const commissionFund = commissionFunds.value.find(commissionFund => commissionFund.id === projectCommissionFund.commissionFund)
        if (commissionFund) {
          projectFunds.push(commissionFund.fund)
        }
      })
      return projectFunds
    },
    projectStatuses: (): ProjectStatus[] => {
      return [
        'PROJECT_DRAFT',
        'PROJECT_DRAFT_PROCESSED',
        'PROJECT_PROCESSING',
        'PROJECT_REJECTED',
        'PROJECT_VALIDATED',
        'PROJECT_REVIEW_DRAFT',
        'PROJECT_REVIEW_PROCESSING',
        'PROJECT_REVIEW_VALIDATED',
        'PROJECT_CANCELED'
      ]
    }
  },
  actions: {
    async getProjectCategoryNames(onlyEnabled?: boolean) {
      const {axiosPublic} = useAxios()
      const url = `/projects/categories/names${onlyEnabled ? '?is_enabled=true' : ''}`
      this.projectCategoryNames = (await axiosPublic.get<ProjectCategoryName[]>(url)).data
    },

    async getProjectDetail(id: number) {
      const {axiosAuthenticated} = useAxios()
      this.project = (await axiosAuthenticated.get<Project>(`/projects/${id}`)).data
    },

    async getProjectCommissionFunds(asManager: boolean, commission: number | undefined) {
      const {axiosAuthenticated} = useAxios()
      let url = ''
      if (asManager) {
        url = '/projects/commission_funds'
        if (commission) url += `?commission_id=${commission}`
      } else {
        url = `/projects/${this.project?.id}/commission_funds`
      }
      this.projectCommissionFunds = (await axiosAuthenticated.get<ProjectCommissionFund[]>(url)).data
    },

    async getProjectDocuments() {
      const {axiosAuthenticated} = useAxios()
      const url = `/documents/uploads?project_id=${this.project?.id}`
      this.projectDocuments = (await axiosAuthenticated.get<DocumentUpload[]>(url)).data
    },

    async getProjects(params?: { commission?: number, association?: number }) {
      const {axiosAuthenticated} = useAxios()
      let url = '/projects/'
      const factory = []
      if (params?.commission) factory.push(`commission_id=${params.commission}`)
      if (params?.association) factory.push(`association_id=${params.association}`)
      if (factory.length) url += '?' + factory.join('&')
      this.projects = (await axiosAuthenticated.get<ProjectList>(url)).data
    },

    async getProjectReview(projectId: number) {
      const {axiosAuthenticated} = useAxios()
      const url = `/projects/${projectId}/review`
      this.projectReview = (await axiosAuthenticated.get<ProjectReview>(url)).data
    },

    async getProjectPdf(id: number) {
      const {axiosAuthenticated} = useAxios()
      const url = `/projects/${id}/pdf_export`
      return await axiosAuthenticated.get(url, {responseType: 'arraybuffer'})
    },

    async getProjectReviewPdf(id: number) {
      const {axiosAuthenticated} = useAxios()
      const url = `/projects/${id}/review/pdf_export`
      return await axiosAuthenticated.get(url, {responseType: 'arraybuffer'})
    },

    async getProjectFiles(id: number) {
      const {axiosAuthenticated} = useAxios()
      const url = `/documents/uploads/file?project_id=${id}`
      return await axiosAuthenticated.get(url, {responseType: 'arraybuffer'})
    },

    async patchProjectStatus(projectStatus: ProjectStatus) {
      const {axiosAuthenticated} = useAxios()
      if (this.project?.projectStatus === projectStatus) return
      await axiosAuthenticated.patch(`/projects/${this.project.id}/status`, {projectStatus})
      this.project.projectStatus = projectStatus
    },

    async patchProjectCommissionFund(oldCommissionFund: number, newCommissionFund: number) {
      const {axiosAuthenticated} = useAxios()
      const url = `/projects/${this.project?.id}/commission_funds/${oldCommissionFund}`
      await axiosAuthenticated.patch(url, {newCommissionFundId: newCommissionFund})
    },

    async postponeProject(projectId: number, newCommissionId: number) {
      const {axiosAuthenticated} = useAxios()
      const url = `/projects/${projectId}/postpone`
      await axiosAuthenticated.patch(url, {newCommissionId})
    }
  }

})
