// WIP : prototype based on current back

/**
 *  Association Model
 *  Interact front-back
 *  @params: id, name, username, acronym, path_logo,
 *  description, activities, address, phone, email,
 *  siret, website, student_amount, is_enabled, created_date,
 *  approval_date, last_goa, cga_date, id_status, id_institution
 *  id_component, id_field
 */
export interface Association {
    id: number;
    name: string;
    username: string;
    acronym: string | null;
    path_logo: string | null;
    description: string | null;
    activities: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    siret: number | null;
    website: string | null;
    student_amount: number | null;
    is_enabled: boolean | null;
    created_date: string | null;
    approval_date: string | null;
    last_goa_date: string | null;
    cga_date: string | null;
    id_status: number;
    id_institution: number;
    id_component: number;
    id_field: number;
}

interface AssociationStore {
    association: Association | undefined,
    associations: Association[]
}

export type AssociationList = {value: number, label: string}[]
