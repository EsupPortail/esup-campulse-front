import {defineStore} from 'pinia'
import type {ProjectCommissionFundFilter, ProjectStatus, ProjectStore} from '#/project'
import type {SelectLabel} from '#/global'
import useCommissions from '@/composables/useCommissionFund'
import * as projectService from '@/services/ProjectService'
import * as documentUploadService from '@/services/DocumentUploadService'
import type {AxiosResponse} from 'axios'


export const useProjectStore = defineStore('projectStore', {
  state: (): ProjectStore => ({
    project: undefined,
    projects: undefined,
    projectCategoryNames: [],
    projectCommissionFunds: [],
    projectDocuments: [],
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
    async getProjects(params?: { commission?: number, association?: number }): Promise<void> {
      this.projects = await projectService.getProjects(params)
    },

    async getProjectDetail(): Promise<void> {
      this.project = await projectService.getProjectDetail(this.project?.id)
    },

    async getProjectCategoryNames(onlyEnabled?: boolean): Promise<void> {
      this.projectCategoryNames = await projectService.getProjectCategoryNames(onlyEnabled)
    },

    async getProjectCommissionFunds(filter: ProjectCommissionFundFilter): Promise<void> {
      this.projectCommissionFunds = await projectService.getProjectCommissionFunds(filter)
    },

    async getProjectReview(): Promise<void> {
      this.projectReview = await projectService.getProjectReview(this.project?.id)
    },

    async getProjectPdf(): Promise<AxiosResponse<ArrayBuffer>> {
      return await projectService.getProjectPdf(this.project?.id)
    },

    async getProjectReviewPdf(): Promise<AxiosResponse<ArrayBuffer>> {
      return await projectService.getProjectReviewPdf(this.project?.id)
    },

    async patchProjectStatus(projectStatus: ProjectStatus): Promise<void> {
      this.project = await projectService.patchProjectStatus(
        this.project?.id,
        this.project?.projectStatus,
        projectStatus
      )
    },

    async patchProjectCommissionFund(original: number, updated: number): Promise<void> {
      await projectService.patchProjectCommissionFund(
        this.project?.id,
        original,
        updated
      )
    },

    async postponeProject(newCommissionId: number): Promise<void> {
      await projectService.postponeProject(this.project?.id, newCommissionId)
    },

    // old = getProjectDocuments
    async getProjectDocumentUploads(): Promise<void> {
      this.projectDocuments = await documentUploadService.getProjectDocumentUploads(this.project?.id)
    },

    // old = getProjectFiles
    async getProjectFileZip(): Promise<AxiosResponse<ArrayBuffer>> {
      return await documentUploadService.getProjectFileZip(this.project?.id)
    },
  }
})
