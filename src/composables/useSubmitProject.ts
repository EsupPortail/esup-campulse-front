import {ref} from 'vue'
import type {ProjectBasicInfos, ProjectBudget, ProjectCommissionDate} from '#/project'
import {useProjectStore} from '@/stores/useProjectStore'
import useUtility from '@/composables/useUtility'
import {useAxios} from '@/composables/useAxios'

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

const projectBudget = ref<ProjectBudget>(
    {
        firstEdition: {
            'additionalProp1': 'string',
            'additionalProp2': 'string',
            'additionalProp3': 'string'
        },
        amountsPreviousEdition: {
            'additionalProp1': 'string',
            'additionalProp2': 'string',
            'additionalProp3': 'string'
        },
        budgetPreviousEdition: null,
        targetAudience: '',
        typeTargetAudience: '',
        amountTargetAudience: null,
        amountStudentsTargetAudience: null,
        ticketPrice: null,
        individualCost: null
    }
)

const projectCommissions = ref<ProjectCommissionDate[]>([])


export default function () {
    const projectStore = useProjectStore()

    const initProjectBasicInfos = () => {
        const {formatDate} = useUtility()
        projectBasicInfos.value.name = projectStore.project?.name as string
        projectBasicInfos.value.plannedStartDate = formatDate(projectStore.project?.plannedStartDate as string) as string
        projectBasicInfos.value.plannedEndDate = formatDate(projectStore.project?.plannedEndDate as string) as string
        projectBasicInfos.value.location = projectStore.project?.location as string
        projectBasicInfos.value.user = projectStore.project?.user as number | null
        projectBasicInfos.value.association = projectStore.project?.association as number | null
        projectBasicInfos.value.categories = projectStore.project?.categories.map(category => category.id) as number[]
    }

    async function postNewProject() {
        const {axiosAuthenticated} = useAxios()
        const dataToPost = JSON.parse(JSON.stringify(projectBasicInfos.value))
        dataToPost.plannedStartDate += 'T00:00:00.000Z'
        dataToPost.plannedEndDate += 'T00:00:00.000Z'
        await axiosAuthenticated.post('/projects/', dataToPost)
    }


    return {
        projectBasicInfos,
        projectBudget,
        projectCommissions,
        initProjectBasicInfos,
        postNewProject
    }
}
