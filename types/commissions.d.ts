export interface Commission {
    id: number,
    name: string,
    acronym: string,
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
    commission: number,
    disable: boolean
}