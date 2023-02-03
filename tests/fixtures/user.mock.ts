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

export const _user: User = {
    id: 1,
    password: 'motdepasse',
    username: 'john.lennon@bbc.com',
    firstName: 'John',
    lastName: 'Lennon',
    phone: '',
    email: 'john.lennon@bbc.com',
    isCas: false,
    isValidatedByAdmin: true,
    groups: _userGroups,
    associations: _associationName
}

export const _users: ManagedUsers = [
    {
        id: 1,
        username: 'john.lennon@bbc.com',
        firstName: 'John',
        lastName: 'Lennon',
        phone: '',
        email: 'john.lennon@bbc.com',
        isCas: false,
        isValidatedByAdmin: true,
        groups: _userGroups,
        associations: _associationName
    },
    {
        id: 1,
        username: 'bill@murray.com',
        firstName: 'Bill',
        lastName: 'Murray',
        phone: '',
        email: 'bill@murray.com',
        isCas: false,
        isValidatedByAdmin: true,
        groups: _userGroups,
        associations: _associationName
    }
]

export const _newUser: UserRegister = {
    isCas: false,
    username: 'john.lennon@bbc.com',
    firstName: 'John',
    lastName: 'Lennon',
    phone: '',
    email: 'john.lennon@bbc.com'
}

export const _userGroupList: number[] = _user.groups.map(group => group.id)

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
