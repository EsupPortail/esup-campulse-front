export type HomeTitle = string

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
    link: string
}

export type HomeCards = HomeCard[]


export interface HomeBanner {
    title: string,
    description: string
}

export type HomeBannerView = HomeBanner