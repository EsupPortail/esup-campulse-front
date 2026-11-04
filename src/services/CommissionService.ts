import {useAxios} from '@/composables/useAxios'
import type {PaginatedList} from '#/global'
import type {
  Commission,
  CommissionBase,
  CommissionFilters,
  CommissionFund,
  CreateCommissionFund,
  Fund,
  PostCommission
} from '#/commission'
import type {AxiosResponse} from 'axios'

const modelBaseUrl = '/commissions'

const commissionFilterFactory = (filters?: Partial<CommissionFilters>): string[] => {
  const factory = []
  if (filters?.funds?.length) factory.push(`funds=${filters.funds.join(',')}`)
  if (filters?.isOpenToProjects !== undefined) factory.push(`is_open_to_projects=${filters.isOpenToProjects}`)
  if (filters?.isSite !== undefined) factory.push(`is_site=${filters.isSite}`)
  if (filters?.managedProjects !== undefined) factory.push(`managed_projects=${filters.managedProjects}`)
  if (filters?.onlyWithActiveProjects !== undefined) factory.push(`only_with_active_projects=${filters.onlyWithActiveProjects}`)
  if (filters?.toPostponeProject) factory.push(`to_postpone_project=${filters.toPostponeProject}`)
  if (filters?.withActiveProjects !== undefined) factory.push(`with_active_projects=${filters.withActiveProjects}`)
  return factory
}

export async function getCommissions(filters?: Partial<CommissionFilters>): Promise<PaginatedList<Commission>> {
  let urlString = `${modelBaseUrl}/`
  const factory = commissionFilterFactory(filters)
  if (factory) urlString += `?${factory.join('&')}`
  const {axiosPublic} = useAxios()
  return (await axiosPublic.get<PaginatedList<Commission>>(urlString)).data
}

export async function getManagedCommissions(filters?: Partial<CommissionFilters>): Promise<PaginatedList<Commission>> {
  let urlString = `${modelBaseUrl}/manage`
  const factory = commissionFilterFactory(filters)
  if (factory) urlString += `?${factory.join('&')}`
  const {axiosAuthenticated} = useAxios()
  return (await axiosAuthenticated.get<PaginatedList<Commission>>(urlString)).data
}

export async function getCommission(commissionId: number): Promise<Commission> {
  const {axiosPublic} = useAxios()
  return (await axiosPublic.get<Commission>(`${modelBaseUrl}/${commissionId}`)).data
}

export async function getCommissionFunds(): Promise<CommissionFund[]> {
  const {axiosPublic} = useAxios()
  return (await axiosPublic.get<CommissionFund[]>(`${modelBaseUrl}/funds`)).data
}

export async function getFunds(): Promise<Fund[]> {
  const {axiosPublic} = useAxios()
  return (await axiosPublic.get<Fund[]>(`${modelBaseUrl}/funds/names`)).data
}

export async function deleteCommission(commissionId: number): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.delete(`${modelBaseUrl}/${commissionId}`)
}

export async function getCommissionExport(
  commissionId: number, mode: 'csv' | 'pdf' | 'xlsx',
  projects: number[]
): Promise<AxiosResponse<ArrayBuffer>> {
  const {axiosAuthenticated} = useAxios()
  const url = `${modelBaseUrl}/${commissionId}/export?mode=${mode}&project_ids=${projects.join(',')}`
  return await axiosAuthenticated.get(url, {responseType: 'arraybuffer'})
}

export async function postCommission(commission: PostCommission): Promise<Commission> {
  const {axiosAuthenticated} = useAxios()
  return (await axiosAuthenticated.post<Commission>(`${modelBaseUrl}/`, commission)).data
}

export async function patchCommission(commissionId: number, payload: Partial<CommissionBase>): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.patch(`${modelBaseUrl}/${commissionId}`, payload)
}

export async function postCommissionFund(commissionFund: CreateCommissionFund): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.post(`${modelBaseUrl}/funds`, commissionFund)
}

export async function deleteCommissionFund(commissionId: number, fundId: number): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.delete(`${modelBaseUrl}/${commissionId}/funds/${fundId}`)
}