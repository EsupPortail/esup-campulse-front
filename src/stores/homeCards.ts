import { defineStore } from 'pinia'

export const useHomeCards = defineStore({
    id: 'homeCards',
    state: () => ([
        {
            title: "Charte des associations du site Alsace",
            description: "Lorem ipsum description",
            imagePath: "@/assets/logo.svg",
            imageAlt: "Logo charte"
        },
        {
            title: "Annuaire des associations",
            description: "Lorem ipsum description",
            imagePath: "@/assets/logo.svg",
            imageAlt: "Logo annuaire"
        },
        {
            title: "Commission d'aide aux projets étudiants",
            description: "Lorem ipsum description",
            imagePath: "@/assets/logo.svg",
            imageAlt: "Logo commissions"
        }
    ])
})
