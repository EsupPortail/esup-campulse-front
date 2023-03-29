import type {AssociationOptions} from "#/association";

export interface User {
    id: number,
    username: string,
    email: string,
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
    isPresident: boolean,
    canBePresident: boolean,
    canBePresidentFrom: string | null,
    canBePresidentTo: string | null,
    isValidatedByAdmin: boolean,
    isVicePresident: boolean,
    isSecretary: boolean,
    isTreasurer: boolean,
}

export interface AssociationUserDetail {
    id?: number | null,
    user?: number | null,
    association: {
        id: number,
        name: string,
        isSite?: boolean,
        institution?: number,
        isEnabled?: boolean,
        isPublic?: boolean,
    }
    isPresident: boolean,
    canBePresident: boolean,
    canBePresidentFrom: string | null,
    canBePresidentTo: string | null,
    isValidatedByAdmin: boolean,
    isVicePresident: boolean,
    isSecretary: boolean,
    isTreasurer: boolean,
}

export interface AssociationMember {
    id: number,
    firstName?: string,
    lastName?: string,
    associationId?: number,
    associationName?: string,
    role: string,
    canBePresident?: boolean,
    canBePresidentFrom?: string | null,
    canBePresidentTo?: string | null,
    isValidatedByAdmin: boolean
}

export interface AssociationRole {
    id: number | null,
    name?: string,
    role: string,
    options?: AssociationOptions[]
    canBePresident?: boolean,
    deleteAssociation?: boolean,
    isValidatedByAdmin?: boolean,
    isVicePresident?: boolean
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
    newPassword1: string,
    newPassword2: string
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

export interface UserAssociationPatch {
    isPresident?: boolean,
    canBePresident?: boolean,
    isVicePresident?: boolean,
    isSecretary?: boolean,
    isTreasurer?: boolean
    isValidatedByAdmin?: boolean
}

// User group
export interface UserGroup {
    id?: number,
    userId: number,
    groupId: number
    institutionId?: number | null,
    commissionId?: number | null
}

export interface UserGroupRegister {
    username: string,
    group: number,
    institution: number | null,
    commission: number | null
}

// User manager store
export interface UserManagerStore {
    user: User | undefined,
    users: User[],
    userAssociations: AssociationUserDetail[]
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
    userAssociations: AssociationUserDetail[]
}

export interface UserToUpdate {
    firstName: string | undefined,
    lastName: string | undefined,
    username: string | undefined,
    email: string | undefined,
    newEmail: string,
    newEmailVerification: string,
    phone: string | undefined
}

export type UserNames = { value: number, label: string }[]
