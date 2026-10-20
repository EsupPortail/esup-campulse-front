import {useAxios} from '@/composables/useAxios'
import type {User} from '#/user'

const modelBaseUrl = '/users/auth'

export async function getProfile(): Promise<User> {
  const {axiosAuthenticated} = useAxios()
  return (await axiosAuthenticated.get<User>(`${modelBaseUrl}/user/`)).data
}

export async function loadCASProfile(ticket: string, service: string): Promise<{
  user: User,
  access: string,
  refresh: string,
}> {
  const {axiosPublic} = useAxios()
  return (await axiosPublic.post(`${modelBaseUrl}/cas/login/`, {ticket, service})).data
}