import {useAxios} from '@/composables/useAxios'
import type {Stats} from '#/content'

const modelBaseUrl = '/stats'

export async function getStats(): Promise<Stats> {
  const {axiosPublic} = useAxios()
  return (await axiosPublic.get<Stats>(`${modelBaseUrl}/`)).data
}