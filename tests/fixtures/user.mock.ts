import type {
    AssociationMember,
    AssociationRole,
    AssociationUser,
    AssociationUserDetail,
    User,
    UserGroup,
    UserRegister
} from '#/user'
import {_userAssociation} from '~/fixtures/association.mock'
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
    // Manager
    {
        userId: 1,
        groupId: 1,
        institutionId: 1,
        commissionId: null
    },
    {
        userId: 1,
        groupId: 2,
        institutionId: 2,
        commissionId: null
    },
    {
        userId: 1,
        groupId: 3,
        institutionId: 3,
        commissionId: null
    },
    // Student
    {
        userId: 2,
        groupId: 6,
    },
    // Commission
    {
        userId: 3,
        groupId: 4,
        commissionId: 1
    }
]

export const _institutionManager: User = {
    id: 1,
    username: 'institution-manager@unistra.fr',
    firstName: 'Manager',
    lastName: 'Institution',
    phone: '',
    email: 'institution-manager@unistra.fr',
    isCas: false,
    hasValidatedEmail: true,
    isValidatedByAdmin: true,
    associations: [],
    groups: [_userGroups[1], _userGroups[2]],
    permissions: getUserGroupsPermissions([_userGroups[1], _userGroups[2]])
}

export const _generalManager: User = {
    id: 2,
    username: 'general-manager@unistra.fr',
    firstName: 'Manager',
    lastName: 'General',
    phone: '',
    email: 'general-manager@unistra.fr',
    isCas: false,
    hasValidatedEmail: true,
    isValidatedByAdmin: true,
    associations: [],
    groups: [_userGroups[0]],
    permissions: getUserGroupsPermissions([_userGroups[0]])
}

export const _institutionStudent: User = {
    id: 5,
    username: 'institution-student@unistra.fr',
    firstName: 'Student',
    lastName: 'Institution',
    phone: '',
    email: 'institution-student@unistra.fr',
    isCas: false,
    hasValidatedEmail: true,
    isValidatedByAdmin: true,
    associations: _userAssociation,
    groups: [_userGroups[3]],
    permissions: getUserGroupsPermissions([_userGroups[3]])
}

export const _commission: User = {
    id: 6,
    username: 'commission@unistra.fr',
    firstName: 'Commission',
    lastName: 'Member',
    phone: '',
    email: 'commission@unistra.fr',
    isCas: false,
    hasValidatedEmail: true,
    isValidatedByAdmin: true,
    associations: [],
    groups: [_userGroups[4]],
    permissions: getUserGroupsPermissions([_userGroups[4]])
}

export const _newUser: UserRegister = {
    isCas: false,
    username: 'john.lennon@bbc.com',
    firstName: 'John',
    lastName: 'Lennon',
    phone: '',
    email: 'john.lennon@bbc.com'
}

export const _users = [_institutionStudent, _institutionManager]

export const _usersNames = _users.map(
    user => ({
        value: user.id,
        label: user.firstName + ' ' + user.lastName
    })
)

export const _userAssociations: AssociationUser[] = [
    {
        user: 1,
        isPresident: true,
        canBePresident: true,
        canBePresidentFrom: null,
        canBePresidentTo: null,
        isValidatedByAdmin: true,
        isVicePresident: false,
        isSecretary: false,
        isTreasurer: false,
        association: 1
    },
    {
        user: 2,
        isPresident: false,
        canBePresident: true,
        canBePresidentFrom: null,
        canBePresidentTo: null,
        isValidatedByAdmin: true,
        isVicePresident: false,
        isSecretary: true,
        isTreasurer: false,
        association: 2
    },
    {
        user: 3,
        isPresident: false,
        canBePresident: false,
        canBePresidentFrom: null,
        canBePresidentTo: null,
        isValidatedByAdmin: true,
        isVicePresident: false,
        isSecretary: false,
        isTreasurer: true,
        association: 3
    },
    {
        user: 4,
        isPresident: false,
        canBePresident: false,
        canBePresidentFrom: null,
        canBePresidentTo: null,
        isValidatedByAdmin: false,
        isVicePresident: true,
        isSecretary: false,
        isTreasurer: false,
        association: 4
    },
    {
        user: 5,
        isPresident: false,
        canBePresident: false,
        canBePresidentFrom: null,
        canBePresidentTo: null,
        isValidatedByAdmin: false,
        isVicePresident: false,
        isSecretary: false,
        isTreasurer: false,
        association: 5
    }
]

export const _userAssociationDetails: AssociationUserDetail[] = [
    {
        user: 1,
        isPresident: true,
        canBePresident: true,
        canBePresidentFrom: null,
        canBePresidentTo: null,
        isValidatedByAdmin: true,
        isVicePresident: false,
        isSecretary: false,
        isTreasurer: false,
        association: {
            id: 1,
            name: 'PLANA',
            isSite: true,
            institution: 1,
            isEnabled: true,
            isPublic: true
        }
    },
    {
        user: 2,
        isPresident: false,
        canBePresident: true,
        canBePresidentFrom: null,
        canBePresidentTo: null,
        isValidatedByAdmin: true,
        isVicePresident: false,
        isSecretary: true,
        isTreasurer: false,
        association: {
            id: 2,
            name: 'LUCIE',
            isSite: true,
            institution: 1,
            isEnabled: true,
            isPublic: true
        }
    },
    {
        user: 3,
        isPresident: false,
        canBePresident: false,
        canBePresidentFrom: null,
        canBePresidentTo: null,
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
            isPublic: true
        }
    },
    {
        user: 4,
        isPresident: false,
        canBePresident: false,
        canBePresidentFrom: null,
        canBePresidentTo: null,
        isValidatedByAdmin: false,
        isVicePresident: true,
        isSecretary: false,
        isTreasurer: false,
        association: {
            id: 4,
            name: 'OPALINE',
            isSite: true,
            institution: 1,
            isEnabled: true,
            isPublic: true
        }
    },
    {
        user: 5,
        isPresident: false,
        canBePresident: false,
        canBePresidentFrom: null,
        canBePresidentTo: null,
        isValidatedByAdmin: false,
        isVicePresident: false,
        isSecretary: false,
        isTreasurer: false,
        association: {
            id: 5,
            name: 'CAMPULSE'
        }
    }
]

export const _userAssociationDetail: AssociationUserDetail = {
    isPresident: true,
    canBePresident: true,
    canBePresidentFrom: null,
    canBePresidentTo: null,
    isValidatedByAdmin: true,
    isVicePresident: false,
    isSecretary: false,
    isTreasurer: false,
    association: {
        id: 1,
        name: 'Association',
        isSite: true,
        institution: 1,
        isEnabled: true,
        isPublic: true
    }
}

export const _associationRole: AssociationRole = {
    id: 1,
    name: 'Jane',
    role: 'isPresident',
    deleteAssociation: false,
    canBePresident: true,
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
        id: _institutionManager.id,
        firstName: _institutionManager.firstName,
        lastName: _institutionManager.lastName,
        role: 'Présidente ou président de l\'association',
        canBePresident: _userAssociations[0].canBePresident,
        canBePresidentFrom: null,
        canBePresidentTo: null,
        isValidatedByAdmin: _userAssociations[0].isValidatedByAdmin as boolean
    },
    {
        id: _institutionStudent.id,
        firstName: _institutionStudent.firstName,
        lastName: _institutionStudent.lastName,
        role: 'Autre membre de l\'association',
        canBePresident: _userAssociations[4].canBePresident,
        canBePresidentFrom: null,
        canBePresidentTo: null,
        isValidatedByAdmin: _userAssociations[4].isValidatedByAdmin as boolean
    }
]

