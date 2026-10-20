import type {BaseSelectLabel} from '#/global'

export interface Fund {
  id: number;
  name: string;
  acronym: string;
  isSite: boolean;
  institution: number;
}

export interface SelectLabelFund extends BaseSelectLabel<number> {
  fund?: number;
}

export interface FundStore {
  funds: Fund[];
}