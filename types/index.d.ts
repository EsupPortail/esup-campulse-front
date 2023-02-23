/**
 *  HomeCard Model
 *  Card displayed on the home view and redirects to another view.
 *  @params: title, description, imagePath, imageAlt
 */
export interface HomeCard {
    title: string,
    description: string,
    imagePath: string,
    imageAlt: string,
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

interface HomeStore {
    cards: HomeCards,
    banner: HomeBanner
}

interface SelectLabel {
    value: number,
    label: string,
    disable: boolean
}
