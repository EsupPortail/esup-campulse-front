export interface Project {
    name: string,
    plannedStartDate: string,
    plannedEndDate: string,
    location: string,
    user: number | null,
    association: number | null,
    categories: ProjectCategory[],
    firstEdition: ProjectFirstEdition[],
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
    projectId?: string,
    categoryId: string
}

interface ProjectFirstEdition {
    commissionDateId: string,
    isFirstEdition: boolean
}

export interface ProjectCategoryName {
    id: number,
    name: string
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

export interface ProjectBudget {
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
    budgetPreviousEdition: number | null,
    targetAudience: string,
    typeTargetAudience: string,
    amountTargetAudience: number | null,
    amountStudentsTargetAudience: number | null,
    ticketPrice: number | null,
    individualCost: number | null
}

export interface ProjectCommissionDate {
    id: number,
    project: string,
    commissionDate: string,
    isFirstEdition: boolean,
    amountAskedPreviousEdition: number | null,
    amountEarnedPreviousEdition: number | null,
    amountAsked: number | null,
    amountEarned: number | null
}

// STORE
export interface ProjectStore {
    project: Project | undefined,
    projectCategoryNames: ProjectCategoryName[]
}