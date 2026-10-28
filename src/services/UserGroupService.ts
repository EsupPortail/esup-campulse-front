import {useAxios} from '@/composables/useAxios'
import type {UpdateUserGroup} from '#/user'

const modelBaseUrl = '/users/groups'

export async function postUserGroup(userGroup: UpdateUserGroup): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.post(`${modelBaseUrl}/`, userGroup)
}