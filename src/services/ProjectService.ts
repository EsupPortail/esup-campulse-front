import {useAxios} from '@/composables/useAxios'
import type {
  CreateProjectCategory,
  CreateProjectComment,
  CreateProjectCommissionFund,
  Project,
  ProjectCategoryName,
  ProjectComment,
  ProjectCommissionFund,
  ProjectCommissionFundFilter,
  ProjectInfos,
  ProjectListItem,
  ProjectReview,
  ProjectStatus,
  UpdateProject,
  UpdateProjectComment,
  UpdateProjectCommissionFund,
  UpdateProjectReview
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
  return (await axiosAuthenticated.get<ProjectReview>(`${modelBaseUrl}/${projectId}/review`)).data
}

export async function getProjectPdf(projectId: number): Promise<AxiosResponse<ArrayBuffer>> {
  const {axiosAuthenticated} = useAxios()
  return await axiosAuthenticated.get<ArrayBuffer>(`${modelBaseUrl}/${projectId}/pdf_export`, {responseType: 'arraybuffer'})
}

export async function updateProjectReview(projectId: number, payload: Partial<UpdateProjectReview>): Promise<ProjectReview> {
  const {axiosAuthenticated} = useAxios()
  return (await axiosAuthenticated.patch(`${modelBaseUrl}/${projectId}/review`, payload)).data
}

export async function getProjectReviewPdf(projectId: number): Promise<AxiosResponse<ArrayBuffer>> {
  const {axiosAuthenticated} = useAxios()
  return await axiosAuthenticated.get<ArrayBuffer>(`${modelBaseUrl}/${projectId}/review/pdf_export`, {responseType: 'arraybuffer'})
}

export async function postponeProject(projectId: number, newCommissionId: number): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.patch(`${modelBaseUrl}/${projectId}/postpone`, {newCommissionId})
}

export async function getProjectComments(projectId: number): Promise<ProjectComment[]> {
  const {axiosAuthenticated} = useAxios()
  return (await axiosAuthenticated.get<ProjectComment[]>(`${modelBaseUrl}/${projectId}/comments`)).data
}

export async function createProjectComment(projectId: number, comment: CreateProjectComment): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.post(`${modelBaseUrl}/${projectId}/comments`, comment)
}

export async function updateProjectComment(projectId: number, comment: UpdateProjectComment): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.patch(`${modelBaseUrl}/${projectId}/comments/${comment.id}`, comment)
}

export async function createProject(payload: Partial<ProjectInfos>): Promise<Project> {
  const {axiosAuthenticated} = useAxios()
  return (await axiosAuthenticated.post(`${modelBaseUrl}/`, payload)).data
}

export async function updateProject(projectId: number, payload: Partial<UpdateProject>): Promise<Project> {
  const {axiosAuthenticated} = useAxios()
  return (await axiosAuthenticated.patch(`${modelBaseUrl}/${projectId}`, payload)).data
}

export async function updateProjectStatus(projectId: number, projectStatus: ProjectStatus): Promise<Project> {
  const {axiosAuthenticated} = useAxios()
  return (await axiosAuthenticated.patch(`${modelBaseUrl}/${projectId}/status`, {projectStatus})).data
}

export async function deleteProject(projectId: number) {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.delete(`${modelBaseUrl}/${projectId}`)
}

export async function createProjectCommissionFund(payload: CreateProjectCommissionFund): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.post(`${modelBaseUrl}/commission_funds`, payload)
}

export async function updateProjectCommissionFund(projectId: number, commissionFundId: number, payload: Partial<UpdateProjectCommissionFund>) {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.patch(`${modelBaseUrl}/${projectId}/commission_funds/${commissionFundId}`, payload)
}

export async function deleteProjectCommissionFund(projectId: number, commissionFundId: number): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.delete(`${modelBaseUrl}/${projectId}/commission_funds/${commissionFundId}`)
}

export async function createProjectCategory(payload: CreateProjectCategory): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.post(`${modelBaseUrl}/categories`, payload)
}

export async function deleteProjectCategory(projectId: number, categoryId: number): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.delete(`${modelBaseUrl}/${projectId}/categories/${categoryId}`)
}
