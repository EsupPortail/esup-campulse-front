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
    id: number,
    institution: AssociationInstitution,
    institutionComponent: AssociationComponent,
    activityField: AssociationField,
    socialNetworks: AssociationSocialNetwork[],
    name: string,
    acronym: string | null,
    pathLogo: string | null,
    altLogo: string | null,
    description: string | null,
    activities: string | null,
    address: string | null,
    phone: string | null,
    email: string | null,
    siret: string | null,
    website: string | null,
    studentCount: number | null,
    presidentNames: string | null,
    isEnabled: boolean | null,
    createdDate: string | null,
    approvalDate: string | null,
    lastGoaDate: string | null,
    cgaDate: string | null,
}

export interface EditedAssociation {
    institution: number | null,
    institutionComponent: number | null,
    activityField: number | null,
    name: string,
    acronym: string | null,
    description: string | null,
    activities: string | null,
    address: string | null,
    phone: string | null,
    email: string | null,
    siret: string | null,
    website: string | null,
    presidentNames: string | null,
    approvalDate: string | null,
    lastGoaDate: string | null
}

export interface AssociationInstitution {
    id: number | null,
    name: string,
    acronym: string
}

export interface AssociationComponent {
    id: number | null,
    name: string
}

export interface AssociationField {
    id: number | null,
    name: string
}

export interface AssociationName {
    id: number,
    name: string
}

export interface AssociationSocialNetwork {
    type: string,
    location: string
}

export interface AssociationList {
    id: number,
    institution: {
        id: number,
        name: string,
        acronym: string
    },
    institutionComponent: {
        id: number,
        name: string
    },
    activityField: {
        id: number,
        name: string
    },
    name: string,
    acronym: string,
    isEnabled: boolean,
    isSite: boolean
}

export interface AssociationStore {
    association: Association | undefined,
    associations: AssociationList[],
    institutions: AssociationInstitution[],
    components: AssociationComponent[],
    fields: AssociationField[]
}

export type AssociationNames = { value: number, label: string }[]

export type AssociationDirectoryDetail = { id: number, name: string, acronym: string, institution: string, component: string, field: string }
export type AssociationDirectory = AssociationDirectoryDetail[]
export type CreateAssociation = Pick<Association, "name">
