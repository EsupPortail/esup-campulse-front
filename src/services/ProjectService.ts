import {useAxios} from '@/composables/useAxios'
import type {
  CreateProjectComment,
  Project,
  ProjectCategoryName,
  ProjectComment,
  ProjectCommissionFund,
  ProjectCommissionFundFilter,
  ProjectListItem,
  ProjectReview,
  ProjectStatus,
  UpdateProjectComment
} from '#/project'
import type {PaginatedList} from '#/global'
import type {AxiosResponse} from 'axios'

const modelBaseUrl = '/projects'

export async function getProjects(
  params?: { commission?: number, association?: number }
): Promise<PaginatedList<ProjectListItem>> {
  const {axiosAuthenticated} = useAxios()
  let url = `${modelBaseUrl}/`
  const factory = []
  if (params?.commission) factory.push(`commission_id=${params.commission}`)
  if (params?.association) factory.push(`association_id=${params.association}`)
  if (factory.length) url += '?' + factory.join('&')
  return (await axiosAuthenticated.get<PaginatedList<ProjectListItem>>(url)).data
}

export async function getProjectDetail(projectId: number): Promise<Project> {
  const {axiosAuthenticated} = useAxios()
  return (await axiosAuthenticated.get<Project>(`${modelBaseUrl}/${projectId}`)).data
}

export async function getProjectCategoryNames(onlyEnabled?: boolean): Promise<ProjectCategoryName[]> {
  const {axiosPublic} = useAxios()
  const url = `${modelBaseUrl}/categories/names${onlyEnabled ? '?is_enabled=true' : ''}`
  return (await axiosPublic.get<ProjectCategoryName[]>(url)).data
}

export async function getProjectCommissionFunds(filter: ProjectCommissionFundFilter): Promise<ProjectCommissionFund[]> {
  const {axiosAuthenticated} = useAxios()
  let url = ''
  switch (filter.filter) {
  case 'commission':
    url = `${modelBaseUrl}/commission_funds?commission_id=${filter.commissionId}`
    break
  case 'project':
    url = `${modelBaseUrl}/${filter.projectId}/commission_funds`
    break
  case 'all':
    url = `${modelBaseUrl}/commission_funds`
    break
  }
  return (await axiosAuthenticated.get<ProjectCommissionFund[]>(url)).data
}

export async function getProjectReview(projectId: number): Promise<ProjectReview> {
  const {axiosAuthenticated} = useAxios()
  const url = `${modelBaseUrl}/${projectId}/review`
  return (await axiosAuthenticated.get<ProjectReview>(url)).data
}

export async function getProjectPdf(projectId: number): Promise<AxiosResponse<ArrayBuffer>> {
  const {axiosAuthenticated} = useAxios()
  const url = `${modelBaseUrl}/${projectId}/pdf_export`
  return await axiosAuthenticated.get<ArrayBuffer>(url, {responseType: 'arraybuffer'})
}

export async function getProjectReviewPdf(projectId: number): Promise<AxiosResponse<ArrayBuffer>> {
  const {axiosAuthenticated} = useAxios()
  const url = `${modelBaseUrl}/${projectId}/review/pdf_export`
  return await axiosAuthenticated.get<ArrayBuffer>(url, {responseType: 'arraybuffer'})
}

export async function patchProjectStatus(
  projectId: number,
  original: ProjectStatus,
  updated: ProjectStatus
): Promise<Project> {
  if (original === updated) return
  const {axiosAuthenticated} = useAxios()
  return (await axiosAuthenticated.patch(`${modelBaseUrl}/${projectId}/status`, {projectStatus: updated})).data
}

export async function patchProjectCommissionFund(projectId: number, original: number, updated: number) {
  if (original === updated) return
  const {axiosAuthenticated} = useAxios()
  const url = `${modelBaseUrl}/${projectId}/commission_funds/${original}`
  await axiosAuthenticated.patch(url, {newCommissionFundId: updated})
}

export async function postponeProject(projectId: number, newCommissionId: number) {
  const {axiosAuthenticated} = useAxios()
  const url = `${modelBaseUrl}/${projectId}/postpone`
  await axiosAuthenticated.patch(url, {newCommissionId})
}

export async function getProjectComments(projectId: number): Promise<ProjectComment[]> {
  const {axiosAuthenticated} = useAxios()
  return (await axiosAuthenticated.get<ProjectComment[]>(`${modelBaseUrl}/${projectId}/comments`)).data
}

export async function createProjectComment(projectId: number, comment: CreateProjectComment): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.post(`${modelBaseUrl}/${projectId}/comments`, comment)
}

export async function updateProjectComment(projectId: number, comment: UpdateProjectComment) {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.patch(`${modelBaseUrl}/${projectId}/comments/${comment.id}`, comment)
}
