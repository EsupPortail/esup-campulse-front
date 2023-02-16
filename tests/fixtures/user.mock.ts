import type {ManagedUsers, User, UserAssociations, UserGroup, UserRegister} from '#/user'
import {_associationName} from '~/fixtures/association.mock'

export const _userGroups: UserGroup[] = [
    {
        id: 1,
        name: 'Gestionnaire SVU'
    },
    {
        id: 2,
        name: 'Étudiante ou Étudiant'
    },
    {
        id: 3,
        name: 'Membre de commission'
    }
]

export const _newUserGroups: number[] = [1, 2]

export const _manager: User = {
    id: 1,
    password: 'motdepasse',
    username: 'manager@unistra.fr',
    firstName: 'Manager',
    lastName: 'Unistra',
    phone: '',
    email: 'manager@unistra.fr',
    isCas: false,
    isValidatedByAdmin: true,
    groups: [
        {
            id: 1,
            name: 'Gestionnaire SVU'
        }
    ],
    associations: _associationName
}

export const _student: User = {
    id: 5,
    password: 'motdepasse',
    username: 'student@unistra.fr',
    firstName: 'Student',
    lastName: 'Unistra',
    phone: '',
    email: 'student@unistra.fr',
    isCas: false,
    isValidatedByAdmin: true,
    groups: [
        {
            id: 2,
            name: 'Étudiante ou Étudiant'
        }
    ],
    associations: _associationName
}

export const _users: ManagedUsers = [_student, _manager]

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

export const _userAssociations: UserAssociations = [
    {
        id: 1,
        roleName: 'Président',
        hasOfficeStatus: true,
        isPresident: true
    },
    {
        id: 2,
        roleName: 'Secrétaire',
        hasOfficeStatus: false,
        isPresident: false
    },
    {
        id: 3,
        roleName: 'Trésorier',
        hasOfficeStatus: false,
        isPresident: false
    },
    {
        id: 4,
        roleName: 'Membre',
        hasOfficeStatus: false,
        isPresident: false
    }
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
