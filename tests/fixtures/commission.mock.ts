import type {Commission, Fund} from '#/commission'

export const _funds: Fund[] = [
  {
    id: 1,
    name: 'Fonds de Solidarité et de Développement des Initiatives Étudiantes',
    acronym: 'FSDIE',
    isSite: true,
    institution: 1
  },
  {
    id: 2,
    name: 'Initiative d\'Excellence « Creative Thinkers »',
    acronym: 'IdEx',
    isSite: true,
    institution: 1
  },
  {
    id: 3,
    name: 'Culture-ActionS',
    acronym: 'Culture-ActionS',
    isSite: false,
    institution: 3
  }
]

export const _commissions: Commission[] = [
  {
    id: 4,
    submissionDate: '1990-01-01',
    commissionDate: '1990-01-30',
    editionDate: '1990-01-01',
    isOpenToProjects: false,
    name: 'Commission du passé',
    standbyProjectsCount: 0,
    processingProjectsCount: 0,
    submittedProjectsCount: 0,
    overdueReviewCount: 0,
    funds: [_funds[2]]
  },
  {
    id: 1,
    submissionDate: '2099-10-06',
    commissionDate: '2099-10-20',
    editionDate: '2099-09-01',
    isOpenToProjects: true,
    name: 'Commission numéro 1',
    standbyProjectsCount: 2,
    processingProjectsCount: 3,
    submittedProjectsCount: 5,
    overdueReviewCount: 1,
    funds: [_funds[0], _funds[1], _funds[2]]
  },
  {
    id: 3,
    submissionDate: '2099-10-07',
    commissionDate: '2099-10-21',
    editionDate: '2099-09-01',
    isOpenToProjects: true,
    name: 'Commission de rentrée d\'octobre 2099',
    standbyProjectsCount: 1,
    processingProjectsCount: 2,
    submittedProjectsCount: 4,
    overdueReviewCount: 0,
    funds: [_funds[2]]
  },
  {
    id: 2,
    submissionDate: '2099-10-08',
    commissionDate: '2099-10-22',
    editionDate: '2099-09-01',
    isOpenToProjects: true,
    name: 'Une autre commission de rentrée d\'octobre 2099',
    standbyProjectsCount: 0,
    processingProjectsCount: 1,
    submittedProjectsCount: 3,
    overdueReviewCount: 0,
    funds: [_funds[0]]
  }
]

export const _commissionFunds = [
  {
    id: 1,
    commission: 1,
    fund: 1
  },
  {
    id: 2,
    commission: 1,
    fund: 2
  },
  {
    id: 3,
    commission: 1,
    fund: 3
  },
  {
    id: 4,
    commission: 2,
    fund: 1
  },
  {
    id: 5,
    commission: 3,
    fund: 3
  },
  {
    id: 6,
    commission: 4,
    fund: 3
  }
]