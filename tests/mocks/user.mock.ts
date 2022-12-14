import type {User, UserAssociations, UserDirectory, UserGroup, UserNames, UserRegister} from '#/user'


export const mockedGroups: UserGroup[] = [
    {
        id: 1,
        name: 'Gestionnaire'
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
    //lastLogin: null,
    //isSuperuser: false,
    username: 'john.lennon@bbc.com',
    firstName: 'John',
    lastName: 'Lennon',
    phone: null,
    email: 'john.lennon@bbc.com',
    //isStaff: false,
    //isActive: false,
    //dateJoined: '',
    isCas: false,
    isValidatedByAdmin: true,
    groups: mockedGroups
}

export const mockedUsers: User[] = [mockedUser, mockedUser, mockedUser]

export const mockedNewUser: UserRegister = {
    username: 'john.lennon@bbc.com',
    firstName: 'John',
    lastName: 'Lennon',
    phone: null,
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
        hasOfficeStatus: true
    },
    {
        id: 2,
        hasOfficeStatus: false
    },
    {
        id: 3,
        hasOfficeStatus: false
    },
    {
        id: 4,
        hasOfficeStatus: false
    }
]

export const mockedUserNames: UserNames = mockedUsers.map(
    user => ({
        value: user.id,
        label: user.firstName + ' ' + user.lastName
    })
)

export const mockedUserDirectory: UserDirectory = mockedUsers.map(
    user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isValidatedByAdmin: user.isValidatedByAdmin
    })
)