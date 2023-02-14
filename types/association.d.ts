export interface Association {
    id: number,
    institution: AssociationInstitution,
    institutionComponent: AssociationComponent,
    activityField: AssociationField,
    pathLogo: object | null,
    name: string,
    acronym: string,
    altLogo: string,
    socialObject?: string,
    currentProject?: string,
    address?: string,
    phone?: string,
    email?: string,
    siret?: string,
    website?: string,
    studentCount?: number,
    presidentNames?: string,
    presidentPhone?: string,
    isSite: boolean,
    isEnabled: boolean,
    isPublic: boolean,
    creationDate?: string,
    approvalDate?: string,
    lastGoaDate?: string,
    cgaDate?: string,
    socialNetworks?: AssociationSocialNetwork[],
}

export interface EditedAssociation {
    institution: number | null | undefined,
    institutionComponent: number | null | undefined,
    activityField: number | null | undefined,
    name: string,
    acronym: string | null,
    socialObject: string | null,
    currentProject: string | null,
    address: string | null,
    phone: string | null,
    email: string | null,
    siret: string | null,
    website: string | null,
    presidentNames: string | null,
    phonePres: string | null,
    approvalDate: string | null,
    lastGoaDate: string | null
}

export interface NewAssociation {
    name: string,
    institution: number | undefined,
    isSite: boolean
}

export interface AssociationInstitution {
    id: number,
    name: string,
    acronym: string
}

export interface AssociationComponent {
    id: number,
    name: string
}

export interface AssociationField {
    id: number,
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

export interface AssociationSearch {
    search: string,
    name: string,
    acronym: string,
    institution: number | null,
    institutionComponent: number | null,
    activityField: number | null,
}

export interface AssociationStore {
    association: Association | undefined,
    associations: Association[],
    associationNames: AssociationName[]
    institutions: AssociationInstitution[],
    components: AssociationComponent[],
    fields: AssociationField[]
}

export interface AssociationName {
    id: number,
    name: string
}

export type AssociationDirectoryDetail = { id: number, name: string, acronym: string, institution: string, component: string, field: string }
export type AssociationDirectory = AssociationDirectoryDetail[]
export type CreateAssociation = Pick<Association, "name">
