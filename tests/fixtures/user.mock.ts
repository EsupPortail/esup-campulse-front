import type {AssociationMember, AssociationRole, AssociationUser} from '#/association'
import type {RegisterUser, User, UserAssociation, UserGroup} from '#/user'
import {_groups} from '~/fixtures/group.mock'
import i18n from '@/plugins/i18n'

function getUserGroupsPermissions(userGroups: UserGroup[]): string[] {
  const permissions: string[] = []
  userGroups.forEach((userGroup) => {
    _groups.find(_group => _group.id === userGroup.groupId)?.permissions.forEach((permission) => {
      if (permissions.indexOf(permission) === -1) {
        permissions.push(permission)
      }
    })
  })
  return permissions
}

export const _userGroups: UserGroup[] = [
  // General manager
  {
    id: 1,
    userId: 1,
    groupId: 1,
    institutionId: 1,
    fundId: null
  },
  {
    id: 2,
    userId: 1,
    groupId: 2,
    institutionId: 2,
    fundId: null
  },
  {
    id: 3,
    userId: 1,
    groupId: 3,
    institutionId: 3,
    fundId: null
  },
  // Student
  {
    id: 4,
    userId: 2,
    groupId: 6,
    institutionId: 1,
    fundId: null
  },
  {
    id: 5,
    userId: 7,
    groupId: 7,
    institutionId: null,
    fundId: null
  },
  // Commission
  {
    id: 6,
    userId: 3,
    groupId: 4,
    institutionId: null,
    fundId: 1
  },
  // Misc manager
  {
    id: 7,
    userId: 4,
    groupId: 3,
    institutionId: null,
    fundId: 3
  }
]

export const _institutionManager: User = {
  id: 1,
  username: 'institution-manager@unistra.fr',
  firstName: 'Manager',
  lastName: 'Institution',
  phone: '0300000001',
  email: 'institution-manager@unistra.fr',
  address: '1 place de l\'université',
  zipcode: '67000',
  city: 'Strasbourg',
  country: 'France',
  isCas: false,
  hasValidatedEmail: true,
  isValidatedByAdmin: true,
  isStudent: false,
  canSubmitProjects: false,
  associations: [],
  groups: [_userGroups[1], _userGroups[2]],
  permissions: getUserGroupsPermissions([_userGroups[1], _userGroups[2]])
}

export const _generalManager: User = {
  id: 2,
  username: 'general-manager@unistra.fr',
  firstName: 'Manager',
  lastName: 'General',
  phone: '0300000002',
  email: 'general-manager@unistra.fr',
  address: '1 place de l\'université',
  zipcode: '67000',
  city: 'Strasbourg',
  country: 'France',
  isCas: false,
  hasValidatedEmail: true,
  isValidatedByAdmin: true,
  isStudent: false,
  canSubmitProjects: false,
  associations: [],
  groups: [_userGroups[0]],
  permissions: getUserGroupsPermissions([_userGroups[0]])
}

export const _miscManager: User = {
  id: 4,
  username: 'misc-manager@unistra.fr',
  firstName: 'Manager',
  lastName: 'Misc',
  phone: '0300000003',
  email: 'misc-manager@unistra.fr',
  address: '2 place de l\'université',
  zipcode: '67000',
  city: 'Strasbourg',
  country: 'France',
  isCas: false,
  hasValidatedEmail: true,
  isValidatedByAdmin: true,
  isStudent: false,
  canSubmitProjects: false,
  associations: [],
  groups: [_userGroups[6]],
  permissions: getUserGroupsPermissions([_userGroups[6]])
}

export const _institutionStudent: User = {
  id: 5,
  username: 'institution-student@unistra.fr',
  firstName: 'Student',
  lastName: 'Institution',
  phone: '0600000011',
  email: 'institution-student@unistra.fr',
  address: '3 rue des étudiants',
  zipcode: '67000',
  city: 'Strasbourg',
  country: 'France',
  isCas: false,
  hasValidatedEmail: true,
  isValidatedByAdmin: true,
  isStudent: true,
  canSubmitProjects: true,
  associations: [
    {
      id: 1,
      name: 'Association',
      acronym: 'ASSO',
      email: 'asso@unistra.fr',
      isEnabled: true,
      isPublic: true,
      isSite: true,
      canSubmitProjects: true,
      charterStatus: 'CHARTER_DRAFT',
      institution: 1
    }
  ],
  groups: [_userGroups[3]],
  permissions: getUserGroupsPermissions([_userGroups[3]])
}

