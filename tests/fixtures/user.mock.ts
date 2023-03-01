import type {AssociationUser, User, UserGroup, UserRegister} from "#/user";
import {_userAssociation} from "~/fixtures/association.mock";
import {_groups} from "~/fixtures/group.mock";

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
    },
    {
        userId: 1,
        groupId: 2,
        institutionId: 2,
    },
    {
        userId: 1,
        groupId: 3,
        institutionId: 3,
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
    }
]

export const _newUserGroups: number[] = [1, 2]

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

export const _userGroupList: (number | undefined)[] = _userGroups.map(group => group.id)

export const _groupLabels = _userGroups.map(
    group => ({
        value: group.groupId,
        label: _groups.find(_group => _group.id === group.groupId)?.name
    })
)

export const _userAssociations: AssociationUser[] = [
    {
        name: "PLANA",
        isPresident: true,
        canBePresident: true,
        isValidatedByAdmin: true,
        isSecretary: false,
        isTreasurer: false,
        association: 1
    },
    {
        name: "Octant",
        isPresident: false,
        canBePresident: true,
        isValidatedByAdmin: true,
        isSecretary: true,
        isTreasurer: false,
        association: 2
    },
    {
        name: "Apogée",
        isPresident: false,
        canBePresident: false,
        isValidatedByAdmin: true,
        isSecretary: false,
        isTreasurer: true,
        association: 3
    },
    {
        name: "PLANB",
        isPresident: false,
        canBePresident: false,
        isValidatedByAdmin: false,
        isSecretary: false,
        isTreasurer: false,
        association: 4
    }
]

export const _userAssociationDetail = {
    user: 'Jane',
    isPresident: true,
    canBePresident: true,
    isValidatedByAdmin: true,
    isSecretary: false,
    isTreasurer: false,
    association: 1
}

export const _userAssociationsManagement = [
    {
        associationId: 1,
        associationName: 'PLANA',
        isPresident: true,
        canBePresident: true,
        isSecretary: false,
        isTreasurer: false,
        deleteAssociation: false
    },
    {
        associationId: 2,
        associationName: 'Octant',
        isPresident: false,
        canBePresident: true,
        isSecretary: false,
        isTreasurer: true,
        deleteAssociation: false
    },
    {
        associationId: 3,
        associationName: 'Apogée',
        isPresident: false,
        canBePresident: true,
        isSecretary: true,
        isTreasurer: false,
        deleteAssociation: true
    }
]
