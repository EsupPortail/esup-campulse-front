import type {Association, AssociationUser, RegisterAssociationUser} from '#/association'
import type {DocumentUpload} from '#/document'
import type {Group} from '#/group'
import type {Fund} from '#/fund'
import type {Institution} from '#/institution'

export interface UserBase {
  id: number;
  firstName: string;
  lastName: string;
}

export type UserAssociation = Pick<Association, 'id' | 'name' | 'acronym' | 'email' | 'isEnabled' | 'isPublic' |
  'isSite' | 'canSubmitProjects' | 'charterStatus'> & { institution: Association['institution']['id']; }

export interface User extends UserBase {
  username: string;
  email: string;
  address: string;
  zipcode: string;
  city: string;
  country: string;
  phone: string;
  isValidatedByAdmin: boolean;
  isCas: boolean;
  hasValidatedEmail: boolean;
  isStudent: boolean;
  canSubmitProjects: boolean;
  associations: UserAssociation[];
  groups: UserGroup[];
  permissions: string[];
}

export interface LDAPUser {
  username: User['username'];
  firstName: User['firstName'];
  lastName: User['lastName'];
  mail: User['email'];
}

interface CasLogin {
  ticket: string;
  service: string;
}

interface LocalLogin {
  username: User['username'];
  password: string;
}

export interface LoginResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface PasswordReset {
  newPassword1: string;
  newPassword2: string;
}

export interface PasswordEdit extends PasswordReset {
  oldPassword: string;
}

// old = UserRegister
export type RegisterUserBase = Pick<User, 'isCas' | 'username' | 'firstName' | 'lastName' | 'email' | 'phone'>;

export interface RegisterUser extends RegisterUserBase {
  gifus: CreateUserGroup[];
  associations: RegisterAssociationUser[];
}

export type RegisterLocalUserPayload = Omit<RegisterUser, 'isCas' | 'username'>

export type RegisterCASUserPayload = Pick<RegisterUser, 'phone' | 'gifus' | 'associations'>

// old = UserToUpdate
export type UpdateUser = Pick<User, 'firstName' | 'lastName' | 'username' | 'email' | 'phone' | 'address' |
  'zipcode' | 'city' | 'country'> & {
  newEmail: User['email'];
  newEmailVerification: User['email'];
}

// old = UserSearch
export type SearchUser = Pick<User, 'firstName' | 'lastName' | 'email'> & {
  search: string;
  association: number | null;
}

export interface UserGroup {
  id: number;
  userId: User['id'];
  groupId: Group['id'];
  institutionId: Institution['id'] | null;
  fundId: Fund['id'] | null;
}

export interface CreateUserGroup {
  group: UserGroup['groupId'];
  institution: UserGroup['institutionId'];
  fund: UserGroup['fundId'];
}

export interface UpdateUserGroup extends CreateUserGroup {
  user: UserGroup['userId'];
}

export interface ProfileStore {
  user: User | undefined;
  newUser: RegisterUserBase | undefined;
  userAssociations: AssociationUser[];
  userDocuments: DocumentUpload[];
}

export interface UserStore {
  user: User | undefined;
  users: User[];
  userAssociations: AssociationUser[];
  userDocuments: DocumentUpload[];
}

export interface UserFilters {
  search?: string;
  status: 'validated' | 'unvalidated';
}

export interface PasswordResetConfirmPayload {
  uid: string;
  token: string;
  newPassword1: string;
  newPassword2: string;
}