export const _memberFund: User = {
  id: 6,
  username: 'commission@unistra.fr',
  firstName: 'Commission',
  lastName: 'Member',
  phone: '0300000004',
  email: 'commission@unistra.fr',
  address: '1 place de l\'université',
  zipcode: '67000',
  city: 'Strasbourg',
  country: 'France',
  isCas: false,
  hasValidatedEmail: true,
  isValidatedByAdmin: true,
  isStudent: false,
  canSubmitProjects: false,
  associations: [],
  groups: [_userGroups[5]],
  permissions: getUserGroupsPermissions([_userGroups[4]])
}

export const _miscStudent: User = {
  id: 7,
  username: 'misc-student@unistra.fr',
  firstName: 'Student',
  lastName: 'Misc',
  phone: '0600000012',
  email: 'misc-student@unistra.fr',
  address: '4 rue des étudiants',
  zipcode: '67000',
  city: 'Strasbourg',
  country: 'France',
  isCas: false,
  hasValidatedEmail: true,
  isValidatedByAdmin: true,
  isStudent: true,
  canSubmitProjects: true,
  associations: [],
  groups: [_userGroups[4]],
  permissions: getUserGroupsPermissions([_userGroups[4]])
}

export const _newUser: RegisterUser = {
  isCas: false,
  username: 'john.lennon@bbc.com',
  firstName: 'John',
  lastName: 'Lennon',
  phone: '0600000020',
  email: 'john.lennon@bbc.com',
  gifus: [
    {group: 7, institution: null, fund: null}
  ],
  associations: []
}

export const _users = [_institutionStudent, _institutionManager, _memberFund, _miscStudent]

export const _userNames = _users.map(
  user => ({
    value: user.id,
    label: user.firstName + ' ' + user.lastName
  })
)

export const _userAssociationDetail: UserAssociation = {
  id: 1,
  name: 'Association super',
  acronym: 'SUPASSO',
  email: 'asso@mail.tld',
  isEnabled: true,
  isPublic: true,
  isSite: true,
  institution: 1,
  canSubmitProjects: true,
  charterStatus: 'CHARTER_DRAFT'
}

export const _associationUser: AssociationUser[] = [
  {
    id: 1,
    user: {id: 1, firstName: 'John', lastName: 'Doe'},
    isPresident: true,
    canBePresidentFrom: '2023-01-01',
    canBePresidentTo: '2024-01-01',
    isValidatedByAdmin: true,
    isVicePresident: false,
    isSecretary: false,
    isTreasurer: false,
    association: _userAssociationDetail
  },
  {
    id: 2,
    user: {id: 2, firstName: 'Jane', lastName: 'Doe'},
    isPresident: false,
    canBePresidentFrom: '',
    canBePresidentTo: '',
    isValidatedByAdmin: true,
    isVicePresident: false,
    isSecretary: true,
    isTreasurer: false,
    association: {..._userAssociationDetail, id: 2, name: 'Lucie', acronym: 'LUCIE'}
  },
  {
    id: 3,
    user: {id: 3, firstName: 'David', lastName: 'Doe'},
    isPresident: false,
    canBePresidentFrom: '',
    canBePresidentTo: '',
    isValidatedByAdmin: true,
    isVicePresident: false,
    isSecretary: false,
    isTreasurer: true,
    association: {..._userAssociationDetail, id: 3, name: 'OCTANT', acronym: 'OCTANT'}
  },
  {
    id: 4,
    user: {id: 4, firstName: 'Frank', lastName: 'Doe'},
    isPresident: false,
    canBePresidentFrom: '',
    canBePresidentTo: '',
    isValidatedByAdmin: false,
    isVicePresident: true,
    isSecretary: false,
    isTreasurer: false,
    association: {..._userAssociationDetail, id: 4, name: 'OPALINE', acronym: 'OPALINE'}
  },
  {
    id: 5,
    user: {id: 5, firstName: 'Gwen', lastName: 'Doe'},
    isPresident: false,
    canBePresidentFrom: '',
    canBePresidentTo: '',
    isValidatedByAdmin: false,
    isVicePresident: false,
    isSecretary: false,
    isTreasurer: false,
    association: {..._userAssociationDetail, id: 5, name: 'CAMPULSE', acronym: 'CAMPULSE'}
  }
]

