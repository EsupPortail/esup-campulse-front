import type {AssociationOptions} from '#/association'
import type {DocumentUpload} from '#/documents'

export interface User {
    id: number,
    username: string,
    email: string,
    address?: string,
    zipcode?: string,
    city?: string,
    country?: string,
    firstName: string,
    lastName: string,
    phone: string,
    isValidatedByAdmin: boolean,
    associations: UserAssociation[],
    groups: UserGroup[],
    isCas: boolean,
    hasValidatedEmail: boolean
    permissions: string[]
}

// STORES

// User's role in the association
export interface AssociationUser {
    id?: number,
    user?: number,
    association?: number | null,
    isPresident?: boolean,
    canBePresidentFrom?: string | null,
    canBePresidentTo?: string | null,
    isValidatedByAdmin?: boolean,
    isVicePresident?: boolean,
    isSecretary?: boolean,
    isTreasurer?: boolean,
}

export interface AssociationUserDetail {
    id?: number,
    user?: number | null,
    association: {
        id: number,
        name: string,
        isSite?: boolean,
        institution?: number,
        isEnabled?: boolean,
        isPublic?: boolean,
        canSubmitProjects?: boolean
    }
    isPresident: boolean,
    canBePresidentFrom: string | null,
    canBePresidentTo: string | null,
    isValidatedByAdmin: boolean,
    isVicePresident: boolean,
    isSecretary: boolean,
    isTreasurer: boolean
}

export interface AssociationMember {
    id: number,
    firstName?: string,
    lastName?: string,
    associationId?: number,
    associationName?: string,
    role: string,
    canBePresidentFrom?: string | null,
    canBePresidentTo?: string | null,
    isValidatedByAdmin: boolean
}

export interface AssociationRole {
    id: number | null,
    name?: string,
    role: string,
    options?: AssociationOptions[],
    canBePresidentFrom?: string | null,
    canBePresidentTo?: string | null,
    deleteAssociation?: boolean,
    isValidatedByAdmin?: boolean
}

interface CasLogin {
    ticket: string,
    service: string
}

// Login
interface LocalLogin {
    username: string,
    password: string
}

// Password reset
export interface PasswordReset {
    newPassword1: string | null,
    newPassword2: string | null
}

// Profile password edition
export interface PasswordEdit {
    oldPassword: string,
    newPassword1: string,
    newPassword2: string
}

// Association that the user belongs to
export interface UserAssociation {
    id: number,
    name: string,
    isSite: boolean,
    institution: number
}

// User group
export interface UserGroup {
    id?: number,
    userId: number,
    groupId: number
    institutionId?: number | null,
    fundId?: number | null
}

export interface UserGroupRegister {
    user: string,
    group: number | null,
    institution: number | null,
    fund: number | null
}

// User manager store
export interface UserManagerStore {
    user: User | undefined,
    users: User[],
    userAssociations: AssociationUserDetail[],
    userDocuments: DocumentUpload[]
}

// Register
export interface UserRegister {
    isCas: boolean,
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string
}

export interface CASUser {
    username: string,
    firstName: string,
    lastName: string,
    mail: string
}

// User store
export interface UserStore {
    user: User | undefined,
    newUser: UserRegister | undefined,
    userAssociations: AssociationUserDetail[],
    userDocuments: DocumentUpload[]
}

export interface UserToUpdate {
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    newEmail: string,
    newEmailVerification: string,
    phone: string,
    address?: string,
    zipcode?: string,
    city?: string,
    country?: string,
}

export type UserNames = { value: number, label: string }[]

export interface UserSearch {
    search: string,
    firstName: string,
    lastName: string,
    email: string,
    association: number | null
}