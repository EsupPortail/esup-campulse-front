import type {
  Association,
  AssociationActivityField,
  AssociationFilters,
  AssociationName,
  AssociationNameFilters,
  AssociationUser,
  CreateAssociation,
  UpdateAssociation
} from '#/association'
import {useAxios} from '@/composables/useAxios'
import type {AxiosResponse} from 'axios'
import type {AssociationCharterStatus} from '#/charter'

const modelBaseUrl = '/associations'

export async function getAssociations(filters?: Partial<AssociationFilters>): Promise<Association[]> {
  const {axiosPublic, axiosAuthenticated} = useAxios()
  const instance = filters?.isPublic ? axiosPublic : axiosAuthenticated
  const filterArray: string[] = []
  if (filters?.isPublic) filterArray.push('is_public=true')
  if (filters?.institutions) filterArray.push(`institutions=${filters.institutions.join(',')}`)
  if (filters?.search) filterArray.push(`search=${filters.search}`)
  const filterString: string = filterArray.length ? `?${filterArray.join('&')}` : ''
  return (await instance.get<Association[]>(`${modelBaseUrl}/${filterString}`)).data
}

export async function getAssociationNames(filters?: Partial<AssociationNameFilters>): Promise<AssociationName[]> {
  const {axiosPublic} = useAxios()
  const filterArray: string[] = []
  if (filters?.isPublic) filterArray.push('is_public=true')
  if (filters?.institutions) filterArray.push(`institutions=${filters.institutions.join(',')}`)
  if (filters?.allowNewUsers) filterArray.push('allow_new_users=true')
  if (filters?.isEnabled) filterArray.push('is_enabled=true')
  const filterString: string = filterArray.length ? `?${filterArray.join('&')}` : ''
  return (await axiosPublic.get<AssociationName[]>(`${modelBaseUrl}/names${filterString}`)).data
}

export async function getAssociationDetail(associationId: number, isPublicRequest: boolean): Promise<Association> {
  const {axiosPublic, axiosAuthenticated} = useAxios()
  const instance = isPublicRequest ? axiosPublic : axiosAuthenticated
  return (await instance.get<Association>(`${modelBaseUrl}/${associationId}`)).data
}

export async function createAssociation(newAssociation: CreateAssociation): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.post(`${modelBaseUrl}/`, newAssociation)
}

export async function updateAssociation(associationId: number, data: Partial<Association | UpdateAssociation>): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.patch(`${modelBaseUrl}/${associationId}`, data)
}

export async function updateAssociationCharterStatus(associationId: number, charterStatus: AssociationCharterStatus): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.patch(`${modelBaseUrl}/${associationId}/status`, {charterStatus})
}

export async function deleteAssociation(associationId: number): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.delete(`${modelBaseUrl}/${associationId}`)
}

export async function getAssociationPdfExport(associationId: number): Promise<AxiosResponse> {
  const {axiosAuthenticated} = useAxios()
  return await axiosAuthenticated.get(`${modelBaseUrl}/${associationId}/export`, {responseType: 'arraybuffer'})
}

export async function getAssociationActivityFields(): Promise<AssociationActivityField[]> {
  const {axiosPublic} = useAxios()
  return (await axiosPublic.get<AssociationActivityField[]>(`${modelBaseUrl}/activity_fields`)).data
}

export async function getAssociationUsers(associationId: number): Promise<AssociationUser[]> {
  const {axiosAuthenticated} = useAxios()
  return (await axiosAuthenticated.get<AssociationUser[]>(`${modelBaseUrl}/${associationId}/users`)).data
}

export async function exportAssociations(associations: number[], format: string) {
  const {axiosAuthenticated} = useAxios()
  const url = `${modelBaseUrl}/export?associations=${associations.join(',')}&mode=${format}`
  return await axiosAuthenticated.get(url, {responseType: 'arraybuffer'})
}

export async function updateAssociationLogo(logoData: FormData | object, associationId: number): Promise<string> {
  const {axiosAuthenticated} = useAxios()
  const response = (await axiosAuthenticated.patch(`${modelBaseUrl}/${associationId}`, logoData)).data
  return response.pathLogo
}