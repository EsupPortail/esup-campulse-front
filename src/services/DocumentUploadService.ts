import type {DocumentProcessType, DocumentUpload} from '#/document'
import {useAxios} from '@/composables/useAxios'
import type {AxiosResponse} from 'axios'

const modelBaseUrl = '/documents/uploads'

export async function getProjectDocumentUploads(projectId: number): Promise<DocumentUpload[]> {
  const {axiosAuthenticated} = useAxios()
  const url = `${modelBaseUrl}?project_id=${projectId}`
  return (await axiosAuthenticated.get<DocumentUpload[]>(url)).data
}

export async function getProjectFileZip(projectId: number): Promise<AxiosResponse<ArrayBuffer>> {
  const {axiosAuthenticated} = useAxios()
  const url = `${modelBaseUrl}/file?project_id=${projectId}`
  return await axiosAuthenticated.get(url, {responseType: 'arraybuffer'})
}

export async function getUserDocumentUploads(
  userId: number,
  processTypes?: DocumentProcessType[]
): Promise<DocumentUpload[]> {
  const {axiosAuthenticated} = useAxios()
  let url = `${modelBaseUrl}?user_id=${userId}`
  if (processTypes?.length) {
    url += `&process_types=${processTypes.join(',')}`
  }
  return (await axiosAuthenticated.get<DocumentUpload[]>(url)).data
}

export async function getAssociationDocumentUploads(
  associationId: number,
  processTypes?: DocumentProcessType[]
): Promise<DocumentUpload[]> {
  const {axiosAuthenticated} = useAxios()
  let url = `${modelBaseUrl}?association_id=${associationId}`
  if (processTypes?.length) {
    url += `&process_types=${processTypes.join(',')}`
  }
  return (await axiosAuthenticated.get<DocumentUpload[]>(url)).data
}
