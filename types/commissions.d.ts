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
    isOpenToProjects: boolean
}

export interface SelectCommissionDateLabel {
    value: number,
    label: string,
    commission: number
}

export interface ProjectCommissionFund {
    id: number,
    project: number,
    commissionFund: number,
    isFirstEdition: boolean,
    amountAskedPreviousEdition: number | string,
    amountEarnedPreviousEdition: number | string,
    amountAsked: number | string,
    amountEarned: number | string,
    isValidatedByAdmin: boolean
}
