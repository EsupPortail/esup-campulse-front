import {useAxios} from '@/composables/useAxios'
import type {Group} from '#/group'

const modelBaseUrl = '/groups'

export async function getGroups(): Promise<Group[]> {
  const {axiosPublic} = useAxios()
  return (await axiosPublic.get<Group[]>(`${modelBaseUrl}/`)).data
}