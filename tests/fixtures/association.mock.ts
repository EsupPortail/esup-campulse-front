import type {Institution} from '#/institution'
import type {
  Association,
  AssociationSocialNetwork,
  SearchAssociation,
  UpdateAssociation
} from '#/association'


export const _institutions: Institution[] = [
  {
    id: 1,
    name: 'Université de Strasbourg',
    acronym: 'Unistra'
  },
  {
    id: 2,
    name: 'Université de Haute Alsace',
    acronym: 'UHA'
  }
]

export const _institutionComponents = [
  {
    id: 1,
    name: 'Faculté de Médecine',
    institution: 1
  },
  {
    id: 2,
    name: 'Faculté des Langues',
    institution: 1
  }
]


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

export const _association: Association = {
  canSubmitProjects: true,
  charterStatus: 'CHARTER_DRAFT',
  charterDate: '',
  id: 1,
  name: 'PLANA',
  acronym: '',
  pathLogo: {
    base: 'base',
    detail: 'detail',
    list: 'list'
  },
  socialObject: 'Développer la vie étudiante sur le site Alsace',
  currentProjects: 'Tutorat, sorties culturelles et festival annuel',
  address: '16 rue René Descartes',
  zipcode: '67000',
  city: 'Strasbourg',
  country: 'France',
  phone: '0300000000',
  email: 'plana@unistra.fr',
  siret: '12345678900012',
  website: 'https://plana.unistra.fr',
  studentCount: 120,
  amountMembersAllowed: 4,
  presidentNames: 'Camille Martin',
  presidentPhone: '0600000000',
  presidentEmail: 'president@unistra.fr',
  isEnabled: true,
  isPublic: true,
  isSite: true,
  creationDate: '2020-09-01',
  approvalDate: '2020-10-01',
  lastGoaDate: '2023-01-24',
  cgaDate: '2023-01-25',
  calculatedExpirationDate: '2024-01-25',
  socialNetworks: [
    {
      type: 'Mastodon',
      location: 'https://mastodon.social'
    }
  ],
  institution: _institutions[0],
  institutionComponent: _institutionComponents[0],
  activityField: _activityFields[0]
}

export const _editedAssociation: UpdateAssociation = {
  name: 'Association des étudiants en médecine',
  acronym: 'Asso',
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
  presidentEmail: '',
  isPublic: true,
  approvalDate: null,
  lastGoaDate: '2023-01-24',
  institution: 2,
  institutionComponent: 2,
  activityField: 2,
  amountMembersAllowed: 5
}

export const _nonUpdateAssociation: UpdateAssociation = {
  name: 'PLANA',
  acronym: '',
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
  presidentEmail: '',
  isPublic: false,
  approvalDate: '',
  lastGoaDate: null,
  institution: 1,
  institutionComponent: 1,
  activityField: 1,
  amountMembersAllowed: 4
}

export const _associations: Association[] = [
  {
    id: 1,
    name: 'Association',
    acronym: 'Asso',
    pathLogo: null,
    email: 'asso@unistra.fr',
    isEnabled: true,
    isPublic: true,
    isSite: true,
    institution: _institutions[0],
    institutionComponent: _institutionComponents[0],
    activityField: _activityFields[0],
    canSubmitProjects: true,
    charterStatus: 'CHARTER_DRAFT',
    charterDate: '',
    calculatedExpirationDate: '2024-01-25',
    socialObject: 'Promouvoir la vie étudiante',
    currentProjects: 'Tutorat et sorties',
    address: '1 rue de l\'hôpital',
    zipcode: '67000',
    city: 'Strasbourg',
    country: 'France',
    phone: '0300000001',
    siret: '12345678900013',
    website: 'https://asso.unistra.fr',
    studentCount: 85,
    presidentNames: 'Jeanne Dupont',
    presidentPhone: '0600000001',
    presidentEmail: 'jeanne.dupont@unistra.fr',
    creationDate: '2019-09-01',
    approvalDate: '2019-10-01',
    lastGoaDate: '2023-01-24',
    cgaDate: '2023-01-25',
    socialNetworks: [{type: 'Mastodon', location: 'https://mastodon.social'}],
    amountMembersAllowed: 4
  },
  {
    id: 2,
    name: 'Amicale des étudiants en Chimie',
    acronym: 'AEC',
    pathLogo: null,
    email: 'aec@unistra.fr',
    isEnabled: true,
    isPublic: false,
    isSite: true,
    institution: _institutions[1],
    institutionComponent: _institutionComponents[1],
    activityField: _activityFields[1],
    canSubmitProjects: true,
    charterStatus: 'CHARTER_DRAFT',
    charterDate: '',
    calculatedExpirationDate: '2024-02-15',
    socialObject: 'Regrouper les étudiants en chimie',
    currentProjects: 'Conférences et visites de laboratoires',
    address: '2 rue de la Chimie',
    zipcode: '68000',
    city: 'Mulhouse',
    country: 'France',
    phone: '0300000002',
    siret: '12345678900014',
    website: 'https://aec.unistra.fr',
    studentCount: 64,
    presidentNames: 'Lucas Bernard',
    presidentPhone: '0600000002',
    presidentEmail: 'lucas.bernard@unistra.fr',
    creationDate: '2021-09-01',
    approvalDate: '2021-10-01',
    lastGoaDate: '2023-02-14',
    cgaDate: '2023-02-15',
    socialNetworks: [{type: 'Twitter', location: 'https://twitter.com'}],
    amountMembersAllowed: 4
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
    name: 'LUCIE',
    hasPresident: false,
    institution: 1
  },
  {
    id: 3,
    name: 'OCTANT',
    hasPresident: false,
    institution: 1
  },
  {
    id: 4,
    name: 'OPALINE',
    hasPresident: false,
    institution: 1
  },
  {
    id: 5,
    name: 'EMPRUNTE',
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

export const _associationWrongSearchSettings: SearchAssociation = {
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

export const _institutionLabels = _institutions.map(institution => ({
  value: institution.id,
  label: `${institution.acronym} (${institution.name})`
}))

export const _institutionComponentLabels = _institutionComponents.map(component => ({
  value: component.id,
  label: component.name,
  institution: component.institution
}))

export const _activityFieldLabels = _activityFields.map(field => ({
  value: field.id,
  label: field.name
}))
