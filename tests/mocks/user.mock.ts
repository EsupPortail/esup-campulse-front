import type {ManagedUsers, User, UserAssociations, UserGroup, UserRegister} from '#/user'
import {mockedAssociationName} from '~/mocks/association.mock'

export const mockedGroups: UserGroup[] = [
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

export const mockedNewUserGroups: number[] = [1, 2]

export const mockedUser: User = {
    id: 1,
    password: 'motdepasse',
    username: 'john.lennon@bbc.com',
    firstName: 'John',
    lastName: 'Lennon',
    phone: '',
    email: 'john.lennon@bbc.com',
    isCas: false,
    isValidatedByAdmin: true,
    groups: mockedGroups,
    associations: mockedAssociationName
}

export const mockedUsers: ManagedUsers = [
    {
        id: 1,
        username: 'john.lennon@bbc.com',
        firstName: 'John',
        lastName: 'Lennon',
        phone: '',
        email: 'john.lennon@bbc.com',
        isCas: false,
        isValidatedByAdmin: true,
        groups: mockedGroups,
        associations: mockedAssociationName
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
        groups: mockedGroups,
        associations: mockedAssociationName
    }
]

export const mockedNewUser: UserRegister = {
    username: 'john.lennon@bbc.com',
    firstName: 'John',
    lastName: 'Lennon',
    phone: '',
    email: 'john.lennon@bbc.com'
}

export const mockedUserGroups: number[] = mockedUser.groups.map(group => group.id)

export const mockedGroupList = mockedGroups.map(
    group => ({
        value: group.id,
        label: group.name
    })
)

export const mockedUserAssociations: UserAssociations = [
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

export const mockedUserAssociationDetail = {
    user: 'Jane',
    roleName: 'Présidente',
    hasOfficeStatus: true,
    isPresident: true,
    association: {
        id: 1,
        name: 'PLANA'
    }
}

export const mockedUserAssociationsManagement = [
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
