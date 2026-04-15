import {defineStore} from 'pinia'
import type {Content, ContentCode, ContentStore, EditableContent, Logo, Stats} from '#/index'
import {useAxios} from '@/composables/useAxios'

export const useContentStore = defineStore('contentStore', {
    state: (): ContentStore => ({
        content: undefined,
        contents: [],
        logos: [],
        CSSClasses: ['home-section-annuaire', 'home-section-charte', 'home-section-cape'],
        stats: undefined
    }),

    actions: {
        /**
         * It gets the content data from the server
         * Available for the public
         */
        async getContents(isEditable: boolean) {
            const {axiosPublic} = useAxios()
            let url = '/contents/'
            if (isEditable) {
                url += '?is_editable=true'
            }
            this.contents = (await axiosPublic.get<Content[]>(url)).data
        },
        async getContent(id: number) {
            const {axiosPublic} = useAxios()
            const url = `/contents/${id}`
            this.content = (await axiosPublic.get<Content>(url)).data
        },
        async getContentsByCode(codes: ContentCode[]) {
            const {axiosPublic} = useAxios()
            const url = `/contents/?codes=${codes.join(',')}`
            const newContents = (await axiosPublic.get<Content[]>(url)).data
            newContents.forEach(newItem => {
                const index = this.contents.findIndex(c => c.code === newItem.code)
                if (index !== -1) {
                    this.contents[index] = newItem
                } else {
                    this.contents.push(newItem)
                }
            })
        },
        async patchContent(content: EditableContent) {
            const {axiosAuthenticated} = useAxios()
            let dataToPatch = {}
            if (content.header !== this.content?.header) {
                dataToPatch = Object.assign(dataToPatch, {['header']: content.header})
            }
            if (content.body !== this.content?.body) {
                dataToPatch = Object.assign(dataToPatch, {['body']: content.body})
            }
            if (content.footer !== this.content?.footer) {
                dataToPatch = Object.assign(dataToPatch, {['footer']: content.footer})
            }
            if (content.aside !== this.content?.aside) {
                dataToPatch = Object.assign(dataToPatch, {['aside']: content.aside})
            }

            if (Object.entries(dataToPatch).length) {
                this.content = (await axiosAuthenticated.patch(`/contents/${this.content?.id}`, dataToPatch)).data
            }
        },
        async getLogos() {
            if (this.logos.length) return
            const {axiosPublic} = useAxios()
            const url = '/contents/logos'
            this.logos = (await axiosPublic.get<Logo[]>(url)).data
        },

        async getStats() {
            const {axiosPublic} = useAxios()
            const url = '/stats/'
            this.stats = (await axiosPublic.get<Stats>(url)).data
        }
    }
})
