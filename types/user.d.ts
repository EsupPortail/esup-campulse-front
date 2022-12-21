import type {AssociationName} from "#/association";


export interface User {
    id: number,
    password: string | null,
    username: string,
    firstName: string,
    lastName: string,
    phone: string | null,
    email: string,
    isCas: boolean,
    isValidatedByAdmin: boolean | null,
    groups: UserGroup[],
    associations: AssociationName[],
}

// STORES

// User store
export interface UserStore {
    user: User | undefined,
    newUser: User | undefined
}

// User manager store
export interface UserManagerStore {
    user: ManagedUser | undefined,
    users: ManagedUsers,
    allUsers: boolean,
    userAssociations: UserAssociationDetail[]
}

// Login
export type UserLogin = Pick<User, "username" | "password">

interface LocalLogin {
    username: string,
    password: string
}

interface CasLogin {
    ticket: string,
    service: string
}

// Register
export type UserRegister = Pick<User, "username", "first_name" | "last_name" | "email" | "phone">

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
interface UserAssociation {
    id: number | null,
    hasOfficeStatus: boolean
}

export type UserAssociations = UserAssociation[]

export interface UserAssociationDetail {
    user: string,
    roleName: string,
    hasOfficeStatus: boolean,
    isPresident: boolean,
    association: {
        id: number,
        name: string
    }
}


// User group
export interface UserGroup {
    id: number,
    name: string
}

export type GroupList = { value: number, label: string }[]

// Users
export type ManagedUser = Omit<User, "password">
export type ManagedUsers = ManagedUser[]

export type UserNames = { value: number, label: string }[]

/*export type UserDirectoryDetail = { id: number, firstName: string, lastName: string, email: string, isValidatedByAdmin: boolean | null }
export type UserDirectory = UserDirectoryDetail[]*/

export type UserDirectory = Pick<User, "id", "firstName", "lastName", "email", "associations", "groups", "isValidatedByAdmin">
