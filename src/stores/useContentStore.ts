import { defineStore } from 'pinia'

import type { HomeStore } from '#/index'
import i18n from '@/plugins/i18n'

export const useHomeContent = defineStore('homeContent', {
    state: (): HomeStore => ({
        cards: [
            {
                title: '<h1>Annuaire</h1><h2>des associations</h2>', //i18n.global.t('home.cards.charter.title'),
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', //i18n.global.t('home.cards.charter.description'),
                imagePath: '/images/unistra.jpg',
                imageAlt: i18n.global.t('home.cards.charter.imageAlt'),
                link: '/charter',
                cssClass: 'home-section-annuaire',
                buttonLabel: 'Consulter l\'annuaire'
            },
            {
                title: '<h1>Charte</h1><h2>des associations du site Alsace</h2>', //i18n.global.t('home.cards.directory.title'),
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', //i18n.global.t('home.cards.directory.description'),
                imagePath: '/images/unistra.jpg',
                imageAlt: i18n.global.t('home.cards.directory.imageAlt'),
                link: '/associations',
                cssClass: 'home-section-charte',
                buttonLabel: 'Espace charte'
            },
            {
                title: '<h1>CAPE</h1><h2>Commission d\'Aide aux Projets Étudiants</h2>', //i18n.global.t('home.cards.commission.title'),
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', //i18n.global.t('home.cards.commission.description'),
                imagePath: '/images/unistra.jpg',
                imageAlt: i18n.global.t('home.cards.commission.imageAlt'),
                link: '/commission',
                cssClass: 'home-section-cape',
                buttonLabel: 'Espace CAPE'
            }
        ],
        banner: {
            title: i18n.global.t('home.banner.title'),
            description: i18n.global.t('home.banner.description'),
            isDisplayed: true
        }
    }),
})
