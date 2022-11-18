import type {User, NewUser, UserGroup, UserAssociations} from '#/user'

export const user: User = {
    id: 1,
    password: 'motdepasse',
    lastLogin: null,
    isSuperuser: false,
    username: 'john.lennon@bbc.com',
    firstName: 'John',
    lastName: 'Lennon',
    phone: null,
    email: 'john.lennon@bbc.com',
    isStaff: false,
    isActive: false,
    dateJoined: '',
    isCas: null,
    status: 'user'
}

export const newUser: NewUser = {
    username: 'john.lennon@bbc.com',
    firstName: 'John',
    lastName: 'Lennon',
    phone: null,
    email: 'john.lennon@bbc.com'
}

export const groups: UserGroup[] = [
    {
        id: 1,
        name: 'Gestionnaire'
    },
    {
        id: 2,
        name: 'Etudiant'
    },
    {
        id: 3,
        name: 'Membre de commission'
    }
]

export const groupList = groups.map(
    group => ({
        value: group.id,
        label: group.name
    })
)

export const userAssociations: UserAssociations = [
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
]