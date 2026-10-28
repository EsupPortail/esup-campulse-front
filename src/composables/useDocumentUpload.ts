import {ref} from 'vue'
import type {DocumentUpload, ProcessDocument, UploadedProcessDocument} from '#/document'
import {useProjectStore} from '@/stores/useProjectStore'
import useCharters from '@/composables/useCharter'
import {useUserStore} from '@/stores/useUserStore'
import {useProfileStore} from '@/stores/useProfileStore'
import {useDocumentStore} from '@/stores/useDocumentStore'
import * as documentUploadService from '@/services/DocumentUploadService'
import type {AxiosResponse} from 'axios'

const processDocuments = ref<ProcessDocument[]>([])

const documentUploads = ref<UploadedProcessDocument[]>([])

const maxFileSize = 8 * 1048576
const maxTitleLength = 100

async function getFile(pathFile: string): Promise<AxiosResponse<ArrayBuffer>> {
  return await documentUploadService.getFile(pathFile)
}

export default function useDocumentUpload() {

  const projectStore = useProjectStore()
  const userStore = useUserStore()
  const profileStore = useProfileStore()
  const documentStore = useDocumentStore()

  class DocumentUploadClass {
    file: Blob
    association: string
    user: string
    document: string
    project: string

    constructor(file: Blob, associationId: number | null, userId: number | null, documentId: number) {
      this.file = file
      this.association = associationId ? associationId.toString() : ''
      this.user = userId ? userId.toString() : ''
      this.document = documentId.toString()
      this.project = projectStore.project?.id.toString() as string
    }

    formData() {
      const newForm = new FormData()
      newForm.append('pathFile', this.file)
      newForm.append('document', this.document)
      if (this.project) {
        newForm.append('project', this.project)
      }
      if (this.association) newForm.append('association', this.association)
      else newForm.append('user', this.user)
      return newForm
    }
  }

  class RegistrationDocumentUploadClass {
    file: Blob
    user: string
    document: string

    constructor(file: Blob, user: string, document: number) {
      this.file = file
      this.user = user
      this.document = document.toString()
    }

    formData() {
      const newForm = new FormData()
      newForm.append('pathFile', this.file)
      newForm.append('document', this.document)
      newForm.append('user', this.user)
      return newForm
    }
  }

  const initProcessDocuments = (filterByFund?: boolean, funds?: number[]) => {
    processDocuments.value = []
    documentStore.documents.forEach((document) => {
      const initDocument = !filterByFund || !funds?.length || !document.fund || funds.includes(document.fund)
      if (initDocument) {
        processDocuments.value.push({
          document: document.id,
          acronym: document.acronym,
          maxUploads: document.maxUploads,
          description: document.description,
          pathFile: document.maxUploads > 1 ? [] : undefined,
          isRequiredInProcess: document.isRequiredInProcess,
          mimeTypes: document.mimeTypes,
          pathTemplate: document.pathTemplate,
          processType: document.processType,
        })
      }
    })
  }

  function initDocumentUploads(uploads: DocumentUpload[]): void {
    documentUploads.value = []
    const documentIds = new Set(processDocuments.value
      .map((item) => (item.document)))
    uploads.forEach((item) => {
      if (!documentIds.has(item.document)) return
      documentUploads.value.push({
        id: item.id as number,
        document: item.document,
        pathFile: import.meta.env.VITE_APP_BASE_URL + item.pathFile as string,
        name: item.name as string
      })
    })
  }

  function initProjectDocumentUploads() {
    initDocumentUploads(projectStore.projectDocuments)
  }

  function initCharterDocumentUploads() {
    const {charterDocumentUploads} = useCharters()
    initDocumentUploads(charterDocumentUploads.value)
  }

  function initUserDocumentUploads() {
    initDocumentUploads(userStore.userDocuments)
  }

  function initProfileDocumentUploads() {
    initDocumentUploads(profileStore.userDocuments)
  }

  async function uploadDocuments(associationId: number | null, user: number | null) {
    const promises: Promise<void>[] = []

    for (const document of processDocuments.value) {
      if (!document.pathFile) continue

      const formData = (file: Blob) => {
        const documentUpload = new DocumentUploadClass(file, associationId, user, document.document as number)
        return documentUpload.formData()
      }

      if (document.maxUploads > 1) {
        const files = document.pathFile as Blob[] | []
        for (const file of files) {
          promises.push(documentUploadService.uploadDocument(formData(file)))
        }
      } else {
        const file = document.pathFile as Blob
        promises.push(documentUploadService.uploadDocument(formData(file)))
      }
    }

    await Promise.all(promises)
  }

  async function uploadRegistrationDocuments(user: string) {
    const promises: Promise<void>[] = []

    for (const document of processDocuments.value) {

      if (!document.pathFile) return

      const file = document.pathFile as Blob
      const documentUpload = new RegistrationDocumentUploadClass(file, user, document.document as number)
      const documentData = documentUpload.formData()
      promises.push(documentUploadService.uploadRegistrationDocument(documentData))
    }

    await Promise.all(promises)
  }

  async function deleteDocumentUpload(documentId: number): Promise<void> {
    await documentUploadService.deleteDocumentUpload(documentId)
    const documentIndex = documentUploads.value.findIndex(obj => obj.id === documentId)
    documentUploads.value.splice(documentIndex, 1)
  }

  // old = createUploadedFileLink
  async function createFileLink(pathFile: string, name: string) {
    const response = await getFile(pathFile)
    const contentType = response.headers['content-type']
    const blob = new Blob([response.data], {type: contentType})
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = name
    link.click()
    URL.revokeObjectURL(url)
  }

  return {
    processDocuments,
    initProcessDocuments,
    uploadDocuments,
    initProjectDocumentUploads,
    documentUploads,
    deleteDocumentUpload,
    getFile,
    DocumentUploadClass,
    RegistrationDocumentUploadClass,
    createFileLink,
    initCharterDocumentUploads,
    initUserDocumentUploads,
    initProfileDocumentUploads,
    maxFileSize,
    maxTitleLength,
    uploadRegistrationDocuments
  }
}
