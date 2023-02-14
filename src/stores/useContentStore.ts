import {defineStore} from 'pinia'

import type {HomeStore} from '#/index'
import i18n from '@/plugins/i18n'

const tPrefixHome = "home.cards."
export const useHomeContent = defineStore('homeContent', {
    state: (): HomeStore => ({
        cards: [
            {
                title: i18n.global.t(tPrefixHome + 'charter.title'),
                description: i18n.global.t(tPrefixHome + 'charter.description'),
                imagePath: '/images/unistra.jpg',
                imageAlt: i18n.global.t(tPrefixHome + 'charter.imageAlt'),
                link: '/charter'
            },
            {
                title: i18n.global.t(tPrefixHome + 'directory.title'),
                description: i18n.global.t(tPrefixHome + 'directory.description'),
                imagePath: '/images/unistra.jpg',
                imageAlt: i18n.global.t(tPrefixHome + 'directory.imageAlt'),
                link: '/associations'
            },
            {
                title: i18n.global.t(tPrefixHome + 'commission.title'),
                description: i18n.global.t(tPrefixHome + 'commission.description'),
                imagePath: '/images/unistra.jpg',
                imageAlt: i18n.global.t(tPrefixHome + 'commission.imageAlt'),
                link: '/commission'
            }
        ],
        banner: {
            title: i18n.global.t('home.banner.title'),
            description: i18n.global.t('home.banner.description'),
            isDisplayed: true
        }
    }),
})
