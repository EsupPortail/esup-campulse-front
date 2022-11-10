// WIP : prototype based on current back

/**
 *  Association Model
 *  Interact front-back
 *  @params: id_association, name_association, username_association, acronym_association, path_logo_association,
 *  description_association, activities_association, address_association, phone_association, email_association,
 *  siret_association, website_association, student_amount_association, is_enabled_association, created_date_association,
 *  approval_date_association, last_goa_association, cga_date_association, id_association_status, id_association_institution
 *  id_association_component, id_association_field
 */
export interface Association {
    id: number;
    name: string;
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

export type AssociationName = Pick<Association, "name_association">
export type AssociationList = {value: number, label: string}[]