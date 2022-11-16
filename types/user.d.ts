/**
 *  User Model
 *  Interact front-back
 *  @params: id_person, username_person, password_person, email_person, firstname_person, lastname_person, cas_id_person,
 *  is_enabled_person, last_login_date_person, token_reset_date_person
 */

export interface User {
    id: number;
    password: string | null;
    last_login: string | null;
    is_superuser: boolean;
    username: string;
    first_name: string;
    last_name: string;
    phone: string | null;
    email: string;
    is_staff: boolean;
    is_active: boolean;
    date_joined: string;
    is_cas: string | null;
    status: 'admin' | 'user';
    // associations: UserAssociations | null;
}

// Login
export type UserLogin = Pick<User, "username" | "password">

interface LocalLogin {
    username: string;
    password: string;
}

interface CasLogin {
    ticket: string;
    service: string;
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
    id: number | null;
    has_office_status: boolean;
}

export type UserAssociations = UserAssociation[]

// User status
export interface UserGroup {
    id: number;
    name: string;
}

export type GroupList = { value: number, label: string }[]
