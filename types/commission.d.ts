import type {DateRange, PaginatedList} from '#/global'

export interface Fund {
  id: number;
  name: string;
  acronym: string;
  isSite: boolean;
  institution: number;
}

export interface CommissionFund {
  id: number;
  commission: number;
  fund: number;
}

export type CreateCommissionFund = Omit<CommissionFund, 'id'>;

export interface CommissionBase {
  submissionDate: string;
  commissionDate: string;
  editionDate: string;
  isOpenToProjects: boolean;
  name: string;
  isArchived: boolean;
  room: string;
  building: string;
  address: string;
  scheduledTime: string;
  funds: Fund[];
}

export interface Commission extends CommissionBase {
  id: number;
}

export interface ManagedCommission extends CommissionBase {
  id: number;
  standbyProjectsCount: number | null;
  processingProjectsCount: number | null;
  submittedProjectsCount: number | null;
  overdueReviewCount: number | null;
}

export type PostCommission = Pick<
  CommissionBase,
  'submissionDate' | 'commissionDate' | 'isOpenToProjects' | 'name'
>;

export interface CreateCommission extends PostCommission {
  funds: number[];
}

export interface UpdateCommission {
  id: number;
  oldName: string;
  newName: string;
  oldCommissionDate: string;
  newCommissionDate: string;
  oldSubmissionDate: string;
  newSubmissionDate: string;
  datesAreLegal: boolean;
  oldFunds: number[];
  newFunds: number[];
  oldIsOpenToProjects: boolean;
  newIsOpenToProjects: boolean;
  open: boolean;
}

interface SelectLabelFund {
  value: number;
  label: string;
  fund?: number;
}

export interface CommissionStore {
  commissions: PaginatedList<Commission | ManagedCommission>;
  commission: Commission | ManagedCommission | undefined;
  commissionFunds: CommissionFund[];
}

export interface CommissionFilters {
  funds: number[];
  isOpenToProjects: boolean;
  isSite: boolean;
  managedProjects: boolean;
  onlyWithActiveProjects: boolean;
  toPostponeProject: number;
  withActiveProjects: boolean;
  commissionDateAfter: string;
  commissionDateBefore: string;
  editionDateAfter: string;
  editionDateBefore: string;
  submissionDateAfter: string;
  submissionDateBefore: string;
  name: string;
  withClosedFutureCommissions: boolean;
  isArchived: boolean;
  page: number;
  pageSize: number;
}

export interface SearchCommissionFilters {
  name: string;
  commissionDate: DateRange;
  submissionDate: DateRange;
  editionDate: DateRange;
  funds: number[];
}
