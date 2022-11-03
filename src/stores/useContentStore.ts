import { defineStore } from 'pinia'
import type { HomeCards } from '#/index'
import type { HomeBannerView } from "#/index"

// Homepage cards

interface HomeCardsStore {
    cards: HomeCards
}

export const useHomeCards = defineStore('homeCards', {
    state: (): HomeCardsStore => ({
        cards: [
            {
                title: "Charte des associations du site Alsace",
                description: "Lorem ipsum description",
                imagePath: "src/assets/unistra.jpg",
                imageAlt: "Logo charte",
                link: '/charte'
            },
            {
                title: "Annuaire des associations",
                description: "Lorem ipsum description",
                imagePath: "src/assets/unistra.jpg",
                imageAlt: "Logo annuaire",
                link: "/annuaire"
            },
            {
                title: "Commission d'aide aux projets étudiants",
                description: "Lorem ipsum description",
                imagePath: "src/assets/unistra.jpg",
                imageAlt: "Logo commissions",
                link: "/cape"
            }
        ]
    })
})

// Homepage banner

interface HomeBannerStore {
    banner: HomeBannerView
}

export const useHomeBanner = defineStore('homeBanner', {
    state: (): HomeBannerStore => ({
        banner: {
            title: 'INFORMATIONS: Commission de CAPE le 10 décembre 2022',
            description: "Porteur de projet ou association, vous serez inviter à présenter votre projet",
            isDisplayed: true
        }
    })
})
