import { defineStore } from 'pinia'
import type { HomeCards } from '#/index'

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
