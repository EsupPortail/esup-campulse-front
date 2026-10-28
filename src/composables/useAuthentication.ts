import {reactive, ref, watch} from 'vue'
import type {
  CreateUserGroup,
  LocalLogin,
  PasswordResetConfirmPayload,
  RegisterCASUserPayload,
  RegisterLocalUserPayload,
  RegisterUserBase,
} from '#/user'
import useUserGroups from '@/composables/useUserGroup'
import {useProfileStore} from '@/stores/useProfileStore'
import useUserAssociations from '@/composables/useUserAssociation'
import zxcvbn from 'zxcvbn'
import * as profileService from '@/services/ProfileService'
import type {RegisterAssociationUser} from '#/association'

const user = ref<LocalLogin>({
  username: '',
  password: ''
})

const newUser = reactive<RegisterUserBase>({
  isCas: false,
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  phone: ''
})

watch(() => newUser.email, () => {
  if (!newUser.isCas) newUser.username = newUser.email
})

const newUserFunds = ref<number[]>([])

const emailVerification = ref<string | undefined>('')
const casInstitutionDomain = import.meta.env.VITE_APP_CAS_INSTITUTION_DOMAIN as string

function setTokens(access: string, refresh: string) {
  localStorage.setItem('JWT__access__token', access)
  localStorage.setItem('JWT__refresh__token', refresh)
}

function removeTokens() {
  localStorage.removeItem('JWT__access__token')
  localStorage.removeItem('JWT__refresh__token')
}

const tokenExpired = (token: string): boolean => {
  if (!token) return true
  return JSON.parse(window.atob(token.split('.')[1])).exp < Math.trunc(Date.now() / 1000)
}

function checkPasswordStrength(password: string) {
  const passwordChecker = {
    valid: true,
    score: zxcvbn(password).score,
  }
  if (passwordChecker.score < 4) passwordChecker.valid = false
  return passwordChecker
}

async function verifyEmail(key: string) {
  await profileService.verifyEmail(key)
}

async function resendEmail(email: string) {
  await profileService.resendEmail(email)
}

async function passwordReset(email: string) {
  await profileService.passwordReset(email)
}

async function passwordResetConfirm(payload: PasswordResetConfirmPayload) {
  await profileService.passwordResetConfirm(payload)
}

export default function useAuthentication() {

  const profileStore = useProfileStore()

  async function cancelAbortedCasRegistration() {
    await profileService.deleteProfile()
    newUser.isCas = false
    newUser.firstName = ''
    newUser.lastName = ''
    newUser.email = ''
    newUser.username = ''
    newUser.phone = ''
    profileStore.newUser = undefined
    removeTokens()
  }

  function hasPerm(permission: string): boolean {
    return profileStore.user?.permissions.includes(permission) ?? false
  }

  const initNewUserData = () => {
    newUser.isCas = profileStore.newUser?.isCas ?? false
    newUser.firstName = profileStore.newUser?.firstName ?? ''
    newUser.lastName = profileStore.newUser?.lastName ?? ''
    newUser.email = profileStore.newUser?.email ?? ''
    emailVerification.value = profileStore.newUser?.email ?? ''
    newUser.username = profileStore.newUser?.username ?? ''
    newUser.phone = profileStore.newUser?.phone ?? ''
  }

  watch(() => profileStore.newUser, initNewUserData)

  // old = userLocalRegister
  async function registerLocalUser() {
    const {newUserAssociations, userAssociationsToRegister} = useUserAssociations()
    const {userGroupsToRegister} = useUserGroups()

    const gifus: CreateUserGroup[] = userGroupsToRegister()
    const associations = userAssociationsToRegister(newUserAssociations.value) as RegisterAssociationUser[]

    const user: RegisterLocalUserPayload = {
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phone: newUser.phone,
      gifus,
      associations
    }

    await profileService.registerLocalUser(user)
    newUserFunds.value = []
  }

  // old = userCASRegister
  async function registerCASUser() {
    const {newUserAssociations, userAssociationsToRegister} = useUserAssociations()
    const {userGroupsToRegister} = useUserGroups()

    const gifus: CreateUserGroup[] = userGroupsToRegister()
    const associations = userAssociationsToRegister(newUserAssociations.value) as RegisterAssociationUser[]

    const user: RegisterCASUserPayload = {
      phone: newUser.phone,
      gifus,
      associations
    }

    await profileService.registerCASUser(user)
    newUserFunds.value = []
  }

  async function register() {
    if (profileStore.isCas) {
      await registerCASUser()
    } else {
      await registerLocalUser()
    }
  }

  return {
    user,
    register,
    newUser,
    emailVerification,
    registerCASUser,
    setTokens,
    removeTokens,
    registerLocalUser,
    verifyEmail,
    resendEmail,
    passwordReset,
    passwordResetConfirm,
    hasPerm,
    initNewUserData,
    checkPasswordStrength,
    cancelAbortedCasRegistration,
    casInstitutionDomain,
    tokenExpired,
    newUserFunds
  }
}
