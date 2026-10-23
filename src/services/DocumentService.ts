import type {Document, DocumentFilters, NewDocument} from '#/document'
import {useAxios} from '@/composables/useAxios'

const modelBaseUrl = '/documents'

export async function getDocuments(filters?: Partial<DocumentFilters>): Promise<Document[]> {
  const {axiosPublic} = useAxios()
  let url = `${modelBaseUrl}/`
  const filterArray: string[] = []
  if (filters?.processTypes?.length) filterArray.push(`process_types=${filters?.processTypes.join(',')}`)
  if (filters?.acronym) filterArray.push(`acronym=${filters?.acronym}`)
  if (filterArray.length) url += `?${filterArray.join('&')}`
  return (await axiosPublic.get<Document[]>(url)).data
}

export async function postDocument(document: NewDocument): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  const formData = new FormData()
  formData.append('name', document.name)
  formData.append('acronym', document.acronym)
  formData.append('pathTemplate', document.file)
  await axiosAuthenticated.post(`${modelBaseUrl}/`, formData)
}

export async function updateDocument(documentId: number, documentName: string, file: File) {
  const {axiosAuthenticated} = useAxios()
  const newDocument = new FormData()
  newDocument.append('name', documentName)
  newDocument.append('pathTemplate', file)
  await axiosAuthenticated.patch(`${modelBaseUrl}/${documentId}`, newDocument)
}

export async function deleteDocument(documentId: number): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.delete(`${modelBaseUrl}/${documentId}`)
}