import type {
  Project,
  ProjectBudget,
  ProjectCommissionFundBase,
  ProjectGoals,
  ProjectInfos,
  ProjectListItem,
  ProjectReview,
} from '#/project'
import type {DocumentUpload} from '#/document'
import {_currentYear} from './date.mock'
import {_userAssociation, _userAssociationDetail} from '~/fixtures/user.mock'
import {_commissions} from '~/fixtures/commission.mock'

export const _project: Project = {
  id: 1,
  name: 'Projet associatif',
  plannedStartDate: '2023-10-26T17:30:00+02:00',
  plannedEndDate: '2023-10-26T20:00:00+02:00',
  plannedLocation: '16 rue René Descartes, 67000 Strasbourg, FRANCE',
  user: null,
  association: _userAssociationDetail,
  associationUser: _userAssociation,
  commission: _commissions[1],
  projectCommissionFunds: [],
  reviewOverdueDays: 0,
  categories: [{
    id: 1,
    name: 'category'
  }],
  partnerAssociation: 'Personne',
  budgetPreviousEdition: 1000,
  targetAudience: 'Une centaine d\'étudiants.',
  amountStudentsAudience: 90,
  amountAllAudience: 100,
  ticketPrice: 10,
  studentTicketPrice: 0,
  individualCost: 15,
  goals: 'Ceci sont les objectifs de mon projet en tant que porteur individuel. Par exemple rassembler les étudiants autour d\'une cause commune.',
  summary: 'Récapitulatif simple du projet.',
  plannedActivities: 'Conférence autour du thème des associations, petit déjeuner, échange avec les participants sur le sujet.',
  preventionSafety: 'Actions de sécurité et de préventions comme filtrage de l\'entrée selon les tickets par exemple.',
  marketingCampaign: 'Des messages sur les réseaux sociaux, des affiches et quelques tracts.',
  sustainableDevelopment: 'Actions en rapport avec le DDRS (Développement Durable et Responsabilité Sociétale)',
  projectStatus: 'PROJECT_DRAFT',
  creationDate: '2023-06-01',
  editionDate: '2023-06-02',
  processingDate: '2023-06-02',
  manualIdentifier: '20230001',
  budgetFile: 'file',
}

