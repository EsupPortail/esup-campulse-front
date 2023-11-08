export interface Group {
    id: number,
    name: GroupName,
    permissions: string[],
    isPublic: boolean
}

export type GroupName =
    'MANAGER_GENERAL'
    | 'MANAGER_INSTITUTION'
    | 'MANAGER_MISC'
    | 'MEMBER_FUND'
    | 'STUDENT_INSTITUTION'
    | 'STUDENT_MISC'

export interface GroupCodeLiteralName {
    codeName: GroupName,
    literalName: string
}

interface SelectGroupLabel {
    value: number,
    label: string,
    disable?: boolean,
    fund?: number | null
}
