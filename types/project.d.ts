import type {DocumentUpload} from '#/documents'
import type {Commission} from '#/commissions'

export interface Project {
    id: number,
    name: string,
    plannedStartDate: string,
    plannedEndDate: string,
    plannedLocation: string,
    user: number | null,
    association: number | null,
    associationUser: number | null,
    partnerAssociation: string,
    categories?: ProjectCategoryName[],
    budgetPreviousEdition: number,
    targetAudience: string,
    amountStudentsAudience: number,
    amountAllAudience: number,
    ticketPrice: number,
    studentTicketPrice: number,
    individualCost: number,
    goals: string,
    summary: string,
    plannedActivities: string,
    preventionSafety: string,
    marketingCampaign: string,
    sustainableDevelopment: string,
    projectStatus: ProjectStatus,
    creationDate: string,
    editionDate: string,
    processingDate?: string,
    manualIdentifier: string,
}

export interface ProjectList {
    id: number,
    name: string,
    association: number | null,
    user: number | null,
    associationUser: number | null,
    editionDate: string,
    plannedEndDate: string,
    plannedLocation: string,
    projectStatus: ProjectStatus,
    commission: Commission,
    manualIdentifier: string
}

type ProjectStatus =
    'PROJECT_DRAFT'
    | 'PROJECT_DRAFT_PROCESSED'
    | 'PROJECT_REJECTED'
    | 'PROJECT_PROCESSING'
    | 'PROJECT_VALIDATED'
    | 'PROJECT_REVIEW_DRAFT'
    | 'PROJECT_REVIEW_PROCESSING'
    | 'PROJECT_REVIEW_VALIDATED'
    | 'PROJECT_CANCELED'

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
    user: number | null,
    association: number | null,
    associationUser: number | null,
    partnerAssociation: string,
}

export interface ProjectBudget {
    budgetPreviousEdition: number | string,
    targetAudience: string,
    amountStudentsAudience: number | string,
    amountAllAudience: number | string,
    ticketPrice: number | string,
    studentTicketPrice: number | string,
    individualCost: number | string
}

export interface ProjectGoals {
    goals: string,
    summary: string,
    plannedActivities: string,
    preventionSafety: string,
    marketingCampaign: string,
    sustainableDevelopment: string
}

export interface ProjectCommissionFund {
    id?: number,
    project?: number,
    commissionFund: number,
    isFirstEdition?: boolean,
    amountAskedPreviousEdition?: number | string,
    amountEarnedPreviousEdition?: number | string,
    amountAsked?: number | string,
    amountEarned?: number | string | null,
    isValidatedByAdmin: boolean | null
}

export interface ProjectReview {
    id: number | null,
    name: string,
    user: number | null,
    association: number | null,
    outcome: number | string,
    income: number | string,
    realStartDate: string,
    realEndDate: string,
    realLocation: string,
    review: string,
    impactStudents: string,
    description: string,
    difficulties: string,
    improvements: string,
    plannedStartDate?: string,
    plannedEndDate?: string,
    plannedLocation?: string,
    associationUser: number | null,
    commissions?: Commission[],
    creationDate?: string,
    editionDate?: string,
    processingDate?: string
}

export interface ProjectComment {
    id: number,
    project: number,
    user: {
        id: number,
        firstName: string,
        lastName: string
    },
    text: string,
    creationDate: string,
    editionDate: string,
    isVisible: boolean
}

// STORE
export interface ProjectStore {
    project: Project | undefined,
    selfProjects: ProjectList[],
    managedProjects: ProjectList[],
    projectCategories: ProjectCategory[],
    projectCommissionFunds: ProjectCommissionFund[],
    projectDocuments: DocumentUpload[],
    projectCategoryNames: ProjectCategoryName[],
    projectReview: ProjectReview | undefined
}