export const _projects: ProjectListItem[] = [
  {
    id: 1,
    name: 'Projet associatif de porteur de projet individuel',
    association: null,
    user: {id: 8, firstName: 'Alice', lastName: 'Martin'},
    editionDate: '2023-03-15T11:18:47+01:00',
    projectStatus: 'PROJECT_DRAFT',
    associationUser: null,
    commission: _commissions[1],
    plannedStartDate: '2023-09-01',
    plannedEndDate: '2023-09-30',
    manualIdentifier: '2023090001',
    budgetFile: '',
    reviewOverdueDays: 0
  },
  {
    id: 2,
    name: 'Projet associatif porté par une association',
    association: _userAssociationDetail,
    user: null,
    editionDate: '2023-03-14T11:18:47+01:00',
    projectStatus: 'PROJECT_DRAFT',
    associationUser: _userAssociation,
    commission: _commissions[1],
    plannedStartDate: '2023-09-01',
    plannedEndDate: '2023-09-30',
    manualIdentifier: '2023090002',
    budgetFile: '',
    reviewOverdueDays: 0
  },
  {
    id: 3,
    name: 'Festival des cultures du monde',
    association: {..._userAssociationDetail, id: 3, name: 'OCTANT', acronym: 'OCTANT'},
    user: null,
    editionDate: '2023-04-26T14:27:42.938670+02:00',
    projectStatus: 'PROJECT_PROCESSING',
    associationUser: {..._userAssociation, id: 3},
    commission: _commissions[3],
    plannedStartDate: '2023-10-01',
    plannedEndDate: '2023-10-15',
    manualIdentifier: '2023090003',
    budgetFile: '',
    reviewOverdueDays: 2
  },
  {
    id: 4,
    name: 'Semaine de la sciences',
    association: {..._userAssociationDetail, id: 4, name: 'OPALINE', acronym: 'OPALINE'},
    user: null,
    editionDate: '2023-04-26T14:28:59.408076+02:00',
    projectStatus: 'PROJECT_VALIDATED',
    associationUser: {..._userAssociation, id: 4},
    commission: _commissions[2],
    plannedStartDate: '2023-11-01',
    plannedEndDate: '2023-11-07',
    manualIdentifier: '2023090004',
    budgetFile: '',
    reviewOverdueDays: 0
  },
  {
    id: 5,
    name: 'Marathon solidaire',
    association: {..._userAssociationDetail, id: 5, name: 'CAMPULSE', acronym: 'CAMPULSE'},
    user: null,
    editionDate: '2023-04-28T11:06:52.944326+02:00',
    projectStatus: 'PROJECT_REJECTED',
    associationUser: {..._userAssociation, id: 5},
    commission: _commissions[1],
    plannedStartDate: '2023-12-01',
    plannedEndDate: '2023-12-02',
    manualIdentifier: '2023090005',
    budgetFile: '',
    reviewOverdueDays: 5
  },
  {
    id: 6,
    name: 'Atelier de sensibilisation au développement durable',
    association: {..._userAssociationDetail, id: 6, name: 'LUCIE', acronym: 'LUCIE'},
    user: null,
    editionDate: '2023-04-28T11:07:42.336557+02:00',
    projectStatus: 'PROJECT_DRAFT',
    associationUser: {..._userAssociation, id: 6},
    commission: _commissions[2],
    plannedStartDate: '2023-10-10',
    plannedEndDate: '2023-10-12',
    manualIdentifier: '2023090006',
    budgetFile: '',
    reviewOverdueDays: 1
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

export const _projectCommissionFunds: ProjectCommissionFundBase[] = [
  {
    id: 1,
    project: 1,
    commissionFund: 1,
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
    commissionFund: 2,
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
    commissionFund: 3,
    isFirstEdition: true,
    amountAskedPreviousEdition: 0,
    amountEarnedPreviousEdition: 0,
    amountAsked: 1000,
    amountEarned: 0,
    isValidatedByAdmin: false
  }
]

export const _updatedProjectCommissionFunds: ProjectCommissionFundBase[] = [
  {
    id: 1,
    project: 1,
    commissionFund: 1,
    isFirstEdition: true,
    amountAskedPreviousEdition: 100,
    amountEarnedPreviousEdition: 100,
    amountAsked: 200,
    amountEarned: 0,
    isValidatedByAdmin: false
  },
  {
    id: 2,
    project: 2,
    commissionFund: 2,
    isFirstEdition: true,
    amountAskedPreviousEdition: 300,
    amountEarnedPreviousEdition: 300,
    amountAsked: 500,
    amountEarned: 0,
    isValidatedByAdmin: false
  },
  {
    id: 3,
    project: 2,
    commissionFund: 4,
    isFirstEdition: true,
    amountAskedPreviousEdition: 500,
    amountEarnedPreviousEdition: 500,
    amountAsked: 1500,
    amountEarned: 0,
    isValidatedByAdmin: false
  }
]

export const _documentUploads: DocumentUpload[] = [
  {
    id: 1,
    uploadDate: '2023-01-01',
    pathFile: 'https://plana.unistra.fr',
    size: 1024,
    validatedDate: '2023-01-01',
    comment: '',
    document: 1,
    user: null,
    association: 1,
    project: null,
    name: 'charte-site-alsace.fr',
    calculatedExpirationDate: '2024-01-01'
  },
  {
    id: 2,
    uploadDate: '2023-01-01',
    pathFile: 'https://plana.unistra.fr',
    size: 2048,
    validatedDate: '2023-01-01',
    comment: '',
    document: 2,
    user: null,
    association: 1,
    project: null,
    name: 'charte-rgpd-site-alsace.fr',
    calculatedExpirationDate: '2024-01-01'
  },
  {
    id: 3,
    uploadDate: '2023-01-01',
    pathFile: 'https://plana.unistra.fr',
    size: 3072,
    validatedDate: [_currentYear, '01', '01'].join('-'),
    comment: '',
    document: 3,
    user: null,
    association: 1,
    project: null,
    name: 'charte-fsdie.fr',
    calculatedExpirationDate: null
  }
]

export const _projectBasicInfos: ProjectInfos = {
  name: 'Projet test',
  plannedStartDate: '2023-06-15',
  plannedEndDate: '2023-06-15',
  plannedLocation: 'Strasbourg',
  user: null,
  association: null,
  associationUser: null,
  partnerAssociation: 'Personne',
}

export const _projectBudget: ProjectBudget = {
  budgetPreviousEdition: 100,
  targetAudience: 'Tout le monde',
  amountStudentsAudience: 50,
  amountAllAudience: 60,
  ticketPrice: 2,
  studentTicketPrice: 1,
  individualCost: 5
}

export const _projectGoals: ProjectGoals = {
  goals: 'Objectifs',
  summary: 'Résumé',
  plannedActivities: 'Activités',
  preventionSafety: 'Sécurité',
  marketingCampaign: 'Communication',
  sustainableDevelopment: 'Développement durable',
}

export const _projectReview: ProjectReview = {
  id: 1,
  name: 'Review',
  user: null,
  association: 1,
  associationUser: null,
  outcome: 300,
  income: 200,
  plannedStartDate: '2023-07-20',
  plannedEndDate: '2023-07-22',
  plannedLocation: 'Strasbourg',
  commissions: _commissions,
  creationDate: '2023-06-01',
  editionDate: '2023-06-02',
  processingDate: '2023-06-03',
  realStartDate: '2023-07-21',
  realEndDate: '2023-07-22',
  realLocation: 'Strasbourg',
  review: 'Everything went well.',
  impactStudents: 'Amazing.',
  description: 'A project for students.',
  difficulties: 'The weather was hot.',
  improvements: 'Need more parasols and free water.'
}