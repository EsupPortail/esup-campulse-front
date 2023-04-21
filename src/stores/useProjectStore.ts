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
import type {ProjectDocument} from '#/documents'


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

        async getProjectCommissionDates() {
            const {axiosAuthenticated} = useAxios()
            this.projectCommissionDates = (await axiosAuthenticated.get<ProjectCommissionDate[]>(`/projects/${this.project?.id}/commission_dates`)).data
        },

        async getProjectDocuments() {
            const {axiosAuthenticated} = useAxios()
            this.projectDocuments = (await axiosAuthenticated.get<ProjectDocument[]>(`/documents/uploads?project_id=${this.project?.id}`)).data
        },

        async getProjects() {
            const {axiosAuthenticated} = useAxios()
            this.projects = (await axiosAuthenticated.get<ProjectList[]>('/projects/')).data
        }
    }
})
