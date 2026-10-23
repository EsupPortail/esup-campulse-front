import type {UserAssociation, UserBase} from '#/user'
import type {DocumentUpload} from '#/document'
import type {AssociationCharterStatus} from '#/charter'
import type {Institution, InstitutionComponent} from '#/institution'

export interface AssociationActivityField {
  id: number;
  name: string;
}

export interface AssociationLogoFormats {
  base?: string;
  detail?: string;
  list?: string;
}

export interface AssociationSocialNetwork {
  type: string;
  location: string;
}

export interface AssociationBase {
  id: number;
  institution: Institution;
  institutionComponent: InstitutionComponent;
  activityField: AssociationActivityField;
  pathLogo: AssociationLogoFormats | null;
  calculatedExpirationDate: string;
  name: string;
  email: string;
  acronym: string;
  isEnabled: boolean;
  isPublic: boolean;
  isSite: boolean;
  charterStatus: AssociationCharterStatus;
  charterDate: string;
}

export interface Association extends AssociationBase {
  socialObject: string;
  currentProjects: string;
  address: string;
  zipcode: string;
  city: string;
  country: string;
  phone: string;
  siret: string;
  website: string;
  studentCount: number;
  presidentNames: string;
  presidentPhone: string;
  presidentEmail: string;
  amountMembersAllowed: number;
  canSubmitProjects: boolean;
  creationDate: string;
  approvalDate: string;
  lastGoaDate: string;
  cgaDate: string;
  socialNetworks: AssociationSocialNetwork[];
}

export type AssociationListItem = AssociationBase

export type UpdateAssociationBase = Pick<Association,
  'name' | 'acronym' | 'socialObject' | 'currentProjects' | 'address' | 'zipcode' | 'city' | 'country' | 'phone' |
  'email' | 'siret' | 'website' | 'studentCount' | 'presidentNames' | 'presidentPhone' | 'presidentEmail' | 'isPublic' |
  'approvalDate' | 'lastGoaDate' | 'amountMembersAllowed'> &
  {
    institution: AssociationBase['institution']['id'];
    institutionComponent: AssociationBase['institutionComponent']['id'];
    activityField: AssociationBase['activityField']['id'];
  };

// old = EditedAssociation
export type UpdateAssociation = Partial<UpdateAssociationBase>;

// old = NewAssociation
export type CreateAssociation =
  Pick<UpdateAssociationBase, 'name' | 'acronym' | 'email' | 'isPublic' | 'institution'>
  & {
  isSite: Association['isSite'];
}

export type AssociationName = Pick<Association, 'id' | 'name'> & {
  hasPresident: boolean;
  institution: Association['institution']['id'];
}

export interface AssociationOptions {
  label: string;
  value: string;
  isInOffice?: boolean;
  disable?: boolean;
}

// old = AssociationSearch
export type SearchAssociation = Pick<Association, 'name' | 'acronym'> &
  {
    search: string;
    institution: Association['institution']['id'] | null;
    institutionComponent: Association['institutionComponent']['id'] | null;
    activityField: Association['activityField']['id'] | null;
  }

export interface AssociationUser {
  id: number;
  user: UserBase;
  association: UserAssociation;
  isPresident: boolean;
  canBePresidentFrom: string;
  canBePresidentTo: string;
  isValidatedByAdmin: boolean;
  isVicePresident: boolean;
  isSecretary: boolean;
  isTreasurer: boolean
}

export type CreateAssociationUser = Pick<AssociationUser, 'isPresident' | 'isSecretary' | 'isTreasurer' |
  'isVicePresident'> & {
  association: Association['id'];
  user: AssociationUser['id'];
};

export type RegisterAssociationUser = Omit<CreateAssociationUser, 'user'>;

// todo
export interface AssociationMember {
  id: number;
  firstName?: string;
  lastName?: string;
  associationId?: number;
  associationName?: string;
  role: string;
  canBePresidentFrom?: string | null;
  canBePresidentTo?: string | null;
  isValidatedByAdmin: boolean
}

// todo
export interface AssociationRole {
  id: number | null;
  name?: string;
  role: string;
  options?: AssociationOptions[];
  canBePresidentFrom?: string | null;
  canBePresidentTo?: string | null;
  deleteAssociation?: boolean;
  isValidatedByAdmin?: boolean;
}

export interface AssociationStore {
  association: Association | undefined;
  associations: Association[];
  associationNames: AssociationName[];
  activityFields: AssociationActivityField[];
  associationUsers: AssociationUser[];
  associationDocuments: DocumentUpload[];
}

export interface AssociationFilters {
  isPublic?: boolean;
  institutions?: number[];
}

export interface AssociationNameFilters {
  isPublic?: boolean;
  allowNewUsers?: boolean;
  isEnabled?: boolean;
  institutions?: number[];
}
