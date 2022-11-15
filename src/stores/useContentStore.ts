import { defineStore } from 'pinia'
import type { HomeCards, HomeBannerView } from '#/index'

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
                link: '/charter'
            },
            {
                title: "Annuaire des associations",
                description: "Lorem ipsum description",
                imagePath: "src/assets/unistra.jpg",
                imageAlt: "Logo annuaire",
                link: "/directory"
            },
            {
                title: "Commission d'aide aux projets étudiants",
                description: "Lorem ipsum description",
                imagePath: "src/assets/unistra.jpg",
                imageAlt: "Logo commissions",
                link: "/commission"
            }
        ]
    }),
})

// Homepage banner

interface HomeBannerStore {
    banner: HomeBannerView
}

export const useHomeBanner = defineStore('homeBanner', {
    state: (): HomeBannerStore => ({
        banner: {
            title: 'INFORMATIONS: Commission de CAPE le 10 décembre 2022',
            description: "Porteur de projet ou association, vous serez invité à présenter votre projet",
            isDisplayed: true
        }
    })
})
