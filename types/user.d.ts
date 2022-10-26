// WIP : prototype based on current back
export interface User {
    id_person: number;
    username_person: string;
    password_person: string | null;
    email_person: string;
    firstname_person: string;
    lastname_person: string;
    cas_id_person: string | null;
    is_enabled_person: boolean;
    last_login_date_person: string | null; // ??
    token_reset_date_person: string | null; // ??
    // roles: string[];
}

// export type UserAPIDetail = User
// export type UserAPIList = Omit<User, 'roles'>[]
