import type {ProjectComment} from '#/project'

export const _comments: ProjectComment[] = [
    {
        id: 1,
        project: 1,
        user: {
            id: 1,
            firstName: 'Prénom',
            lastName: 'Nom'
        },
        text: 'Commentaire',
        creationDate: '2023-06-16',
        editionDate: '2023-06-20',
        isVisible: true
    },
    {
        id: 2,
        project: 2,
        user: {
            id: 2,
            firstName: 'Prénom',
            lastName: 'Nom'
        },
        text: 'Commentaire',
        creationDate: '2023-06-16',
        editionDate: '2023-06-20',
        isVisible: true
    },
    {
        id: 3,
        project: 3,
        user: {
            id: 3,
            firstName: 'Prénom',
            lastName: 'Nom'
        },
        text: 'Commentaire',
        creationDate: '2023-06-16',
        editionDate: '2023-06-20',
        isVisible: true
    }
]