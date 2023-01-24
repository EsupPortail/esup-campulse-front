import type {
    Association,
    AssociationList,
    AssociationName,
    AssociationSearch,
    AssociationSocialNetwork,
    EditedAssociation
} from '#/association'


export const association: Association = {
    id: 1,
    institution: {
        id: 1,
        name: 'Université de Strasbourg',
        acronym: 'Unistra',
    },
    institutionComponent: {
        id: 1,
        name: 'Faculté de médecine',
    },
    activityField: {
        id: 1,
        name: 'Santé',
    },
    socialNetworks: [
        {
            type: 'Mastodon',
            location: 'https://mastodon.social'
        }
    ],
    name: 'Association',
    acronym: null,
    pathLogo: null,
    altLogo: null,
    description: null,
    activities: null,
    address: null,
    phone: null,
    email: null,
    siret: null,
    website: null,
    studentCount: null,
    presidentNames: null,
    phonePres: null,
    isEnabled: true,
    createdDate: null,
    approvalDate: null,
    lastGoaDate: null,
    cgaDate: null
}

export const editedAssociation: EditedAssociation = {
    institution: 1,
    institutionComponent: 1,
    activityField: 2,
    name: 'Association des étudiants en médecine',
    acronym: 'Asso',
    description: 'Association des étudiants en médecine',
    activities: 'Tutorat, sorties, randonnées et concerts',
    address: '1 rue de l\'hôpital',
    phone: '0102030405',
    email: 'asso-medecine@unistra.fr',
    siret: '0123456789',
    website: 'https://asso-medecine.fr',
    presidentNames: 'Jeanne Dupont',
    phonePres: null,
    lastGoaDate: '2023-01-24',
    approvalDate: null
}

const associationList = [
    {
        id: 1,
        institution: {
            id: 1,
            name: 'Université de Strasbourg',
            acronym: 'Unistra',
        },
        institutionComponent: {
            id: 1,
            name: 'Faculté de médecine',
        },
        activityField: {
            id: 1,
            name: 'Santé',
        },
        name: 'Association',
        acronym: 'Asso',
        isEnabled: true,
        isSite: true,
        isVisible: true
    },
    {
        id: 2,
        institution: {
            id: 2,
            name: 'Université de Haute-Alsace',
            acronym: 'UHA',
        },
        institutionComponent: {
            id: 2,
            name: 'Faculté de Chimie',
        },
        activityField: {
            id: 2,
            name: 'Sciences',
        },
        name: 'Amicale des étudiants en Chimie',
        acronym: 'AEC',
        isEnabled: true,
        isSite: true,
        isVisible: true
    }
]

export const mockedAssociationName: AssociationName[] = [
    {
        id: 1,
        name: 'Association'
    }
]

export const associations: AssociationList[] = associationList

export const associationNames = associations.map(
    association => ({
        value: association.id,
        label: association.name
    })
)

export const associationDirectory = associations.map(
    association => ({
        id: association.id,
        name: association.name,
        acronym: association.acronym,
        institution: association.institution.name,
        component: association.institutionComponent.name,
        field: association.activityField.name
    })
)

export const associationSearchSettings: AssociationSearch = {
    search: '',
    name: 'Chimie',
    acronym: '',
    institution: 2,
    institutionComponent: 2,
    activityField: 2
}

export const associationWrongSearchSettings: AssociationSearch = {
    search: '',
    name: 'Wrong query',
    acronym: '',
    institution: 0,
    institutionComponent: 2,
    activityField: 3
}

export const mockedAssociationSocialNetworks: AssociationSocialNetwork[] = [
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