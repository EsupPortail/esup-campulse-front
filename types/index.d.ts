interface ContentStore {
    contents: Content[],
    logos: Logo[],
    CSSClasses: string[]
}

interface SelectLabel {
    value: number,
    label: string
}

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
    aside: string
}

export interface Logo {
    id: number,
    acronym: string,
    title: string,
    url: string,
    pathLogo: string,
    visible: boolean
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
    'PRIVACY_POLICY'

export interface PageCard {
    to: { name: string },
    btnLabel?: string,
    icon: string,
    text?: string
}
