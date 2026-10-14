import type {Association, EditedAssociation, NewAssociation} from '#/association'
import {useAxios} from '@/composables/useAxios'

const modelBaseUrl = '/associations/'

export async function createAssociation(newAssociation: NewAssociation): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.post(modelBaseUrl, newAssociation)
}

export async function updateAssociation(associationId: number, data: Partial<Association | EditedAssociation>): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  const url = `${modelBaseUrl}${associationId.toString()}`
  await axiosAuthenticated.patch(url, data)
}

export async function getAssociationPdfExport(associationId: number): Promise<ArrayBuffer> {
  const {axiosAuthenticated} = useAxios()
  return await axiosAuthenticated.get(`${modelBaseUrl}${associationId.toString()}/export`, {responseType: 'arraybuffer'})
}