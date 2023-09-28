import {defineStore} from 'pinia'
import type {Content, ContentCode, ContentStore, Logo} from '#/index'
import {useAxios} from '@/composables/useAxios'

export const useContentStore = defineStore('contentStore', {
    state: (): ContentStore => ({
        contents: [],
        logos: [],
        CSSClasses: ['home-section-annuaire', 'home-section-charte', 'home-section-cape']
    }),

    actions: {
        /**
         * It gets the content data from the server
         * Available for the public
         */
        async getContents() {
            const {axiosPublic} = useAxios()
            const url = '/contents/'
            this.contents = (await axiosPublic.get<Content[]>(url)).data
        },
        async getContentsByCode(codes: ContentCode[]) {
            const {axiosPublic} = useAxios()
            this.contents = []
            for (const code of codes) {
                const url = `/contents/?code=${code}`
                const content = (await axiosPublic.get<Content[]>(url)).data[0]
                this.contents.push(content)
            }
        },
        async getLogos() {
            const {axiosPublic} = useAxios()
            const url = '/contents/logos'
            this.logos = (await axiosPublic.get<Logo[]>(url)).data
        },
    }
})
