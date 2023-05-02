import {defineStore} from 'pinia'
import type {
    Project,
    ProjectCategory,
    ProjectCategoryName,
    ProjectCommissionDate,
    ProjectList,
    ProjectStore
} from '#/project'
import {useAxios} from '@/composables/useAxios'
import type {SelectLabel} from '#/index'
import type {DocumentUpload} from '#/documents'


export const useProjectStore = defineStore('projectStore', {
    state: (): ProjectStore => ({
        project: undefined,
        projects: [],
        projectCategories: [],
        projectCommissionDates: [],
        projectDocuments: [],
        projectCategoryNames: []
    }),

    getters: {
        projectCategoriesLabels: (state: ProjectStore): SelectLabel[] => {
            return state.projectCategoryNames.map(category => ({
                value: category.id,
                label: category.name
            }))
        }
    },
    actions: {
        async getProjectCategoryNames() {
            const {axiosAuthenticated} = useAxios()
            if (!this.projectCategoryNames.length) {
                this.projectCategoryNames = (await axiosAuthenticated.get<ProjectCategoryName[]>('/projects/categories/names')).data
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

        async getProjectCommissionDates(asManager: boolean, commissionDate: number | undefined) {
            const {axiosAuthenticated} = useAxios()
            let url = ''
            if (asManager) {
                url = '/projects/commission_dates'
                if (commissionDate) url += `?commission_id=${commissionDate}`
            } else {
                url = `/projects/${this.project?.id}/commission_dates`
            }
            this.projectCommissionDates = (await axiosAuthenticated.get<ProjectCommissionDate[]>(url)).data
        },

        async getProjectDocuments() {
            const {axiosAuthenticated} = useAxios()
            this.projectDocuments = (await axiosAuthenticated.get<DocumentUpload[]>(`/documents/uploads?project_id=${this.project?.id}`)).data
        },

        async getProjects(archived: boolean, commissionDates: number[]) {
            const {axiosAuthenticated} = useAxios()
            const unarchivedStatus = ['PROJECT_PROCESSING', 'PROJECT_VALIDATED', 'PROJECT_REVIEW_DRAFT', 'PROJECT_REVIEW_PROCESSING']
            const archivedStatus = ['PROJECT_REJECTED', 'PROJECT_REVIEW_REJECTED', 'PROJECT_REVIEW_VALIDATED']
            const url = `/projects/?project_statuses=${archived ? archivedStatus.join(',') :
                unarchivedStatus.join(',')}&commission_dates=${commissionDates.join(',')}`
            this.projects = (await axiosAuthenticated.get<ProjectList[]>(url)).data
        },

        /*async getProjectsPerCommissionOrInstitutions(commission: number[], institutions: number[]) {
            const {axiosAuthenticated} = useAxios()
            if (commissionDates.length || institutions.length) {
                let urlString = '/projects/?'
                const urlArray = []
                if (commissionDates.length) urlArray.push(`commission_dates=${commissionDates.join(',')}`)
                if (institutions.length) urlArray.push(`institutions=${institutions.join(',')}`)
                urlString += urlArray.join('&')
                this.projects = (await axiosAuthenticated.get<ProjectList[]>(urlString)).data
            }
        }*/
    }
})