export const _userAssociations: AssociationUser[] = [
  {
    id: 1,
    user: {
      id: 1,
      firstName: 'John',
      lastName: 'Doe'
    },
    isPresident: true,
    canBePresidentFrom: '2023-01-01',
    canBePresidentTo: '2024-01-01',
    isValidatedByAdmin: true,
    isVicePresident: false,
    isSecretary: false,
    isTreasurer: false,
    association: {
      id: 1,
      name: 'Plateforme de liaison',
      isSite: true,
      institution: 1,
      isEnabled: true,
      isPublic: true,
      acronym: 'PLANA',
      email: 'plana@unistra.fr',
      canSubmitProjects: true,
      charterStatus: 'CHARTER_DRAFT'
    }
  },
  {
    id: 2,
    user: {
      id: 2,
      firstName: 'Jane',
      lastName: 'Doe'
    },
    isPresident: false,
    canBePresidentFrom: '',
    canBePresidentTo: '',
    isValidatedByAdmin: true,
    isVicePresident: false,
    isSecretary: true,
    isTreasurer: false,
    association: {
      id: 2,
      name: 'Lucie',
      isSite: true,
      institution: 1,
      isEnabled: true,
      isPublic: true,
      acronym: 'LUCIE',
      email: 'lucie@unistra.fr',
      canSubmitProjects: true,
      charterStatus: 'CHARTER_DRAFT'
    }
  },
  {
    id: 3,
    user: {
      id: 3,
      firstName: 'David',
      lastName: 'Doe'
    },
    isPresident: false,
    canBePresidentFrom: '',
    canBePresidentTo: '',
    isValidatedByAdmin: true,
    isVicePresident: false,
    isSecretary: false,
    isTreasurer: true,
    association: {
      id: 3,
      name: 'OCTANT',
      isSite: true,
      institution: 1,
      isEnabled: true,
      isPublic: true,
      acronym: 'OCTANT',
      email: 'octant@unistra.fr',
      canSubmitProjects: true,
      charterStatus: 'CHARTER_DRAFT'
    }
  },
  {
    id: 4,
    user: {
      id: 4,
      firstName: 'Frank',
      lastName: 'Doe'
    },
    isPresident: false,
    canBePresidentFrom: '',
    canBePresidentTo: '',
    isValidatedByAdmin: true,
    isVicePresident: true,
    isSecretary: false,
    isTreasurer: false,
    association: {
      id: 4,
      name: 'OPALINE',
      isSite: true,
      institution: 1,
      isEnabled: true,
      isPublic: true,
      acronym: 'OPALINE',
      email: 'opaline@unistra.fr',
      canSubmitProjects: true,
      charterStatus: 'CHARTER_DRAFT'
    }
  },
  {
    id: 5,
    user: {
      id: 5,
      firstName: 'Gwen',
      lastName: 'Doe'
    },
    isPresident: false,
    canBePresidentFrom: '',
    canBePresidentTo: '',
    isValidatedByAdmin: true,
    isVicePresident: false,
    isSecretary: false,
    isTreasurer: false,
    association: {
      id: 5,
      name: 'CAMPULSE',
      isSite: true,
      institution: 1,
      isEnabled: true,
      isPublic: true,
      acronym: 'CAMPULSE',
      email: 'campulse@unistra.fr',
      canSubmitProjects: true,
      charterStatus: 'CHARTER_DRAFT'
    }
  }
]

export const _userAssociation: AssociationUser = _userAssociations[0]

export const _associationRole: AssociationRole = {
  id: 1,
  name: 'Jane',
  role: 'isPresident',
  deleteAssociation: false,
  isValidatedByAdmin: true,
  options: [
    {
      label: i18n.global.t('forms.im-association-president'),
      value: 'isPresident',
    },
    {
      label: i18n.global.t('forms.im-association-secretary'),
      value: 'isSecretary'
    },
    {
      label: i18n.global.t('forms.im-association-treasurer'),
      value: 'isTreasurer'
    },
    {
      label: i18n.global.t('forms.im-association-vice-president'),
      value: 'isVicePresident'
    },
    {
      label: i18n.global.t('forms.im-association-member'),
      value: 'isMember'
    }
  ]
}

export const _associationMembers: AssociationMember[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    role: 'isPresident',
    canBePresidentFrom: null,
    canBePresidentTo: null,
    isValidatedByAdmin: true
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Doe',
    role: 'isSecretary',
    canBePresidentFrom: null,
    canBePresidentTo: null,
    isValidatedByAdmin: true
  },
  {
    id: 3,
    firstName: 'David',
    lastName: 'Doe',
    role: 'isTreasurer',
    canBePresidentFrom: null,
    canBePresidentTo: null,
    isValidatedByAdmin: true
  },
  {
    id: 4,
    firstName: 'Frank',
    lastName: 'Doe',
    role: 'isVicePresident',
    canBePresidentFrom: null,
    canBePresidentTo: null,
    isValidatedByAdmin: true
  },
  {
    id: 5,
    firstName: 'Gwen',
    lastName: 'Doe',
    role: 'isMember',
    canBePresidentFrom: null,
    canBePresidentTo: null,
    isValidatedByAdmin: true
  }
]

export const _casUsers = [
  {
    username: 'lskywalker',
    firstName: 'Luke',
    lastName: 'Skywalker',
    mail: 'lskywalker@unistra.fr'
  },
  {
    username: 'hsolo',
    firstName: 'Han',
    lastName: 'Solo',
    mail: 'hsolo@unistra.fr'
  }
]
