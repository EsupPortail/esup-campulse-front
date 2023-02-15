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

// User store
export interface UserStore {
    user: User | undefined,
    newUser: UserRegister | undefined,
    userAssociations: AssociationUser[]
}

// User manager store
export interface UserManagerStore {
    user: User | undefined,
    users: User[],
    userAssociations: AssociationUser[]
}

// Login
interface LocalLogin {
    username: string,
    password: string
}

interface CasLogin {
    ticket: string,
    service: string
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

// User association
export interface AssociationUser {
    id: number | null,
    isPresident: boolean,
    canBePresident: boolean,
    isValidatedByAdmin: boolean,
    isSecretary: boolean,
    isTreasurer: boolean,
}

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
    institutionId?: number,
    groupId: number
}

export interface UserGroupRegister {
    username: string,
    group: number,
    institution: number | null,
}

// Users

export interface UserToUpdate {
    firstName: string | undefined,
    lastName: string | undefined,
    email: string | undefined,
    phone: string | undefined
}

export interface UserAssociationManagement {
    associationId: number,
    associationName: string,
    isPresident: boolean,
    canBePresident: boolean,
    isSecretary: boolean,
    isTreasurer: boolean,
    deleteAssociation: boolean
}

export type UserAssociationPatch = Pick<AssociationUser, 'isPresident' | 'canBePresident' | 'isSecretary' | 'isTreasurer'>
