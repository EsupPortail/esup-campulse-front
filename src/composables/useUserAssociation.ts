import {ref} from 'vue'
import type {UserAssociation} from '#/user'
import type {
  AssociationMember,
  AssociationOptions,
  AssociationRole,
  AssociationUser,
  CreateAssociationUser,
  RegisterAssociationUser
} from '#/association'
import {useAxios} from '@/composables/useAxios'
import {useProfileStore} from '@/stores/useProfileStore'
import {useUserStore} from '@/stores/useUserStore'
import i18n from '@/plugins/i18n'
import {useAssociationStore} from '@/stores/useAssociationStore'
import * as userService from '@/services/UserService'

const userAssociations = ref<AssociationRole[]>([])

const newAssociations = ref<AssociationRole[]>([])

const newAssociationsUser = ref<AssociationUser[]>([])

const associationMembers = ref<AssociationMember[]>([])

function getAssociationUserRole(user: AssociationUser) {
  return user.isPresident ? 'isPresident' : user.isSecretary ? 'isSecretary' : user.isTreasurer ? 'isTreasurer' :
    user.isVicePresident ? 'isVicePresident' : 'isMember'
}

export default function useUserAssociation() {

  const userStore = useProfileStore()
  const userManagerStore = useUserStore()
  const associationStore = useAssociationStore()

  const associationRoleOptions: AssociationOptions[] = [
    {
      label: i18n.global.t('forms.im-association-president'),
      value: 'isPresident',
      isInOffice: true
    },
    {
      label: i18n.global.t('forms.im-association-secretary'),
      value: 'isSecretary',
      isInOffice: true
    },
    {
      label: i18n.global.t('forms.im-association-treasurer'),
      value: 'isTreasurer',
      isInOffice: true
    },
    {
      label: i18n.global.t('forms.im-association-vice-president'),
      value: 'isVicePresident',
      isInOffice: true
    },
    {
      label: i18n.global.t('forms.im-association-member'),
      value: 'isMember',
      isInOffice: false
    }
  ]

  function updateUserAssociations(editedByStaff: boolean) {
    const instance = editedByStaff ? userManagerStore : userStore
    const userId = instance.user?.id

    userAssociations.value.forEach(async function (association) {
      // If we need to delete the association
      if (association.deleteAssociation) {
        await deleteUserAssociation(userId, association.id)
        // Reactively remove the deleted item from interface
        if (!editedByStaff) {
          userAssociations.value.splice(userAssociations.value.findIndex(obj => obj.id === association.id), 1)
          userStore.user?.associations.splice(userAssociations.value.findIndex(obj => obj.id === association.id), 1)
        }
      }
      // If we need to update the association
      else {
        // We search for the corresponding association in store
        const storeAssociation = instance.userAssociations.find(obj => obj.association?.id === association.id)
        // Has role helper
        const hasRole = storeAssociation?.isPresident || storeAssociation?.isSecretary || storeAssociation?.isTreasurer || storeAssociation?.isVicePresident
        // We set a boolean to track changes
        const hasChanges: boolean = (storeAssociation?.canBePresidentFrom !== association.canBePresidentFrom)
          || (storeAssociation?.canBePresidentTo !== association.canBePresidentTo)
          || (storeAssociation?.isPresident && association.role !== 'isPresident')
          || (storeAssociation?.isSecretary && association.role !== 'isSecretary')
          || (storeAssociation?.isTreasurer && association.role !== 'isTreasurer')
          || (storeAssociation?.isVicePresident && association.role !== 'isVicePresident')
          || (!hasRole && association.role !== 'isMember')

        if (hasChanges) {
          const infosToPatch = {
            isPresident: association.role === 'isPresident',
            canBePresidentFrom: association.canBePresidentFrom ? association.canBePresidentFrom : null,
            canBePresidentTo: association.canBePresidentTo ? association.canBePresidentTo : null,
            isSecretary: association.role === 'isSecretary',
            isTreasurer: association.role === 'isTreasurer',
            isVicePresident: association.role === 'isVicePresident'
          }
          await patchUserAssociations(userId, association.id, infosToPatch)
        }
      }
    })
  }

  async function deleteUserAssociation(userId: number, associationId: number) {
    const {axiosAuthenticated} = useAxios()
    await axiosAuthenticated.delete(`/users/${userId}/associations/${associationId}`)
  }

  async function patchUserAssociations(userId: number, associationId: number, payload: AssociationUser) {
    const {axiosAuthenticated} = useAxios()
    await axiosAuthenticated.patch(`/users/${userId}/associations/${associationId}`, payload)
  }

  function addAssociation() {
    newAssociations.value.push({
      id: null,
      role: 'isMember',
      options: associationRoleOptions
    })
  }

  function removeAssociation(index: number) {
    newAssociations.value.splice(index, 1)
  }

  function updateRegisterRoleInAssociation(): AssociationUser[] {
    newAssociationsUser.value = []
    newAssociations.value.forEach(association => {
      newAssociationsUser.value.push({
        association: association.id,
        isPresident: association.role === 'isPresident',
        canBePresidentFrom: null,
        canBePresidentTo: null,
        isValidatedByAdmin: false,
        isVicePresident: association.role === 'isVicePresident',
        isSecretary: association.role === 'isSecretary',
        isTreasurer: association.role === 'isTreasurer'
      })
    })
    return newAssociationsUser.value
  }

  async function getAssociationUserNames(associationId: number) {
    const {axiosAuthenticated} = useAxios()
    return (await axiosAuthenticated.get(`/users/?association_id=${associationId}`)).data
  }

  const initAssociationMembers = async (associationId: number, withPresident: boolean) => {
    associationMembers.value = []
    await associationStore.getAssociationUsers(associationId)
    associationMembers.value = associationStore.associationUsers
      .filter(associationUser => withPresident || associationUser.user.id !== userStore.user?.id)
      .map(associationUser => ({
        id: associationUser.user.id,
        firstName: associationUser.user.firstName,
        lastName: associationUser.user.lastName,
        role: getAssociationUserRole(associationUser),
        canBePresidentFrom: associationUser.canBePresidentFrom,
        canBePresidentTo: associationUser.canBePresidentTo,
        isValidatedByAdmin: associationUser.isValidatedByAdmin
      }))
  }

  const initUserAssociations = (editedByStaff: boolean) => {
    const associations: UserAssociation[] = editedByStaff ? userManagerStore.userAssociations : userStore.userAssociations

    userAssociations.value = associations.map(association => ({
      id: association.association.id,
      name: association.association.name,
      role: getAssociationUserRole(association),
      options: associationRoleOptions,
      isValidatedByAdmin: association.isValidatedByAdmin,
      canBePresidentFrom: association.canBePresidentFrom,
      canBePresidentTo: association.canBePresidentTo,
      deleteAssociation: false
    }))
  }

  async function getUnvalidatedAssociationUsers() {

    const {axiosAuthenticated} = useAxios()

    const url = '/users/associations/?is_validated_by_admin=false'

    const response = await axiosAuthenticated.get<UserAssociation[]>(url)
    associationMembers.value = response.data.map((userAssociation) => {
      return {
        id: userAssociation.user.id,
        firstName: userAssociation.user.firstName,
        lastName: userAssociation.user.lastName,
        associationId: userAssociation.association.id,
        associationName: userAssociation.association.name,
        role: associationRoleOptions.find(role => role.value === getAssociationUserRole(userAssociation))?.label,
        canBePresidentFrom: userAssociation.canBePresidentFrom,
        canBePresidentTo: userAssociation.canBePresidentTo,
        isValidatedByAdmin: userAssociation.isValidatedByAdmin
      }
    })
  }

  const userAssociationsToRegister = (
    associations: AssociationRole[], user?: number
  ): CreateAssociationUser[] | RegisterAssociationUser[] => {
    const result = associations.map(association => ({
      association: association.id,
      isPresident: association.role === 'isPresident',
      isSecretary: association.role === 'isSecretary',
      isTreasurer: association.role === 'isTreasurer',
      isVicePresident: association.role === 'isVicePresident'
    }))
    if (user) (result as Partial<CreateAssociationUser[]>).forEach(item => {
      item.user = user
    })
    return result
  }

  async function registerUserAssociations(user?: number) {
    const userAssociations = userAssociationsToRegister(
      newAssociations.value,
      user
    ) as (typeof user extends number ? CreateAssociationUser[] : RegisterAssociationUser[])
    const promises = userAssociations.map(item =>
      userService.registerUserAssociation(item)
    )
    await Promise.all(promises)
  }

  return {
    userAssociations,
    updateUserAssociations,
    patchUserAssociations,
    addAssociation,
    removeAssociation,
    updateRegisterRoleInAssociation,
    newAssociationsUser,
    associationRoleOptions,
    newAssociations,
    deleteUserAssociation,
    getUnvalidatedAssociationUsers,
    associationMembers,
    getAssociationUserRole,
    initUserAssociations,
    initAssociationMembers,
    getAssociationUsersNames,
    userAssociationsToRegister,
    registerUserAssociations
  }
}
