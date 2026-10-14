interface ContentStore {
    content: Content | undefined,
    contents: Content[],
    logos: Logo[],
    CSSClasses: string[],
    stats: Stats | undefined
}

export interface BaseSelectLabel<TValue extends string | number = string | number> {
    value: TValue;
    label: string;
}

export type SelectLabel = BaseSelectLabel<string | number>;

export interface Error {
    status: number
    data: {
        error: string
    }
}

export interface PasswordChecker {
    valid: boolean,
    score: number
}

export interface Content {
    id: number,
    code: ContentCode,
    label: string,
    header: string,
    body: string,
    footer: string,
    aside: string,
    isEditable: boolean
}

export interface EditableContent {
    label: string,
    header: string,
    body: string,
    footer: string,
    aside: string
}

export interface Logo {
    id: number,
    acronym: string,
    title: string,
    url: string,
    pathLogo: string,
    row: number,
    column: number,
    visible: boolean
}

export interface Stats {
    associationCount: number,
    nextCommissionDate: string,
    lastCharterUpdate: string
}

type ContentCode =
    'HOME_ASSOCIATION' |
    'HOME_CHARTER' |
    'HOME_PROJECT' |
    'HOME_INFO' |
    'ABOUT_APP' |
    'ABOUT_FUNDING' |
    'ABOUT_PARTNERSHIP' |
    'ABOUT_ASSOCIATION' |
    'ABOUT_CHARTER' |
    'ABOUT_PROJECT' |
    'CONTACT_INFO' |
    'CONTACT_LIST' |
    'ASSOCIATION_HOME_FIRST_BLOCK' |
    'CHARTER_HOME_FIRST_BLOCK' |
    'CHARTER_HOME_SECOND_BLOCK' |
    'CHARTER_HOME_THIRD_BLOCK' |
    'CHARTER_HOME_ACTION_VALIDATE_CHARTERS' |
    'CHARTER_HOME_ACTION_MANAGE_DOCUMENTS' |
    'CHARTER_HOME_ACTION_SIGN_CHARTERS' |
    'CHARTER_HOME_ACTION_DOWNLOAD_DOCUMENTS' |
    'COMMISSION_HOME_FIRST_BLOCK' |
    'COMMISSION_HOME_SECOND_BLOCK' |
    'COMMISSION_HOME_ACTION_MANAGE_PROJECTS' |
    'COMMISSION_HOME_ACTION_MANAGE_ARCHIVE' |
    'COMMISSION_HOME_ACTION_MANAGE_COMMISSIONS' |
    'COMMISSION_HOME_ACTION_SUBMIT_PROJECT' |
    'COMMISSION_HOME_ACTION_DOWNLOAD_DOCUMENTS' |
    'SITE_FOOTER' |
    'LEGAL_NOTICE' |
    'PRIVACY_POLICY' |
    'ACCESSIBILITY_DECLARATION' |
    'MULTIANNUAL_ACCESSIBILITY_PLAN' |
    ''

export interface PageCard {
    to: { name: string },
    btnLabel?: string,
    icon: string,
    text?: string
}

export interface Tab {
    label: string,
    slotName: string,
    icon?: string,
    permission?: string,
    disable?: boolean,
    hasUnsavedData?: boolean
}

export interface PaginatedList<T> {
    count: number,
    totalPages: number,
    currentPage: number,
    range:
        { start: number, end: number },
    next: string | null,
    previous: string | null,
    results: T[]
}

export type TargetPage = 'first' | 'last' | 'previous' | 'next'
