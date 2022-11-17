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
    pathLogo: string | null;
    description: string | null;
    activities: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    siret: number | null;
    website: string | null;
    studentAmount: number | null;
    isEnabled: boolean | null;
    createdDate: string | null;
    approvalDate: string | null;
    lastGoaDate: string | null;
    cgaDate: string | null;
    idStatus: number;
    idInstitution: number;
    idComponent: number;
    idField: number;
}

interface AssociationStore {
    association: Association | undefined,
    associations: Association[]
}

export type AssociationList = { value: number, label: string }[]
