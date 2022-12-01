import {defineStore} from 'pinia'
import type {HomeStore} from '#/index'
import i18n from '@/plugins/i18n'


export const useHomeContent = defineStore('homeContent', {
    state: (): HomeStore => ({
        cards: [
            {
                title: i18n.global.t("home.cards.charter.title"),
                description: i18n.global.t("home.cards.charter.description"),
                imagePath: "/images/unistra.jpg",
                imageAlt: i18n.global.t("home.cards.charter.imageAlt"),
                link: '/charter'
            },
            {
                title: i18n.global.t("home.cards.directory.title"),
                description: i18n.global.t("home.cards.directory.description"),
                imagePath: "/images/unistra.jpg",
                imageAlt: i18n.global.t("home.cards.directory.imageAlt"),
                link: "/directory"
            },
            {
                title: i18n.global.t("home.cards.commission.title"),
                description: i18n.global.t("home.cards.commission.description"),
                imagePath: "/images/unistra.jpg",
                imageAlt: i18n.global.t("home.cards.commission.imageAlt"),
                link: "/commission"
            }
        ],
        banner: {
            title: i18n.global.t("home.banner.title"),
            description: i18n.global.t("home.banner.description"),
            isDisplayed: true
        }
    }),
})
