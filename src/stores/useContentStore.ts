import {defineStore} from 'pinia'

import type {HomeStore} from '#/index'
import i18n from '@/plugins/i18n'

export const useHomeContent = defineStore('homeContent', {
    state: (): HomeStore => ({
        cards: [
            {
                title: i18n.global.t('home.cards.charter.title'),
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', //i18n.global.t('home.cards.charter.description'),
                imagePath: '/images/unistra.jpg',
                imageAlt: i18n.global.t('home.cards.charter.imageAlt'),
                link: '/associations',
                cssClass: 'home-section-annuaire',
                buttonLabel: 'Consulter l\'annuaire',
                infoContent: 'associations enregistrées dans l\'annuaire',
                titleLine1: 'Annuaire',
                titleLine2: 'des associations',
                iconClass: 'bi bi-geo-alt'
            },
            {
                title: i18n.global.t('home.cards.directory.title'),
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', //i18n.global.t('home.cards.directory.description'),
                imagePath: '/images/unistra.jpg',
                imageAlt: i18n.global.t('home.cards.directory.imageAlt'),
                link: '/charter',
                cssClass: 'home-section-charte',
                buttonLabel: 'Espace charte',
                infoContent: 'Dernière mise à jour de la charte le <strong>15/01/2022</strong>',
                titleLine1: 'Charte',
                titleLine2: 'des associations du site Alsace',
                iconClass: 'bi bi-book'
            },
            {
                title: i18n.global.t('home.cards.commission.title'),
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', //i18n.global.t('home.cards.commission.description'),
                imagePath: '/images/unistra.jpg',
                imageAlt: i18n.global.t('home.cards.commission.imageAlt'),
                link: '/commission',
                cssClass: 'home-section-cape',
                buttonLabel: 'Espace CAPE',
                infoContent: 'Prochaine commission :<br /><strong>CAPE Octobre - 10/10/2022</strong>',
                titleLine1: 'CAPE',
                titleLine2: 'Commission d\'Aide aux Projets Étudiants',
                iconClass: 'bi bi-send'
            }
        ],
        banner: {
            title: i18n.global.t('home.banner.title'),
            description: i18n.global.t('home.banner.description'),
            isDisplayed: true
        }
    }),
})
