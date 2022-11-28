/**
 *  User Model
 *  Interact front-back
 *  @params: // TODO
 */

export interface User {
    id: number,
    password: string | null,
    // lastLogin: string | null,
    // isSuperuser: boolean,
    username: string,
    firstName: string,
    lastName: string,
    phone: string | null,
    email: string,
    // isStaff: boolean,
    // isActive: boolean,
    // dateJoined: string,
    isCas: boolean,
    // associations: UserAssociations | null,
    isValidatedByAdmin: boolean | null,
    groups: UserGroup[],
}

// User store
export interface UserStore {
    user: User | undefined,
    newUser: NewUser | undefined,
    isCAS: boolean,
    groups: UserGroup[]
}

// newUser
export type NewUser = Pick<User, "username", "first_name", "last_name", "email", "phone">

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

// User status
export interface UserGroup {
    id: number,
    name: string
}

export type GroupList = { value: number, label: string }[]

