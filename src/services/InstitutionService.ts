import {useAxios} from '@/composables/useAxios'
import type {Institution, InstitutionComponent} from '#/institution'

const modelBaseUrl = '/institutions'

export async function getInstitutions(): Promise<Institution[]> {
  const {axiosPublic} = useAxios()
  return (await axiosPublic.get<Institution[]>(`${modelBaseUrl}/`)).data
}

export async function getInstitutionComponents(): Promise<InstitutionComponent[]> {
  const {axiosPublic} = useAxios()
  return (await axiosPublic.get<InstitutionComponent[]>(`${modelBaseUrl}/institution_components`)).data
}