import {ref} from 'vue'
import type {ProjectBasicInfos} from '#/project'
import {useProjectStore} from '@/stores/useProjectStore'

const projectBasicInfos = ref<ProjectBasicInfos>(
    {
        name: '',
        plannedStartDate: '',
        plannedEndDate: '',
        location: '',
        user: null,
        association: null,
        categories: []
    }
)

export default function () {
    const projectStore = useProjectStore()

    const initProjectBasicInfos = () => {
        projectBasicInfos.value.name = projectStore.project?.name as string
        projectBasicInfos.value.plannedStartDate = projectStore.project?.plannedStartDate as string
        projectBasicInfos.value.plannedEndDate = projectStore.project?.plannedEndDate as string
        projectBasicInfos.value.location = projectStore.project?.location as string
        projectBasicInfos.value.user = projectStore.project?.user as number | null
        projectBasicInfos.value.association = projectStore.project?.association as number | null
        projectBasicInfos.value.categories = projectStore.project?.categories.map(category => category.id) as number[]
    }


    return {
        projectBasicInfos,
        initProjectBasicInfos
    }
}
