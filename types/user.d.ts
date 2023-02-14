export interface User {
    id: number,
    username: string,
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    isCas: boolean,
    hasValidatedEmail: boolean
    isValidatedByAdmin: boolean,
    associations: UserAssociation[],
    groups: UserGroup[],
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
export type UserLogin = Pick<User, 'username' | 'password'>

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
interface AssociationUser {
    id: number,
    roleName: string,
    canBePresident: boolean,
    isPresident: boolean
}

export interface UserAssociation {
    id: number,
    name: string,
    isSite: boolean,
    institution: number
}

// User group
export interface UserGroup {
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

export interface UserAssociationStatus {
    associationId: number,
    roleName: string,
    hasOfficeStatus: boolean,
    isPresident: boolean
}

export interface UserAssociationManagement {
    associationId: number,
    associationName: string,
    roleName: string,
    hasOfficeStatus: boolean,
    isPresident: boolean,
    deleteAssociation: boolean
}

export type UserAssociationPatch = Pick<UserAssociationStatus, "roleName" | "hasOfficeStatus" | "isPresident">
