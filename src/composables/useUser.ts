import type {CreateUserGroup, LDAPUser, RegisterUser, RegisterUserBase, UpdateUser, User} from '#/user'
import {computed, reactive, ref} from 'vue'
import useUserGroups from '@/composables/useUserGroup'
import {useFundStore} from '@/stores/useFundStore'
import * as userService from '@/services/UserService'
import useUserAssociation from '@/composables/useUserAssociation'
import type {RegisterAssociationUser} from '#/association'
import type {SelectLabel} from '#/global'

const newUser = reactive<RegisterUserBase>({
  isCas: false,
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  phone: ''
})

const userToUpdate = ref<UpdateUser>({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  newEmail: '',
  newEmailVerification: '',
  phone: '',
  address: '',
  zipcode: '',
  city: '',
  country: ''
})

function setUserInstitutions(user: User): number[] {
  return user.groups?.reduce<number[]>((factory, group) => {
    if (group.institutionId) {
      factory.push(group.institutionId)
    }
    return factory
  }, []) ?? []
}

const LDAPUsers = ref<LDAPUser[]>([])

const CASUserOptions = computed<SelectLabel[]>(() => {
  return LDAPUsers.value.map(user => ({
    value: user.username,
    label: `${user.firstName} ${user.lastName} (${user.mail})`
  }))
})

export default function useUser() {

  const fundStore = useFundStore()
  const {newUserAssociations, userAssociationsToRegister} = useUserAssociation()
  const {userGroupsToRegister} = useUserGroups()

  function setUserFunds(user: User): number[] {
    const institutionIds = new Set(setUserInstitutions(user))
    const fundIds = fundStore.funds
      .filter(fund => fund.institution && institutionIds.has(fund.institution))
      .map(fund => fund.id)
    return Array.from(new Set(fundIds))
  }

  const userDataToUpdate = (originalUser: User): Partial<UpdateUser> => {
    const data: Partial<UpdateUser> = {}
    if (userToUpdate.value.firstName && (userToUpdate.value.firstName !== originalUser?.firstName)) data.firstName = userToUpdate.value.firstName
    if (userToUpdate.value.lastName && (userToUpdate.value.lastName !== originalUser?.lastName)) data.lastName = userToUpdate.value.lastName
    if (userToUpdate.value.newEmail && userToUpdate.value.newEmail !== userToUpdate.value.email &&
      userToUpdate.value.newEmail === userToUpdate.value.newEmailVerification) data.email = userToUpdate.value.newEmail
    if (userToUpdate.value.phone !== originalUser?.phone) data.phone = userToUpdate.value.phone
    if (userToUpdate.value.address !== originalUser?.address) data.address = userToUpdate.value.address
    if (userToUpdate.value.zipcode !== originalUser?.zipcode) data.zipcode = userToUpdate.value.zipcode
    if (userToUpdate.value.city !== originalUser?.city) data.city = userToUpdate.value.city
    if (userToUpdate.value.country !== originalUser?.country) data.country = userToUpdate.value.country
    return data
  }

  // todo pagination en back
  /*function advancedSearch(settings: UserSearch) {
    const hasSettings: boolean = !!(settings.firstName || settings.lastName || settings.email || settings.association)
    if (!userStore.users.length || !hasSettings) return
    let matches: User[] = []
    if (settings.firstName) {
      const term = filterizeSearch(settings.firstName)
      matches = userStore.users.filter(user => {
        return filterizeSearch(user.firstName).includes(term)
      })
    }
    if (settings.lastName) {
      // checking if a search has already been made
      // If so, we filter on current matches, if not, we filter in store
      const term = filterizeSearch(settings.lastName)
      matches = (matches.length ? matches : userStore.users).filter(user => {
        return filterizeSearch(user.lastName).includes(term)
      })
    }
    if (settings.email) {
      matches = (matches.length ? matches : userStore.users).filter(user => {
        return user.email === settings.email
      })
    }
    if (settings.association) {
      matches = (matches.length ? matches : userStore.users).filter(user => {
        return user.associations.map(association => association.id).includes(settings.association)
      })
    }
    return matches
  }*/

  // old = addUserAsManager
  async function createUser() {
    const gifus: CreateUserGroup[] = userGroupsToRegister()
    const associations = userAssociationsToRegister(newUserAssociations.value) as RegisterAssociationUser[]

    const user: RegisterUser = {
      isCas: newUser.isCas,
      username: newUser.username,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phone: newUser.phone,
      gifus,
      associations
    }

    await userService.createUser(user)
  }

  async function getUsersFromLDAP(lastName: string): Promise<void> {
    LDAPUsers.value = await userService.getUsersFromLDAP(lastName)
  }

  return {
    userToUpdate,
    setUserFunds,
    setUserInstitutions,
    userDataToUpdate,
    CASUserOptions,
    LDAPUsers,
    getUsersFromLDAP,
    createUser,
  }
}
