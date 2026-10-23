import {defineStore} from 'pinia'
import type {ProjectCommissionFundFilter, ProjectStatus, ProjectStore} from '#/project'
import type {SelectLabel} from '#/global'
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
    // todo vérifier
    projectCommission: (state: ProjectStore): number | null => {
      return state.project?.commissions[0].id
    },
    // todo ajout de projectCommissionFunds dans project à faire en back
    projectFunds: (state: ProjectStore): number[] => {
      return []
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
      this.projectDocuments = await documentUploadService.getDocumentUploads({projectId: this.project!.id})
    },

    // old = getProjectFiles
    async getProjectFileZip(): Promise<AxiosResponse<ArrayBuffer>> {
      return await documentUploadService.getProjectFileZip(this.project?.id)
    },
  }
})
