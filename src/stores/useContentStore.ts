import {defineStore} from 'pinia'

import type {AboutStore, ContentStore} from '#/index'
import i18n from '@/plugins/i18n'
import {useAxios} from '@/composables/useAxios'

export const useContentStore = defineStore('contentStore', {
    state: (): ContentStore => ({
        cards: [
            {
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', //i18n.global.t('home.cards.charter.description'),
                link: '/associations',
                cssClass: 'home-section-annuaire',
                buttonLabel: 'Consulter l\'annuaire',
                infoContent: 'associations enregistrées dans l\'annuaire',
                titleLine1: 'Annuaire',
                titleLine2: 'des associations',
                iconClass: 'bi bi-geo-alt'
            },
            {
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', //i18n.global.t('home.cards.directory.description'),
                link: '/charter',
                cssClass: 'home-section-charte',
                buttonLabel: 'Espace charte',
                infoContent: 'Dernière mise à jour de la charte le <strong>15/01/2022</strong>',
                titleLine1: 'Charte',
                titleLine2: 'des associations du site Alsace',
                iconClass: 'bi bi-book'
            },
            {
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', //i18n.global.t('home.cards.commission.description'),
                link: '/commission',
                cssClass: 'home-section-cape',
                buttonLabel: 'Espace CAPE',
                infoContent: 'Prochaine commission :<br>',
                titleLine1: 'CAPE',
                titleLine2: 'Commission d\'Aide aux Projets Étudiants',
                iconClass: 'bi bi-send'
            }
        ],
        banner: {
            title: i18n.global.t('home.banner.title'),
            description: i18n.global.t('home.banner.description'),
            isDisplayed: true
        },
        about: [],
        contact: []
    }),

    actions: {
        /**
         * It gets the content data from the server
         * Available for the public
         */
        async getContent() {
            if (!this.about.length) {
                const {axiosPublic} = useAxios()
                const url = '/contents/'
                this.about = (await axiosPublic.get<AboutStore[]>(url)).data
            }
        }
    }
})