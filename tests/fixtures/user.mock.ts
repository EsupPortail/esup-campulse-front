import type {
    AssociationMember,
    AssociationRole,
    AssociationUser,
    User,
    UserAssociation,
    UserGroup,
    UserRegister
} from '#/user'
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
        userId: 1,
        groupId: 1,
        institutionId: 1,
        fundId: null
    },
    {
        userId: 1,
        groupId: 2,
        institutionId: 2,
        fundId: null
    },
    {
        userId: 1,
        groupId: 3,
        institutionId: 3,
        fundId: null
    },
    // Student
    {
        userId: 2,
        groupId: 6,
    },
    {
        userId: 7,
        groupId: 7,
    },
    // Commission
    {
        userId: 3,
        groupId: 4,
        fundId: 1
    },
    // Misc manager
    {
        userId: 4,
        groupId: 3,
        fundId: 3
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

export const _miscManager: User = {
    id: 4,
    username: 'misc-manager@unistra.fr',
    firstName: 'Manager',
    lastName: 'Misc',
    phone: '',
    email: 'misc-manager@unistra.fr',
    isCas: false,
    hasValidatedEmail: true,
    isValidatedByAdmin: true,
    associations: [],
    groups: [_userGroups[6]],
    permissions: getUserGroupsPermissions([_userGroups[6]])
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
    associations: [
        {
            id: 1,
            name: 'Association',
            acronym: 'ASSO',
            email: 'asso@unistra.fr',
            isEnabled: true,
            isPublic: true,
            isSite: true,
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
    phone: '',
    email: 'commission@unistra.fr',
    isCas: false,
    hasValidatedEmail: true,
    isValidatedByAdmin: true,
    associations: [],
    groups: [_userGroups[5]],
    permissions: getUserGroupsPermissions([_userGroups[4]])
}

export const _miscStudent: User = {
    id: 7,
    username: 'misc-student@unistra.fr',
    firstName: 'Student',
    lastName: 'Misc',
    phone: '',
    email: 'misc-student@unistra.fr',
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

export const _users = [_institutionStudent, _institutionManager, _memberFund, _miscStudent]

export const _usersNames = _users.map(
    user => ({
        value: user.id,
        label: user.firstName + ' ' + user.lastName
    })
)

export const _associationUser: AssociationUser[] = [
    {
        user: 1,
        isPresident: true,
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
        canBePresidentFrom: null,
        canBePresidentTo: null,
        isValidatedByAdmin: false,
        isVicePresident: false,
        isSecretary: false,
        isTreasurer: false,
        association: 5
    }
]

export const _userAssociations: UserAssociation[] = [
    {
        id: 1,
        user: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe'
        },
        isPresident: true,
        canBePresidentFrom: null,
        canBePresidentTo: null,
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
            canSubmitProjects: true
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
        canBePresidentFrom: null,
        canBePresidentTo: null,
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
            canSubmitProjects: true
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
            isPublic: true,
            acronym: 'OCTANT',
            email: 'octant@unistra.fr',
            canSubmitProjects: true
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
        canBePresidentFrom: null,
        canBePresidentTo: null,
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
            canSubmitProjects: true
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
        canBePresidentFrom: null,
        canBePresidentTo: null,
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
            canSubmitProjects: true
        }
    }
]

export const _userAssociation: UserAssociation = _userAssociations[0]

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

export const _CASUsers = [
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
