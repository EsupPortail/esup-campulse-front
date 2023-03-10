export interface Group {
    id: number,
    name: string,
    permissions: string[],
    isPublic: boolean
}

interface SelectGroupLabel {
    value: number,
    label: string,
    disable: boolean,
    commission?: number | null
}
