import {defineStore} from 'pinia'
import type {ProjectCategory, ProjectStore} from '#/project'
import {useAxios} from '@/composables/useAxios'
import type {SelectLabel} from '#/index'


export const useProjectStore = defineStore('projectStore', {
    state: (): ProjectStore => ({
        project: undefined,
        projectCategories: []
    }),

    getters: {
        projectCategoriesLabels: (state: ProjectStore): SelectLabel[] => {
            return state.projectCategories.map(category => ({
                value: category.id,
                label: category.category
            }))
        }
    },
    actions: {
        async getProjectCategories() {
            const {axiosAuthenticated} = useAxios()
            this.projectCategories = (await axiosAuthenticated.get<ProjectCategory[]>('/projects/categories')).data
        }
    }
})
