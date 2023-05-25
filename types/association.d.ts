import type {AssociationUser} from '#/user'

export interface Association {
    id: number,
    name: string,
    acronym: string,
    pathLogo: AssociationLogo | null,
    altLogo: string,
    socialObject?: string,
    currentProjects?: string,
    address?: string,
    zipcode?: string,
    city?: string,
    country?: string,
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
    institution?: number,
    institutionComponent?: number,
    activityField?: number,
    canSubmitProjects: boolean,
    charterStatus: string
    amountMembersAllowed: number
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
    activityFields: AssociationActivityField[],
    associationUsers: AssociationUser[]
}

export type CreateAssociation = Pick<Association, 'name'>

export interface EditedAssociation {
    name: string,
    acronym?: string | null,
    socialObject?: string | null,
    currentProjects?: string | null,
    address?: string | null,
    zipcode?: string | null,
    city?: string | null,
    country?: string | null,
    phone?: string | null,
    email?: string | null,
    siret?: string | null,
    website?: string | null,
    studentCount?: string,
    presidentNames?: string | null,
    presidentPhone?: string | null,
    isPublic?: boolean,
    approvalDate?: string | null,
    lastGoaDate?: string | null,
    institution?: number | null | undefined,
    institutionComponent?: number | null | undefined,
    activityField?: number | null | undefined,
    altLogo?: string,
    amountMembersAllowed: string
}

export interface NewAssociation {
    name: string,
    isSite: boolean,
    institution: number | undefined,
}
