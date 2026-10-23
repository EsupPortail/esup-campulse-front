import type {PaginatedList} from '#/global'

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
  isOpenToProjects: boolean;
  name: string;
}

export interface Commission extends CommissionBase {
  id: number;
}

export type PostCommission = CommissionBase;

export interface CreateCommission extends CommissionBase {
  datesAreLegal: boolean;
  commission: number | null;
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
  commissions: PaginatedList<Commission>;
  commission: Commission | undefined;
  commissionFunds: CommissionFund[];
}

export interface CommissionFilters {
  funds?: number[];
  isOpenToProjects?: boolean;
  isSite?: boolean;
  managedProjects?: boolean;
  onlyWithActiveProjects?: boolean;
  toPostponeProject?: number;
  withActiveProjects?: boolean;
}

