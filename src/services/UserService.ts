import {useAxios} from '@/composables/useAxios'
import type {AssociationUser, CreateAssociationUser} from '#/association'
import type {LDAPUser, RegisterUser, UpdateUser, User, UserFilters} from '#/user'

const modelBaseUrl = '/users'

export async function getUsers(filters?: UserFilters): Promise<User[]> {
  const {axiosAuthenticated} = useAxios()
  const filterArray: string[] = []
  if (filters?.status) filterArray.push(`is_validated_by_admin=${filters.status === 'validated'}`)
  if (filters?.search) filterArray.push(`search=${filters.search}`)
  const filterString: string = filterArray.length ? `?${filterArray.join('&')}` : ''
  return (await axiosAuthenticated.get<User[]>(`${modelBaseUrl}/${filterString}`)).data
}

export async function getUserDetail(userId: number): Promise<User> {
  const {axiosAuthenticated} = useAxios()
  return (await axiosAuthenticated.get<User>(`${modelBaseUrl}/${userId}`)).data
}

export async function getUserAssociations(userId: number): Promise<AssociationUser[]> {
  const {axiosAuthenticated} = useAxios()
  const url = `${modelBaseUrl}/${userId}/associations/`
  return (await axiosAuthenticated.get<AssociationUser[]>(url)).data
}

export async function validateUser(userId: number): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.patch(`${modelBaseUrl}/${userId}`, {isValidatedByAdmin: true})
}

export async function deleteUser(userId: number): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.delete(`${modelBaseUrl}/${userId}`)
}

export async function deleteUserGroup(userId: number, groupId: number, fundId?: number): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  let url = `${modelBaseUrl}/${userId}/groups/${groupId}`
  if (fundId) url += `/funds/${fundId}`
  await axiosAuthenticated.delete(url)
}

export async function updateUser(userId: number, payload: Partial<UpdateUser>): Promise<User> {
  const {axiosAuthenticated} = useAxios()
  return (await axiosAuthenticated.patch(`${modelBaseUrl}/${userId}`, payload)).data
}

export async function registerUserAssociation(payload: CreateAssociationUser): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.post(`${modelBaseUrl}/associations/`, payload)
}

export async function createUser(user: RegisterUser): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.post(`${modelBaseUrl}/`, user)
}

export async function getUsersFromLDAP(lastName: string): Promise<LDAPUser[]> {
  const {axiosAuthenticated} = useAxios()
  return (await axiosAuthenticated.get<LDAPUser[]>(`${modelBaseUrl}/external/?last_name=${lastName}`)).data
}