import type {DocumentUpload, DocumentUploadFilters} from '#/document'
import {useAxios} from '@/composables/useAxios'
import type {AxiosResponse} from 'axios'

const modelBaseUrl = '/documents/uploads'

export async function getProjectFileZip(projectId: number): Promise<AxiosResponse<ArrayBuffer>> {
  const {axiosAuthenticated} = useAxios()
  const url = `${modelBaseUrl}/file?project_id=${projectId}`
  return await axiosAuthenticated.get(url, {responseType: 'arraybuffer'})
}

export async function getDocumentUploads(filters?: Partial<DocumentUploadFilters>): Promise<DocumentUpload[]> {
  const {axiosAuthenticated} = useAxios()
  const filterArray: string[] = []
  let url = `${modelBaseUrl}`
  if (filters?.processTypes?.length) filterArray.push(`process_types=${filters.processTypes.join(',')}`)
  if (filters?.associationId) filterArray.push(`association_id=${filters.associationId}`)
  if (filters?.projectId) filterArray.push(`project_id=${filters.projectId}`)
  if (filters?.userId) filterArray.push(`user_id=${filters.userId}`)
  if (filterArray.length) url += `?${filterArray.join('&')}`
  return (await axiosAuthenticated.get<DocumentUpload[]>(url)).data
}

export async function uploadDocument(data: FormData): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.post(`${modelBaseUrl}`, data)
}

export async function uploadRegistrationDocument(data: FormData): Promise<void> {
  const {axiosPublic} = useAxios()
  await axiosPublic.post(`${modelBaseUrl}/registration`, data)
}

export async function deleteDocumentUpload(documentId: number): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.delete(`${modelBaseUrl}/${documentId}`)
}

export async function getFile(pathFile: string): Promise<AxiosResponse<ArrayBuffer>> {
  const {axiosAuthenticated} = useAxios()
  return await axiosAuthenticated.get(pathFile, {responseType: 'arraybuffer'})
}
