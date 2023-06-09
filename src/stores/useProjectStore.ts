import {defineStore} from 'pinia'
import type {
    Project,
    ProjectCategory,
    ProjectCategoryName,
    ProjectCommissionFund,
    ProjectList,
    ProjectStore
} from '#/project'
import {useAxios} from '@/composables/useAxios'
import type {SelectLabel} from '#/index'
import type {DocumentUpload} from '#/documents'
import useCommissions from '@/composables/useCommissions'


export const useProjectStore = defineStore('projectStore', {
    state: (): ProjectStore => ({
        project: undefined,
        projects: [],
        projectCategories: [],
        projectCommissionFunds: [],
        projectDocuments: [],
        projectCategoryNames: [],
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
                .find(y => y.id === (commissionFunds.value
                    .find(x => x.id === (state.projectCommissionFunds[0].commissionFund))?.commission))?.id
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

        async getProjects(archived: boolean | undefined, commissions: number[]) {
            const {axiosAuthenticated} = useAxios()
            const unarchivedStatus = ['PROJECT_PROCESSING', 'PROJECT_VALIDATED', 'PROJECT_REVIEW_DRAFT', 'PROJECT_REVIEW_PROCESSING'].join(',')
            const archivedStatus = ['PROJECT_REJECTED', 'PROJECT_REVIEW_REJECTED', 'PROJECT_REVIEW_VALIDATED'].join(',')
            let urlString = '/projects/'
            const urlArray = []
            if (archived !== undefined) urlArray.push(`project_statuses=${archived ? archivedStatus : unarchivedStatus}`)
            if (commissions.length) urlArray.push(`commission_id=${commissions.join(',')}`)
            if (urlArray.length) urlString += '?' + urlArray.join('&')
            this.projects = (await axiosAuthenticated.get<ProjectList[]>(urlString)).data
        },

        async getAllProjects() {
            const {axiosAuthenticated} = useAxios()
            this.projects = (await axiosAuthenticated.get<ProjectList[]>('/projects/')).data
        },

        async getAssociationProjects(associationId: number) {
            const {axiosAuthenticated} = useAxios()
            this.projects = (await axiosAuthenticated.get<ProjectList[]>(`/projects/?association_id=${associationId}`)).data
        },

        async getProjectPdf(id: number) {
            const {axiosAuthenticated} = useAxios()
            const url = `/projects/${id}/export`
            return (await axiosAuthenticated.get<Blob>(url, {responseType: 'blob'})).data
        },
    }
})
