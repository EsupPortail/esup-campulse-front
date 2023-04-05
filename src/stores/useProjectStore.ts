import {defineStore} from 'pinia'
import type {Project, ProjectCategoryName, ProjectStore} from '#/project'
import {useAxios} from '@/composables/useAxios'
import type {SelectLabel} from '#/index'


export const useProjectStore = defineStore('projectStore', {
    state: (): ProjectStore => ({
        project: undefined,
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
        async getProjectCategories() {
            const {axiosAuthenticated} = useAxios()
            if (!this.projectCategoryNames.length) {
                this.projectCategoryNames = (await axiosAuthenticated.get<ProjectCategoryName[]>('/projects/categories/names')).data
            }
        },

        async getProjectDetail(id: number) {
            const {axiosAuthenticated} = useAxios()
            this.project = (await axiosAuthenticated.get<Project>(`/projects/${id}`)).data
        }
    }
})
