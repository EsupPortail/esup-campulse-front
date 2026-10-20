import {useUserStore} from '@/stores/useUserStore'
import type {UpdateUser, User, UserStore} from '#/user'
import {ref} from 'vue'
import useUserGroups from '@/composables/useUserGroup'
import {useAxios} from '@/composables/useAxios'
import {useProfileStore} from '@/stores/useProfileStore'
import useUtility from '@/composables/useUtil'
import {useFundStore} from '@/stores/useFundStore'

// old = userToUpdate
const updateUser = ref<UpdateUser>({
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

/*// Used to patch user
interface InfosToPatch {
  firstName?: string,
  lastName?: string,
  email?: string,
  phone?: string,
  address?: string,
  zipcode?: string,
  city?: string,
  country?: string,
  username?: string
}*/

//const infosToPatch: InfosToPatch = {}

export default function useUser() {

  const userStore = useUserStore()
  const fundStore = useFundStore()
  const {updateUserGroups} = useUserGroups()
  const {filterizeSearch} = useUtility()

  const userInstitutions = (user: User): number[] => {
    return user.groups?.reduce<number[]>((factory, group) => {
      if (group.institutionId) {
        factory.push(group.institutionId)
      }
      return factory
    }, []) ?? []
  }

  const userFunds = (user: User): number[] => {
    const institutionIds = new Set(userInstitutions(user))
    const fundIds = fundStore.funds
      .filter(fund => fund.institution && institutionIds.has(fund.institution))
      .map(fund => fund.id)
    return Array.from(new Set(fundIds))
  }

  async function validateUser() {
    await updateUserGroups()
    await userStore.validateUser()
  }

  async function updateUserInfos(user: User | undefined, editedByStaff: boolean) {
    const hasInfosToPatch = Object.keys(infosToPatch).length
    if (!hasInfosToPatch) return
    let store: UserStore | UserStore = useProfileStore()
    let url = '/users/auth/user/'
    if (editedByStaff) {
      store = userStore
      url = `/users/${user?.id}`
    }
    const {axiosAuthenticated} = useAxios()
    store.user = (await axiosAuthenticated.patch(url, infosToPatch)).data
  }

  function initInfosToPatch(user: User | undefined) {
    if (userToUpdate.value.firstName && (userToUpdate.value.firstName !== user?.firstName)) infosToPatch.firstName = userToUpdate.value.firstName
    if (userToUpdate.value.lastName && (userToUpdate.value.lastName !== user?.lastName)) infosToPatch.lastName = userToUpdate.value.lastName
    if (userToUpdate.value.newEmail && userToUpdate.value.newEmail !== userToUpdate.value.email &&
      userToUpdate.value.newEmail === userToUpdate.value.newEmailVerification) infosToPatch.email = userToUpdate.value.newEmail
    if (userToUpdate.value.phone !== user?.phone) infosToPatch.phone = userToUpdate.value.phone
    if (userToUpdate.value.address !== user?.address) infosToPatch.address = userToUpdate.value.address
    if (userToUpdate.value.zipcode !== user?.zipcode) infosToPatch.zipcode = userToUpdate.value.zipcode
    if (userToUpdate.value.city !== user?.city) infosToPatch.city = userToUpdate.value.city
    if (userToUpdate.value.country !== user?.country) infosToPatch.country = userToUpdate.value.country
  }

  function advancedSearch(settings: UserSearch) {
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
  }

  return {
    validateUser,
    canEditUser,
    userToUpdate,
    updateUserInfos,
    infosToPatch,
    initInfosToPatch,
    advancedSearch,
    userFunds,
    userInstitutions,
  }
}
