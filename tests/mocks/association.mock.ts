import type {Association, AssociationList} from '#/association'

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
    socialNetworks: {
        id: 1,
        type: 'Mastodon',
        location: 'https://mastodon.social'
    },
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
    isEnabled: true,
    createdDate: null,
    approvalDate: null,
    lastGoaDate: null,
    cgaDate: null
}

const associationList = {
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
    isSite: true
}

export const associations: AssociationList[] = [associationList, associationList, associationList]

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