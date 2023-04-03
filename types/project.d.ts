export interface Project {
    name: string,
    plannedStartDate: string,
    plannedEndDate: string,
    location: string,
    user: number,
    association: number,
    categories: ProjectCategory[],
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
    budgetPreviousEdition: number,
    targetAudience: string,
    typeTargetAudience: string,
    amountTargetAudience: number,
    amountStudentsTargetAudience: number,
    ticketPrice: number,
    individualCost: number,
    goals: string,
    summary: string,
    plannedActivities: string,
    preventionSafety: string,
    marketingCampaign: string,
    projectStatus: ProjectStatus
}

type ProjectStatus =
    'PROJECT_DRAFT'
    | 'PROJECT_REJECTED'
    | 'PROJECT_PROCESSING'
    | 'PROJECT_VALIDATED'
    | 'PROJECT_REVIEW_DRAFT'
    | 'PROJECT_REVIEW_REJECTED'
    | 'PROJECT_REVIEW_PROCESSING'
    | 'PROJECT_REVIEW_VALIDATED'

interface ProjectCategory {
    id: number,
    project: string,
    category: string
}

export interface ProjectBasicInfos {
    name: string,
    plannedStartDate: string,
    plannedEndDate: string,
    location: string,
    user: number | null,
    association: number | null,
    categories: number[]
}

// STORE
export interface ProjectStore {
    project: Project | undefined,
    projectCategories: ProjectCategory[]
}