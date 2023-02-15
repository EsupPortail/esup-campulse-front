import type {AssociationUser, User, UserGroup, UserRegister} from "#/user";
import {_associationName} from "./association.mock";
import {_permissionsManager, _permissionsStudent} from "./permissions.mock";

export const _userGroups: UserGroup[] = [
    {
        id: 1,
        name: 'GENERAL_MANAGER'
    },
    {
        id: 2,
        name: 'STUDENT_INSTITUTION'
    },
    {
        id: 3,
        name: 'Membre de commission'
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
    groups: [],
    permissions: _permissionsManager
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
    groups: [],
    permissions: _permissionsStudent
}

export const _newUser: UserRegister = {
    isCas: false,
    username: 'john.lennon@bbc.com',
    firstName: 'John',
    lastName: 'Lennon',
    phone: '',
    email: 'john.lennon@bbc.com'
}

export const _userGroupList: number[] = _userGroups.map(group => group.id)

export const _groupLabels = _userGroups.map(
    group => ({
        value: group.id,
        label: group.name
    })
)

export const _userAssociations: AssociationUser[] = [
    {
        id: 1,
        roleName: 'Président',
        canBePresident: true,
        isPresident: true
    },
    {
        id: 2,
        roleName: 'Secrétaire',
        canBePresident: true,
        isPresident: false
    },
    {
        id: 3,
        roleName: 'Trésorier',
        canBePresident: true,
        isPresident: false
    },
]

export const _userAssociationDetail = {
    user: 'Jane',
    roleName: 'Présidente',
    hasOfficeStatus: true,
    isPresident: true,
    association: 1
}

export const _userAssociationsManagement = [
    {
        associationId: 1,
        associationName: 'PLANA',
        roleName: 'Présidente',
        hasOfficeStatus: true,
        isPresident: true,
        deleteAssociation: false
    },
    {
        associationId: 2,
        associationName: 'Octant',
        roleName: 'Trésorière',
        hasOfficeStatus: true,
        isPresident: false,
        deleteAssociation: false
    },
    {
        associationId: 3,
        associationName: 'Apogée',
        roleName: 'Membre',
        hasOfficeStatus: false,
        isPresident: false,
        deleteAssociation: true
    }
]
