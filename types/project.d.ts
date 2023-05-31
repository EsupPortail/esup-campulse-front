import type {DocumentUpload} from '#/documents'

export interface Project {
    id: number,
    name: string,
    plannedStartDate: string,
    plannedEndDate: string,
    plannedLocation: string,
    otherFirstName: string | null,
    otherLastName: string | null,
    otherEmail: string | null,
    otherPhone: string | null,
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
    projectStatus: ProjectStatus
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

interface CommissionDate {
    id: number,
    submissionDate: string,
    commissionDate: string,
    commission: number
}

export interface ProjectBasicInfos {
    name: string,
    plannedStartDate: string,
    plannedEndDate: string,
    plannedLocation: string,
    otherFirstName: string | null,
    otherLastName: string | null,
    otherEmail: string | null,
    otherPhone: string | null,
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

export interface ProjectCommissionDate {
    id?: number,
    project?: number,
    commissionDate: number,
    isFirstEdition?: boolean,
    amountAskedPreviousEdition?: number | string,
    amountEarnedPreviousEdition?: number | string,
    amountAsked?: number | string,
    amountEarned?: number | string
}

export interface ProjectReview {
    id: number | null,
    name: string,
    otherFirstName: string,
    otherLastName: string,
    otherEmail: string,
    otherPhone: string,
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
    improvements: string
}

export interface ProjectAssociation {
    address: string,
    zipcode: string,
    city: string,
    country: string,
    phone: string,
    email: string,
    presidentNames: string,
    presidentPhone: string,
    presidentEmail: string,
    name: string
}

// STORE
export interface ProjectStore {
    project: Project | undefined,
    projects: ProjectList[],
    projectCategories: ProjectCategory[],
    projectCommissionDates: ProjectCommissionDate[],
    projectDocuments: DocumentUpload[],
    projectCategoryNames: ProjectCategoryName[],
    projectReview: ProjectReview | undefined
}
