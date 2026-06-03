export interface Fund {
    id: number,
    name: string,
    acronym: string,
    isSite: boolean,
    institution: number
}

export interface CommissionFund {
    id: number,
    commission: number,
    fund: number
}

export interface Commission {
    id: number,
    submissionDate: string,
    commissionDate: string,
    isOpenToProjects: boolean,
    name: string
}

export interface UpdateCommission {
    id: number,
    oldName: string,
    newName: string,
    oldCommissionDate: string,
    newCommissionDate: string,
    oldSubmissionDate: string,
    newSubmissionDate: string,
    datesAreLegal: boolean,
    oldFunds: number[],
    newFunds: number[],
    oldIsOpenToProjects: boolean,
    newIsOpenToProjects: boolean,
    open: boolean
}

export interface NewCommission {
    commissionDate: string,
    submissionDate: string,
    datesAreLegal: boolean,
    commission: number | null,
    funds: number[],
    isOpenToProjects: boolean,
    name: string
}

interface SelectLabelFund {
    value: number,
    label: string,
    fund?: number
}
