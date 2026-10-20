import {defineStore} from 'pinia'
import type {ContentFilters, ContentStore, EditableContent} from '#/content'
import {useAxios} from '@/composables/useAxios'
import * as contentService from '@/services/ContentService'
import * as statService from '@/services/StatService'

export const useContentStore = defineStore('contentStore', {
  state: (): ContentStore => ({
    content: undefined,
    contents: [],
    logos: [],
    CSSClasses: ['home-section-annuaire', 'home-section-charte', 'home-section-cape'],
    stats: undefined
  }),

  actions: {
    async getContents(filters?: ContentFilters): Promise<void> {
      const newItems = await contentService.getContents(filters)
      const combined = [...this.contents, ...newItems]
      this.contents = Array.from(
        new Map(combined.map(item => [item.id, item])).values()
      )
    },

    async getContent(contentId: number) {
      this.content = await contentService.getContent(contentId)
    },

    // todo refactor with service
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
      this.logos = await contentService.getLogos()
    },

    async getStats() {
      this.stats = await statService.getStats()
    }
  }
})
