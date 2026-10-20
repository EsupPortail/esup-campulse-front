import type {SelectLabel} from '#/global'

export type GroupName =
  'MANAGER_GENERAL'
  | 'MANAGER_INSTITUTION'
  | 'MANAGER_MISC'
  | 'MEMBER_FUND'
  | 'STUDENT_INSTITUTION'
  | 'STUDENT_MISC'

export interface Group {
  id: number;
  name: GroupName;
  permissions: string[];
  isPublic: boolean;
}

export interface GroupCodeLiteralName {
  codeName: GroupName;
  literalName: string;
}

export interface SelectLabelGroup extends SelectLabel {
  disable?: boolean;
  fund?: number;
}

export interface GroupStore {
  groups: Group[];
}
