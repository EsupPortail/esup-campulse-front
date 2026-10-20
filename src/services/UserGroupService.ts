import {useAxios} from '@/composables/useAxios'
import type {UserGroupUpdate} from '#/user'

const modelBaseUrl = '/users/groups'

export async function postUserGroup(userGroup: UserGroupUpdate): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.post(`${modelBaseUrl}/`, userGroup)
}