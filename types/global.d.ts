export interface BaseSelectLabel<TValue extends string | number = string | number> {
  value: TValue;
  label: string;
}

export type SelectLabel = BaseSelectLabel<string | number>;

export interface Error {
  status: number;
  data: {
    error: string;
  };
}

export interface PasswordChecker {
  valid: boolean;
  score: number;
}

export interface PageCard {
  to: { name: string };
  btnLabel?: string;
  icon: string;
  text?: string;
}

export interface Tab {
  label: string;
  slotName: string;
  icon?: string;
  permission?: string;
  disable?: boolean;
  hasUnsavedData?: boolean;
}

export interface PaginatedList<T> {
  count: number;
  totalPages: number;
  currentPage: number;
  range:
    { start: number; end: number };
  next: string | null;
  previous: string | null;
  results: T[];
}

export type TargetPage = 'first' | 'last' | 'previous' | 'next';

export type ProcessType = 'project' | 'review' | 'charter' | 'registration' | 'account-management' | 'user-management';
