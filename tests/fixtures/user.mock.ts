import type { AssociationUser, User, UserGroup, UserRegister } from "#/user";
import { _associationName } from "./association.mock";
import { _groups } from "./group.mock";

function getUserGroupsPermissions(userGroups: UserGroup[]): string[] {
    const permissions: string[] = []
    userGroups.forEach((userGroup) => {
        _groups.find(_group => _group.id === userGroup.groupId)?.permissions.forEach((permission) => {
            if (permissions.indexOf(permission) === -1) {
                permissions.push(permission)
            }
        })
    });
    return permissions
}

export const _userGroups: UserGroup[] = [
    // Gestionnaire
    {
        userId: 1,
        groupId: 1,
        institutionId: 1,
    },
    {
        userId: 1,
        groupId: 1,
        institutionId: 2,
    },
    {
        userId: 1,
        groupId: 1,
        institutionId: 3,
    },
    // Étudiant
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

export const _manager: User = {
    id: 1,
    username: 'manager@unistra.fr',
    firstName: 'Manager',
    lastName: 'Unistra',
    phone: '',
    email: 'manager@unistra.fr',
    isCas: false,
    hasValidatedEmail: true,
    isValidatedByAdmin: true,
    associations: _associationName,
    groups: [_userGroups[0], _userGroups[1], _userGroups[2]],
    permissions: getUserGroupsPermissions([_userGroups[0], _userGroups[1], _userGroups[2]])
}

export const _student: User = {
    id: 5,
    username: 'student@unistra.fr',
    firstName: 'student',
    lastName: 'Unistra',
    phone: '',
    email: 'student@unistra.fr',
    isCas: false,
    hasValidatedEmail: true,
    isValidatedByAdmin: true,
    associations: _associationName,
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

export const _userGroupList: (number | undefined)[] = _userGroups.map(group => group.id)

export const _groupLabels = _userGroups.map(
    group => ({
        value: group.groupId,
        label: _groups.find(_group => _group.id === group.groupId)?.name
    })
)

export const _userAssociations: AssociationUser[] = [
    {
        id: 1,
        name: "PLANA",
        isPresident: true,
        canBePresident: true,
        isValidatedByAdmin: true,
        isSecretary: false,
        isTreasurer: false,
    },
    {
        id: 2,
        name: "Octant",
        isPresident: false,
        canBePresident: false,
        isValidatedByAdmin: true,
        isSecretary: true,
        isTreasurer: false,
    },
    {
        id: 3,
        name: "Apogée",
        isPresident: false,
        canBePresident: false,
        isValidatedByAdmin: true,
        isSecretary: false,
        isTreasurer: true,
    },
    {
        id: 4,
        name: "PLANB",
        isPresident: false,
        canBePresident: false,
        isValidatedByAdmin: false,
        isSecretary: false,
        isTreasurer: false,
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
