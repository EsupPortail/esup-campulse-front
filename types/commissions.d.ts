export interface Commission {
    id: number,
    name: string,
    acronym: string,
    isSite: boolean,
    institution: number
}

export interface CommissionDate {
    id: number,
    submissionDate: string,
    commissionDate: string,
    commission: number
}

export interface SelectCommissionDateLabel {
    value: number,
    label: string,
    commission: number
}
