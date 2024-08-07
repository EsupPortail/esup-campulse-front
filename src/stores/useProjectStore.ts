import {defineStore} from 'pinia'
import type {
    Project,
    ProjectCategory,
    ProjectCategoryName,
    ProjectList,
    ProjectReview,
    ProjectCommissionFund,
    ProjectStatus,
    ProjectStore
} from '#/project'
import {useAxios} from '@/composables/useAxios'
import type {SelectLabel} from '#/index'
import type {DocumentUpload} from '#/documents'
import useCommissions from '@/composables/useCommissions'


export const useProjectStore = defineStore('projectStore', {
    state: (): ProjectStore => ({
        project: undefined,
        selfProjects: [],
        managedProjects: [],
        projectCategories: [],
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
        async getProjectCategoryNames() {
            if (!this.projectCategoryNames.length) {
                const {axiosPublic} = useAxios()
                this.projectCategoryNames = (await axiosPublic.get<ProjectCategoryName[]>('/projects/categories/names')).data
            }
        },

        async getProjectCategories() {
            const {axiosAuthenticated} = useAxios()
            this.projectCategories = (await axiosAuthenticated.get<ProjectCategory[]>(`/projects/${this.project?.id}/categories`)).data
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
            this.projectDocuments = (await axiosAuthenticated.get<DocumentUpload[]>(`/documents/uploads?project_id=${this.project?.id}`)).data
        },

        async getManagedProjects(commission: number | undefined) {
            const {axiosAuthenticated} = useAxios()
            const statuses = ['PROJECT_DRAFT_PROCESSED', 'PROJECT_PROCESSING', 'PROJECT_VALIDATED', 'PROJECT_REVIEW_DRAFT',
                'PROJECT_REVIEW_PROCESSING', 'PROJECT_REJECTED', 'PROJECT_CANCELED', 'PROJECT_REVIEW_VALIDATED'].join(',')
            let urlString = '/projects/'
            const urlArray = []
            urlArray.push(`project_statuses=${statuses}`)
            if (commission) urlArray.push(`commission_id=${commission}`)
            if (urlArray.length) urlString += '?' + urlArray.join('&')
            this.managedProjects = (await axiosAuthenticated.get<ProjectList[]>(urlString)).data
        },

        async getAllProjects() {
            const {axiosAuthenticated} = useAxios()
            this.selfProjects = (await axiosAuthenticated.get<ProjectList[]>('/projects/')).data
        },

        async getAssociationProjects(associationId: number) {
            const {axiosAuthenticated} = useAxios()
            this.selfProjects = (await axiosAuthenticated.get<ProjectList[]>(`/projects/?association_id=${associationId}`)).data
        },

        async getProjectReview(projectId: number) {
            const {axiosAuthenticated} = useAxios()
            this.projectReview = (await axiosAuthenticated.get<ProjectReview>(`/projects/${projectId}/review`)).data
        },

        async getProjectPdf(id: number) {
            const {axiosAuthenticated} = useAxios()
            const url = `/projects/${id}/pdf_export`
            return (await axiosAuthenticated.get<Blob>(url, {responseType: 'blob'})).data
        },

        async getProjectReviewPdf(id: number) {
            const {axiosAuthenticated} = useAxios()
            const url = `/projects/${id}/review/pdf_export`
            return (await axiosAuthenticated.get<Blob>(url, {responseType: 'blob'})).data
        },

        async getProjectFiles(id: number) {
            const {axiosAuthenticated} = useAxios()
            const url = `/documents/uploads/file?project_id=${id}`
            return (await axiosAuthenticated.get<Blob>(url, {responseType: 'blob'})).data
        },

        async patchProjectStatus(projectStatus: ProjectStatus) {
            const {axiosAuthenticated} = useAxios()
            if (this.project && this.project.projectStatus !== projectStatus) {
                await axiosAuthenticated.patch(`/projects/${this.project.id}/status`, {projectStatus})
                this.project.projectStatus = projectStatus
            }
        },

        async patchProjectCommissionFund(oldCommissionFund: number, newCommissionFund: number) {
            const {axiosAuthenticated} = useAxios()
            await axiosAuthenticated.patch(`/projects/${this.project?.id}/commission_funds/${oldCommissionFund}`,
                {projectId: this.project?.id, newCommissionFundId: newCommissionFund})
        },

        searchProjectByManualIdentifier(manualIdentifier: string) {
            this.managedProjects = this.managedProjects.filter(obj => obj.manualIdentifier === manualIdentifier)
        }
    }

})
