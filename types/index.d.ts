export type AppTitle = string

/**
 *  HomeCard Model
 *  Card displayed on the home view and redirects to another view.
 *  @params: title, description, imagePath, imageAlt
 */
export interface HomeCard {
    title: string,
    description: string,
    imagePath: string,
    imageAlt: string
}

export type HomeCards = HomeCard[]



