export interface Project {
    id: number,
    name: string,
    plannedStartDate: string,
    plannedEndDate: string,
    location: string,
    user: number | null,
    association: number | null,
    categories: ProjectCategoryName[],
    commissionDates: CommissionDate[],
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
    location: string,
    user: number | null,
    association: number | null
}

export interface ProjectBudget {
    budgetPreviousEdition: number | null,
    targetAudience: string,
    typeTargetAudience: string,
    amountTargetAudience: number | null,
    amountStudentsTargetAudience: number | null,
    ticketPrice: number | null,
    individualCost: number | null
}

export interface ProjectGoals {
    goals: string,
    summary: string,
    plannedActivities: string,
    preventionSafety: string,
    marketingCampaign: string,
}

export interface ProjectAmount {
    commissionId: number,
    commissionDate: number,
    amountAskedPreviousEdition: number | null,
    amountEarnedPreviousEdition: number | null,
    amountAsked?: number | null,
    amountEarned?: number | null
}

export interface ProjectCommissionDate {
    id?: number,
    project: number,
    commissionDate: number,
    isFirstEdition?: boolean,
    amountAskedPreviousEdition?: number | null,
    amountEarnedPreviousEdition?: number | null,
    amountAsked?: number | null,
    amountEarned?: number | null
}

// STORE
export interface ProjectStore {
    project: Project | undefined,
    projectCategoryNames: ProjectCategoryName[]
}