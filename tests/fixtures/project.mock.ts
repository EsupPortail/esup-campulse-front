import type {Project} from '#/project'

export const _project: Project = {
    id: 1,
    name: 'Projet associatif',
    plannedStartDate: '2023-10-26T17:30:00+02:00',
    plannedEndDate: '2023-10-26T20:00:00+02:00',
    location: '16 rue René Descartes, 67000 Strasbourg, FRANCE',
    user: null,
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