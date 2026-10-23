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

export async function getCommissions(filters?: CommissionFilters): Promise<PaginatedList<Commission>> {
  let urlString = `${modelBaseUrl}/`
  const urlArray = []
  if (filters?.funds?.length) urlArray.push(`funds=${filters.funds.join(',')}`)
  if (filters?.isOpenToProjects !== undefined) urlArray.push(`is_open_to_projects=${filters.isOpenToProjects}`)
  if (filters?.isSite !== undefined) urlArray.push(`is_site=${filters.isSite}`)
  if (filters?.managedProjects !== undefined) urlArray.push(`managed_projects=${filters.managedProjects}`)
  if (filters?.onlyWithActiveProjects !== undefined) urlArray.push(`only_with_active_projects=${filters.onlyWithActiveProjects}`)
  if (filters?.toPostponeProject) urlArray.push(`to_postpone_project=${filters.toPostponeProject}`)
  if (filters?.withActiveProjects !== undefined) urlArray.push(`with_active_projects=${filters.withActiveProjects}`)
  if (urlArray.length) urlString += `?${urlArray.join('&')}`
  const {axiosPublic} = useAxios()
  return (await axiosPublic.get<PaginatedList<Commission>>(urlString)).data
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