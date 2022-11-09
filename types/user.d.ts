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

export type UserLogin = Pick<User, "username" | "password">
export type UserRegister = Pick<User, "first_name" | "last_name" | "email" | "phone">

interface LoginLocale {
    username: string;
    password: string;
}

interface CasLogin {
    ticket: string;
    service: string
}

interface UserAssociation {
    name: string;
    has_office_status: boolean;
}

export type UserAssociations = UserAssociation[]