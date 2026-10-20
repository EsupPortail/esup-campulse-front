import {useAxios} from '@/composables/useAxios'
import type {Content, ContentFilters, Logo} from '#/content'

const modelBaseUrl = '/contents'


export async function getContents(filters?: ContentFilters): Promise<Content[]> {
  const {axiosPublic} = useAxios()
  let url = `${modelBaseUrl}/`
  const urlArray: string[] = []
  if (filters?.isEditable !== undefined) urlArray.push(`is_editable=${filters.isEditable}`)
  if (filters?.codes?.length) urlArray.push(`codes=${filters.codes.join(',')}`)
  if (urlArray.length) url += `?${urlArray.join('&')}`
  return (await axiosPublic.get<Content[]>(url)).data
}

export async function getContent(contentId: number): Promise<Content> {
  const {axiosPublic} = useAxios()
  return (await axiosPublic.get<Content>(`${modelBaseUrl}/${contentId}`)).data
}

export async function getLogos(): Promise<Logo[]> {
  const {axiosPublic} = useAxios()
  return (await axiosPublic.get<Logo[]>(`${modelBaseUrl}/logos`)).data
}