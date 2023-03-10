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
    user?: string,
    association: number | null,
    isPresident: boolean,
    canBePresident: boolean,
    isValidatedByAdmin: boolean,
    isVicePresident: boolean,
    isSecretary: boolean,
    isTreasurer: boolean,
}


export interface AssociationUserDetail {
    id: number | null,
    user: string,
    association: {
        id: number,
        name: string,
        isSite: boolean,
        institution: number,
        isEnabled: boolean,
        isPublic: boolean,
    }
    isPresident: boolean,
    canBePresident: boolean,
    isValidatedByAdmin: boolean,
    isVicePresident: boolean,
    isSecretary: boolean,
    isTreasurer: boolean,
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

/*export interface UserAssociationManagement {
    associationId: number | null,
    associationName: string,
    canBePresident: boolean,
    role: string,
    deleteAssociation: boolean
}*/

export interface UserAssociationPatch {
    isPresident?: boolean,
    canBePresident?: boolean,
    isVicePresident?: boolean,
    isSecretary?: boolean,
    isTreasurer?: boolean
}

// User group
export interface UserGroup {
    id?: number,
    userId: number,
    institutionId?: number,
    groupId: number
}

export interface UserGroupRegister {
    username: string,
    group: number,
    institution: number | null,
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

// User store
export interface UserStore {
    user: User | undefined,
    newUser: UserRegister | undefined,
    userAssociations: AssociationUser[]
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
