import {defineStore} from 'pinia'
import * as documentService from '@/services/DocumentService'
import type {DocumentProcessType, DocumentStore} from '#/document'

export const useDocumentStore = defineStore('documentStore', {
  state: (): DocumentStore => ({
    documents: []
  }),

  getters: {
    //
  },

  actions: {
    async getLibraryDocuments(): Promise<void> {
      const processTypes: DocumentProcessType[] = ['CHARTER_ASSOCIATION', 'CHARTER_PROJECT_FUND', 'DOCUMENT_PROJECT', 'NO_PROCESS']
      this.documents = await documentService.getDocuments({processTypes})
    },

    async getDocumentByAcronym(acronym: string): Promise<void> {
      this.documents = await documentService.getDocuments({acronym})
    },

    async getStudentCertificate(): Promise<void> {
      this.documents = await documentService.getDocuments({processTypes: ['DOCUMENT_USER']})
    },
  }
})
