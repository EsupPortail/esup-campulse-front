/**
 *  HomeCard Model
 *  Card displayed on the home view and redirects to another view.
 *  @params: title, description, imagePath, imageAlt
 */
export interface HomeCard {
    description: string,
    link: string,
    cssClass: string,
    buttonLabel: string,
    infoContent: string,
    titleLine1: string,
    titleLine2: string,
    iconClass: string
}

export type HomeCards = HomeCard[]

export interface HomeBanner {
    title: string,
    description: string,
    isDisplayed: boolean
}

interface ContentStore {
    cards: HomeCards,
    banner: HomeBanner,
    about: AboutStore[],
    contact: ContactStore[],
    home: HomeStore[]
}

interface SelectLabel {
    value: number,
    label: string
}

export interface PasswordChecker {
    valid: boolean,
    score: number
}

interface PasswordCheckerTest {
    valid: boolean,
    message: string,
    additionalMessage: string
}

export interface AboutStore {
    id: number,
    code: contentCode,
    label: string,
    header: string,
    body: string,
    footer: string
}

export interface ContactStore {
    id: number,
    code: contentCode,
    label: string,
    header: string,
    body: string,
    footer: string
}

export interface HomeStore {
    id: number,
    code: contentCode,
    label: string,
    header: string,
    body: string,
    footer: string
}

type contentCode =
    'HOME_ASSOCIATION' |
    'HOME_CHARTER' |
    'HOME_PROJECT' |
    'HOME_INFO' |
    'ABOUT_APP' |
    'ABOUT_FUNDING' |
    'ABOUT_PARTNERSHIP' |
    'CONTACT_INFO' |
    'CONTACT_LIST'

export interface PageCard {
    to: { name: string },
    btnLabel: string,
    icon: string,
    text: string
}
