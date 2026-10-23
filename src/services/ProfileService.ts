import {useAxios} from '@/composables/useAxios'
import type {
  CasLogin,
  LocalLogin,
  LoginResponse,
  PasswordResetConfirmPayload,
  RegisterCASUserPayload,
  RegisterLocalUserPayload,
  UpdateUser,
  User
} from '#/user'

const modelBaseUrl = '/users/auth'

export async function getProfile(): Promise<User> {
  const {axiosAuthenticated} = useAxios()
  return (await axiosAuthenticated.get<User>(`${modelBaseUrl}/user/`)).data
}

export async function loadCASProfile(ticket: string, service: string): Promise<LoginResponse> {
  const {axiosPublic} = useAxios()
  return (await axiosPublic.post<LoginResponse>(`${modelBaseUrl}/cas/login/`, {ticket, service})).data
}

export async function login(payload: LocalLogin | CasLogin): Promise<LoginResponse> {
  const {axiosPublic} = useAxios()
  return (await axiosPublic.post<LoginResponse>(`${modelBaseUrl}/login/`, payload)).data
}

export async function deleteProfile(): Promise<void> {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.delete(`${modelBaseUrl}/user/`)
}

export async function updateProfile(payload: Partial<UpdateUser>): Promise<User> {
  const {axiosAuthenticated} = useAxios()
  return (await axiosAuthenticated.patch<User>(`${modelBaseUrl}/user/`, payload)).data
}

export async function verifyEmail(key: string) {
  const {axiosPublic} = useAxios()
  await axiosPublic.post(`${modelBaseUrl}/registration/verify-email/`, {key: key})
}

export async function resendEmail(email: string) {
  const {axiosPublic} = useAxios()
  await axiosPublic.post(`${modelBaseUrl}/registration/resend-email/`, {email})
}

export async function passwordReset(email: string) {
  const {axiosPublic} = useAxios()
  await axiosPublic.post(`${modelBaseUrl}/password/reset/`, {email})
}

export async function passwordResetConfirm(payload: PasswordResetConfirmPayload) {
  const {axiosPublic} = useAxios()
  await axiosPublic.post(`${modelBaseUrl}/password/reset/confirm/`, payload)
}

export async function registerLocalUser(payload: RegisterLocalUserPayload) {
  const {axiosPublic} = useAxios()
  await axiosPublic.post(`${modelBaseUrl}/registration/`, payload)
}

export async function registerCASUser(payload: RegisterCASUserPayload) {
  const {axiosAuthenticated} = useAxios()
  await axiosAuthenticated.patch(`${modelBaseUrl}/registration/cas/`, payload)
}