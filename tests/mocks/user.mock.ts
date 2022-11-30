import type {User, UserAssociations, UserGroup, UserRegister} from '#/user'

export const user: User = {
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
    groups: [
        {
            id: 2,
            name: 'Étudiante ou Étudiant'
        }
    ]
}

export const newUser: UserRegister = {
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
        name: 'Étudiante ou Étudiant'
    },
    {
        id: 3,
        name: 'Membre de commission'
    }
]

export const newUserGroups: number[] = [1, 3]

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
    {
        id: 4,
        hasOfficeStatus: false
    }
]