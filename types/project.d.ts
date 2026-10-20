import type {DocumentUpload} from '#/document'
import type {Commission} from '#/commission'
import type {UserBase} from '#/user'
import type {PaginatedList} from '#/global'
import type {AssociationUser, AssociationUserAssociation} from '#/association'

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

export interface ProjectCategoryName {
  id: number;
  name: string;
}

export interface ProjectBase {
  id: number;
  name: string;
  manualIdentifier: string;
  association: AssociationUserAssociation | null;
  user: UserBase | null;
  associationUser: AssociationUser | null;
  plannedStartDate: string;
  plannedEndDate: string;
  editionDate: string;
  projectStatus: ProjectStatus;
  budgetFile: string;
}

export interface ProjectListItem extends ProjectBase {
  commission: Commission | null;
}

export interface Project extends ProjectBase {
  plannedLocation: string;
  partnerAssociation: string;
  categories: ProjectCategoryName[];
  commissions: Commission[];
  budgetPreviousEdition: number;
  targetAudience: string;
  amountStudentsAudience: number;
  amountAllAudience: number;
  ticketPrice: number;
  studentTicketPrice: number;
  individualCost: number;
  goals: string;
  summary: string;
  plannedActivities: string;
  preventionSafety: string;
  marketingCampaign: string;
  sustainableDevelopment: string;
  creationDate: string;
  processingDate: string;
}

// old = ProjectBasicInfos
export type ProjectInfos = Pick<Project, 'name' | 'plannedStartDate' | 'plannedEndDate' | 'plannedLocation' |
  'partnerAssociation'> & {
  user: Project['user']['id'] | null;
  association: Project['association']['id'] | null;
  associationUser: Project['associationUser']['id'] | null;
}

export type ProjectBudget = Pick<Project, 'budgetPreviousEdition' | 'targetAudience' | 'amountStudentsAudience' |
  'amountAllAudience' | 'ticketPrice' | 'studentTicketPrice' | 'individualCost'>

export type ProjectGoals = Pick<Project, 'goals' | 'summary' | 'plannedActivities' | 'preventionSafety' |
  'marketingCampaign' | 'sustainableDevelopment'>

export interface ProjectCommissionFund {
  id: number;
  project: number;
  commissionFund: number;
  isFirstEdition: boolean;
  amountAskedPreviousEdition: number;
  amountEarnedPreviousEdition: number;
  amountAsked: number;
  amountEarned: number;
  isValidatedByAdmin: boolean;
}

export interface ProjectReview {
  id: number;
  name: string;
  user: number | null;
  association: number | null;
  associationUser: number | null;
  outcome: number;
  income: number;
  realStartDate: string;
  realEndDate: string;
  realLocation: string;
  review: string;
  impactStudents: string;
  description: string;
  difficulties: string;
  improvements: string;
  plannedStartDate: string;
  plannedEndDate: string;
  plannedLocation: string;
  commissions: Commission[];
  creationDate: string;
  editionDate: string;
  processingDate: string;
}

export interface ProjectComment {
  id: number;
  project: number;
  user: UserBase;
  text: string;
  creationDate: string;
  editionDate: string;
  isVisible: boolean;
}

export interface ProjectStore {
  project: Project | undefined;
  projects: PaginatedList<ProjectListItem> | undefined;
  projectCommissionFunds: ProjectCommissionFund[];
  projectDocuments: DocumentUpload[];
  projectCategoryNames: ProjectCategoryName[];
  projectReview: ProjectReview | undefined;
}

// REFACTO

interface ProjectCommissionFundFilterAll {
  filter: 'all';
}

interface ProjectCommissionFundFilterCommission {
  filter: 'commission';
  commissionId: number;
}

interface ProjectCommissionFundFilterProject {
  filter: 'project';
  projectId: number;
}

export type ProjectCommissionFundFilter =
  ProjectCommissionFundFilterAll
  | ProjectCommissionFundFilterCommission
  | ProjectCommissionFundFilterProject
