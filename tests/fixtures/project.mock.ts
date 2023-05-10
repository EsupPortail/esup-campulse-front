import type {Project} from '#/project'

export const _project: Project = {
    id: 1,
    name: 'Projet associatif',
    plannedStartDate: '2023-10-26T17:30:00+02:00',
    plannedEndDate: '2023-10-26T20:00:00+02:00',
    plannedLocation: '16 rue René Descartes, 67000 Strasbourg, FRANCE',
    user: null,
    otherFirstName: '',
    otherLastName: '',
    otherEmail: '',
    otherPhone: '',
    association: 1,
    budgetPreviousEdition: 0,
    targetAudience: 'Une centaine d\'étudiants.',
    amountStudentsAudience: 90,
    amountAllAudience: 100,
    ticketPrice: 10,
    individualCost: 15,
    goals: 'Ceci sont les objectifs de mon projet en tant que porteur individuel. Par exemple rassembler les étudiants autour d\'une cause commune.',
    summary: 'Récapitulatif simple du projet.',
    plannedActivities: 'Conférence autour du thème des associations, petit déjeuner, échange avec les participants sur le sujet.',
    preventionSafety: 'Actions de sécurité et de préventions comme filtrage de l\'entrée selon les tickets par exemple.',
    marketingCampaign: 'Des messages sur les réseaux sociaux, des affiches et quelques tracts.',
    projectStatus: 'PROJECT_DRAFT'
}

export const _projects = [
    {
        id: 1,
        name: 'Projet associatif de porteur de projet individuel',
        association: null,
        user: 9,
        editionDate: '2023-03-15T11:18:47+01:00',
        projectStatus: 'PROJECT_DRAFT'
    },
    {
        id: 2,
        name: 'Projet associatif porté par une association',
        association: 2,
        user: null,
        editionDate: '2023-03-14T11:18:47+01:00',
        projectStatus: 'PROJECT_DRAFT'
    },
    {
        id: 3,
        name: 'test',
        association: 2,
        user: null,
        editionDate: '2023-04-26T14:27:42.938670+02:00',
        projectStatus: 'PROJECT_DRAFT'
    },
    {
        id: 4,
        name: 'test',
        association: 2,
        user: null,
        editionDate: '2023-04-26T14:28:59.408076+02:00',
        projectStatus: 'PROJECT_DRAFT'
    },
    {
        id: 5,
        name: 'test',
        association: 2,
        user: null,
        editionDate: '2023-04-28T11:06:52.944326+02:00',
        projectStatus: 'PROJECT_DRAFT'
    },
    {
        id: 6,
        name: 'test',
        association: 2,
        user: null,
        editionDate: '2023-04-28T11:07:42.336557+02:00',
        projectStatus: 'PROJECT_DRAFT'
    }
]

export const _projectCategoryNames = [
    {
        id: 1,
        name: 'Accueil des étudiants'
    },
    {
        id: 2,
        name: 'Culture Artistique'
    },
    {
        id: 3,
        name: 'Culture Scientifique et Technique'
    },
    {
        id: 4,
        name: 'Découverte pays / Culture'
    },
    {
        id: 5,
        name: 'Environnement / Développement Durable'
    },
    {
        id: 6,
        name: 'Forum / Orientation'
    },
    {
        id: 7,
        name: 'Handicap'
    },
    {
        id: 8,
        name: 'Humanitaire / Solidarité'
    },
    {
        id: 9,
        name: 'Journaux / Annuaires'
    },
    {
        id: 10,
        name: 'Santé'
    },
    {
        id: 11,
        name: 'Social'
    },
    {
        id: 12,
        name: 'Sport'
    }
]

export const _projectCategories = [
    {
        id: 1,
        project: 1,
        category: 5
    },
    {
        id: 2,
        project: 2,
        category: 1
    },
    {
        id: 3,
        project: 2,
        category: 11
    },
    {
        id: 4,
        project: 3,
        category: 8
    },
    {
        id: 5,
        project: 4,
        category: 8
    },
    {
        id: 6,
        project: 5,
        category: 9
    },
    {
        id: 7,
        project: 6,
        category: 8
    }
]

export const _projectCommissionDates = [
    {
        id: 1,
        project: 1,
        commissionDate: 3,
        isFirstEdition: true,
        amountAskedPreviousEdition: 0,
        amountEarnedPreviousEdition: 0,
        amountAsked: 1000,
        amountEarned: 0,
        isValidatedByAdmin: false
    },
    {
        id: 2,
        project: 2,
        commissionDate: 4,
        isFirstEdition: true,
        amountAskedPreviousEdition: 0,
        amountEarnedPreviousEdition: 0,
        amountAsked: 1000,
        amountEarned: 0,
        isValidatedByAdmin: false
    },
    {
        id: 3,
        project: 2,
        commissionDate: 2,
        isFirstEdition: true,
        amountAskedPreviousEdition: 0,
        amountEarnedPreviousEdition: 0,
        amountAsked: 1000,
        amountEarned: 0,
        isValidatedByAdmin: false
    },
    {
        id: 4,
        project: 5,
        commissionDate: 4,
        isFirstEdition: true,
        amountAskedPreviousEdition: 0,
        amountEarnedPreviousEdition: 0,
        amountAsked: 0,
        amountEarned: 0,
        isValidatedByAdmin: false
    },
    {
        id: 5,
        project: 5,
        commissionDate: 3,
        isFirstEdition: true,
        amountAskedPreviousEdition: 0,
        amountEarnedPreviousEdition: 0,
        amountAsked: 0,
        amountEarned: 0,
        isValidatedByAdmin: false
    }
]

export const _documentUploads = [
    {
        id: 1,
        path_file: 'string',
        size: 1000,
        name: 'document',
        uploadDate: '2023-05-02T09:19:50.997Z',
        documentUploadStatus: 'DOCUMENT_REJECTED',
        document: 12,
        user: 0,
        association: 1,
        project: 1
    }
]
