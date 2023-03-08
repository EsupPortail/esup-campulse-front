export interface Association {
    id: number,
    name: string,
    acronym: string,
    pathLogo: AssociationLogo | null,
    altLogo: string,
    socialObject?: string,
    currentProjects?: string,
    address?: string,
    phone?: string,
    email?: string,
    siret?: string,
    website?: string,
    studentCount?: number,
    presidentNames?: string,
    presidentPhone?: string,
    isEnabled: boolean,
    isPublic: boolean,
    isSite: boolean,
    creationDate?: string,
    approvalDate?: string,
    lastGoaDate?: string,
    cgaDate?: string,
    socialNetworks?: AssociationSocialNetwork[],
    institution: Institution,
    institutionComponent: InstitutionComponent,
    activityField: AssociationActivityField,
    canSubmitProjects: boolean,
    charterStatus: string
}

export interface AssociationLogo {
    base: string | undefined
    detail: string | undefined
    list: string | undefined
}

export interface Institution {
    id: number,
    name: string,
    acronym: string,
    email: string,
}

export interface InstitutionComponent {
    id: number,
    name: string,
    institution: Institution,
}

export interface AssociationActivityField {
    id: number,
    name: string
}

export interface AssociationName {
    id: number,
    name: string,
    hasPresident: boolean,
    institution: number,
}

export interface AssociationOptions {
    label: string,
    value: string,
    disable?: boolean
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
    institutions: Institution[],
    institutionComponents: InstitutionComponent[],
    activityFields: AssociationActivityField[]
}

export type AssociationDirectory = AssociationDirectoryDetail[]
export type AssociationDirectoryDetail = { id: number, name: string, acronym: string, institution: string, institutionComponent: string, activityField: string }

export type CreateAssociation = Pick<Association, "name">

export interface EditedAssociation {
    name: string,
    acronym?: string | null,
    socialObject?: string | null,
    currentProjects?: string | null,
    address?: string | null,
    phone?: string | null,
    email?: string | null,
    siret?: string | null,
    website?: string | null,
    studentCount?: number | null,
    presidentNames?: string | null,
    presidentPhone?: string | null,
    isPublic?: boolean,
    approvalDate?: string | null,
    lastGoaDate?: string | null,
    institution?: number | null | undefined,
    institutionComponent?: number | null | undefined,
    activityField?: number | null | undefined,
    altLogo?: string
}

export interface NewAssociation {
    name: string,
    isSite: boolean,
    institution: number | undefined,
}
