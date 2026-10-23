import {defineStore} from 'pinia'
import type {ContentFilters, ContentStore, UpdateContent} from '#/content'
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

    // old = patchContent
    async updateContent(content: UpdateContent) {
      const contentId = this.content!.id
      const dataToPatch: Partial<UpdateContent> = {}
      if (content.header !== this.content?.header) dataToPatch['header'] = content.header
      if (content.body !== this.content?.body) dataToPatch['body'] = content.body
      if (content.footer !== this.content?.footer) dataToPatch['footer'] = content.footer
      if (content.aside !== this.content?.aside) dataToPatch['aside'] = content.aside

      if (Object.entries(dataToPatch).length) {
        this.content = await contentService.updateContent(contentId, dataToPatch)
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
