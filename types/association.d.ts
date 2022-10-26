// WIP : prototype based on current back
export interface Association {
    id_association: number;
    name_association: string;
    username_association: string;
    acronym_association: string | null;
    path_logo_association: string | null;
    description_association: string | null;
    activities_association: string | null;
    address_association: string | null;
    phone_association: string | null;
    email_association: string | null;
    siret_association: number | null;
    website_association: string | null;
    student_amount_association: number | null;
    is_enabled_association: boolean | null;
    created_date_association: string | null;
    approval_date_association: string | null;
    last_goa_date_association: string | null;
    cga_date_association: string | null;
    id_association_status: number;
    id_association_institution: number;
    id_association_component: number;
    id_association_field: number;
}

