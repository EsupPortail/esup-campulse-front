import type {Association, AssociationSearch, AssociationSocialNetwork, EditedAssociation} from '#/association'
import type {UserAssociation} from "#/user";


export const _association: Association = {
    id: 1,
    name: 'Association',
    acronym: '',
    pathLogo: null,
    altLogo: '',
    socialObject: '',
    currentProjects: '',
    address: '',
    phone: '',
    email: '',
    siret: '',
    website: '',
    studentCount: 0,
    presidentNames: '',
    presidentPhone: '',
    isEnabled: true,
    isPublic: true,
    isSite: true,
    creationDate: '',
    approvalDate: '',
    lastGoaDate: '',
    cgaDate: '',
    socialNetworks: [
        {
            type: 'Mastodon',
            location: 'https://mastodon.social'
        }
    ],
    institution: {
        id: 1,
        name: 'Université de Strasbourg',
        acronym: 'Unistra',
        email: 'test@pas-unistra.fr'
    },
    institutionComponent: {
        id: 1,
        name: 'Faculté de médecine',
        institution: {
            id: 1,
            name: 'Université de Strasbourg',
            acronym: 'Unistra',
            email: 'test@pas-unistra.fr'
        }
    },
    activityField: {
        id: 1,
        name: 'Santé',
    },
}

export const _editedAssociation: EditedAssociation = {
    name: 'Association des étudiants en médecine',
    acronym: 'Asso',
    altLogo: '',
    socialObject: 'Association des étudiants en médecine',
    currentProjects: 'Tutorat, sorties, randonnées et concerts',
    address: '1 rue de l\'hôpital',
    phone: '0102030405',
    email: 'asso-medecine@unistra.fr',
    siret: '0123456789',
    website: 'https://asso-medecine.fr',
    studentCount: 0,
    presidentNames: 'Jeanne Dupont',
    presidentPhone: '',
    isPublic: true,
    approvalDate: null,
    lastGoaDate: '2023-01-24',
    institution: 2,
    institutionComponent: 2,
    activityField: 2,
}

export const _nonEditedAssociation: EditedAssociation = {
    name: 'Association',
    acronym: '',
    altLogo: '',
    socialObject: '',
    currentProjects: '',
    address: '',
    phone: '',
    email: '',
    siret: '',
    website: '',
    studentCount: 0,
    presidentNames: '',
    presidentPhone: '',
    isPublic: false,
    approvalDate: '',
    lastGoaDate: null,
    institution: 1,
    institutionComponent: 1,
    activityField: 1,
}

export const _associations: Association[] = [
    {
        id: 1,
        name: 'Association',
        acronym: 'Asso',
        pathLogo: null,
        altLogo: '',
        email: '',
        isEnabled: true,
        isPublic: true,
        isSite: true,
        institution: {
            id: 1,
            name: 'Université de Strasbourg',
            acronym: 'Unistra',
            email: 'test@pas-unistra.fr'
        },
        institutionComponent: {
            id: 1,
            name: 'Faculté de médecine',
            institution: {
                id: 1,
                name: 'Université de Strasbourg',
                acronym: 'Unistra',
                email: 'test@pas-unistra.fr'
            }
        },
        activityField: {
            id: 1,
            name: 'Santé',
        },
    },
    {
        id: 2,
        name: 'Amicale des étudiants en Chimie',
        acronym: 'AEC',
        pathLogo: null,
        altLogo: '',
        email: '',
        isEnabled: true,
        isPublic: false,
        isSite: true,
        institution: {
            id: 2,
            name: 'Université de Haute-Alsace',
            acronym: 'UHA',
            email: 'test@pas-uha.fr'
        },
        institutionComponent: {
            id: 2,
            name: 'Faculté de Chimie',
            institution: {
                id: 2,
                name: 'Université de Haute-Alsace',
                acronym: 'UHA',
                email: 'test@pas-uha.fr'
            }
        },
        activityField: {
            id: 2,
            name: 'Sciences',
        },
    }
]

export const _userAssociation: UserAssociation[] = [
    {
        id: 1,
        name: 'Association',
        isSite: true,
        institution: 1
    }
]

export const _associationNames = [
    {
        id: 1,
        name: 'PLANA',
        hasPresident: true,
        institution: 1
    },
    {
        id: 2,
        name: 'OCTANT',
        hasPresident: false,
        institution: 1
    },
]

export const _associationLabels = _associationNames.map(
    association => ({
        value: association.id,
        label: association.name,
        hasPresident: association.hasPresident,
        institution: association.institution,
        disable: false
    })
)


export const _associationSearchSettings: AssociationSearch = {
    search: '',
    name: 'Chimie',
    acronym: 'AEC',
    institution: 2,
    institutionComponent: 2,
    activityField: 2
}

export const _associationWrongSearchSettings: AssociationSearch = {
    search: '',
    name: 'Wrong query',
    acronym: '',
    institution: 0,
    institutionComponent: 2,
    activityField: 3
}

export const _associationSocialNetworks: AssociationSocialNetwork[] = [
    {
        type: 'Mastodon',
        location: 'https://mastodon.social'
    },
    {
        type: 'Twitter',
        location: 'https://twitter.com'
    },
    {
        type: 'Facebook',
        location: 'https://facebook.com'
    }
]

export const _institutions = [
    {
        id: 1,
        name: 'Université de Strasbourg',
        acronym: 'Unistra',
        email: 'contact@unistra.fr',
    },
    {
        id: 2,
        name: 'Université de Haute Alsace',
        acronym: 'UHA',
        email: 'contact@uha.fr',
    }
]

export const _institutionLabels = _institutions.map(institution => ({
    value: institution.id,
    label: institution.name
}))

export const _institutionComponents = [
    {
        id: 1,
        name: 'Faculté de Médecine',
        institution: {
            id: 1,
            name: 'Université de Strasbourg',
            acronym: 'Unistra',
            email: 'contact@unistra.fr'
        }
    },
    {
        id: 2,
        name: 'Faculté des Langues',
        institution: {
            id: 1,
            name: 'Université de Strasbourg',
            acronym: 'Unistra',
            email: 'contact@unistra.fr'
        }
    }
]

export const _institutionComponentLabels = _institutionComponents.map(component => ({
    value: component.id,
    label: component.name
}))

export const _activityFields = [
    {
        id: 1,
        name: 'Sciences'
    },
    {
        id: 2,
        name: 'Culture'
    },
    {
        id: 3,
        name: 'Musique'
    },
]

export const _activityFieldLabels = _activityFields.map(field => ({
    value: field.id,
    label: field.name
}))

export const _associationRoleOptions = [
    {
        label: 'Président',
        value: 'isPresident',
    },
    {
        label: 'Vice-Président',
        value: 'isVicePresident',
    },
    {
        label: 'Secrétaire',
        value: 'isSecretary'
    },
    {
        label: 'Trésorier',
        value: 'isTreasurer'
    },
    {
        label: 'Membre',
        value: 'isMember'
    }
]
