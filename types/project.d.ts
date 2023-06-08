import type {DocumentUpload} from '#/documents'
import type {User} from '#/user'

export interface Project {
    id: number,
    name: string,
    plannedStartDate: string,
    plannedEndDate: string,
    plannedLocation: string,
    contactFirstName: string | null,
    contactLastName: string | null,
    contactEmail: string | null,
    contactPhone: string | null,
    user: number | null,
    association: number | null,
    categories?: ProjectCategoryName[],
    commissionDates?: CommissionDate[],
    budgetPreviousEdition: number,
    targetAudience: string,
    amountStudentsAudience: number,
    amountAllAudience: number,
    ticketPrice: number,
    individualCost: number,
    goals: string,
    summary: string,
    plannedActivities: string,
    preventionSafety: string,
    marketingCampaign: string,
    projectStatus: ProjectStatus,
    projectComments?: ProjectComment[]
}

export interface ProjectList {
    id: number,
    name: string,
    association: number | null,
    user: number | null,
    editionDate: string,
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
    project: number,
    category: number
}

export interface ProjectCategoryName {
    id: number,
    name: string
}


export interface ProjectBasicInfos {
    name: string,
    plannedStartDate: string,
    plannedEndDate: string,
    plannedLocation: string,
    contactFirstName: string | null,
    contactLastName: string | null,
    contactEmail: string | null,
    user: number | null,
    association: number | null
}

export interface ProjectBudget {
    budgetPreviousEdition: number | string,
    targetAudience: string,
    amountStudentsAudience: number | string,
    amountAllAudience: number | string,
    ticketPrice: number | string,
    individualCost: number | string
}

export interface ProjectGoals {
    goals: string,
    summary: string,
    plannedActivities: string,
    preventionSafety: string,
    marketingCampaign: string,
}

export interface ProjectCommissionFund {
    id?: number,
    project?: number,
    commissionFund: number,
    isFirstEdition?: boolean,
    amountAskedPreviousEdition?: number | string,
    amountEarnedPreviousEdition?: number | string,
    amountAsked?: number | string,
    amountEarned?: number | string,
    isValidatedByAdmin: boolean
}

export interface ProjectComment {
    id: number,
    project: Project | undefined,
    user: User | undefined,
    text: string,
    creationDate: string,
}

// STORE
export interface ProjectStore {
    project: Project | undefined,
    projects: ProjectList[],
    projectCategories: ProjectCategory[],
    projectCommissionFunds: ProjectCommissionFund[],
    projectDocuments: DocumentUpload[],
    projectCategoryNames: ProjectCategoryName[],
}
