import {ref} from 'vue'
import type {User} from '#/user'
import type {
  AssociationMember,
  AssociationOptions,
  AssociationRole,
  AssociationUser,
  AssociationUserRole,
  CreateAssociationUser,
  RegisterAssociationUser,
  UpdateAssociationUser
} from '#/association'
import {useProfileStore} from '@/stores/useProfileStore'
import {useUserStore} from '@/stores/useUserStore'
import i18n from '@/plugins/i18n'
import {useAssociationStore} from '@/stores/useAssociationStore'
import * as userService from '@/services/UserService'

const userAssociations = ref<AssociationRole[]>([])
const newUserAssociations = ref<AssociationRole[]>([])

const associationMembers = ref<AssociationMember[]>([])
//const newAssociationMembers = ref<AssociationUser[]>([])


const associationUserRole = (associationUser: AssociationUser): AssociationUserRole => {
  if (associationUser.isPresident) return 'isPresident'
  if (associationUser.isSecretary) return 'isSecretary'
  if (associationUser.isTreasurer) return 'isTreasurer'
  if (associationUser.isVicePresident) return 'isVicePresident'
  return 'isMember'
}

// old = getAssociationUserNames
async function getAssociationUsers(associationId: number): Promise<User[]> {
  return userService.getUsers({associationId})
}

function removeAssociation(index: number) {
  newUserAssociations.value.splice(index, 1)
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

  async function updateUserAssociations(editedByStaff: boolean) {
    const instance = editedByStaff ? userManagerStore : userStore
    const userId = instance.user?.id

    const associationToDelete = userAssociations.value.filter(obj => obj.deleteAssociation)
    const associationToUpdate = userAssociations.value.filter(obj => !obj.deleteAssociation)

    const deletePromises = associationToDelete.map(obj => {
      return userService.deleteUserAssociation(userId, obj.id)
    })
    await Promise.all(deletePromises)

    const updatePromises = associationToUpdate.reduce((acc, association) => {
      const original = instance.userAssociations.find(obj => obj.association?.id === association.id)
      const roles = ['isPresident', 'isSecretary', 'isTreasurer', 'isVicePresident']
      const hasRole = roles.some(role => original?.[role])
      const hasChanges: boolean = (original?.canBePresidentFrom !== association.canBePresidentFrom)
        || (original?.canBePresidentTo !== association.canBePresidentTo)
        || (original?.isPresident && association.role !== 'isPresident')
        || (original?.isSecretary && association.role !== 'isSecretary')
        || (original?.isTreasurer && association.role !== 'isTreasurer')
        || (original?.isVicePresident && association.role !== 'isVicePresident')
        || (!hasRole && association.role !== 'isMember')
      if (hasChanges) {
        const infosToPatch: Partial<UpdateAssociationUser> = {
          isPresident: association.role === 'isPresident',
          canBePresidentFrom: association.canBePresidentFrom ? association.canBePresidentFrom : null,
          canBePresidentTo: association.canBePresidentTo ? association.canBePresidentTo : null,
          isSecretary: association.role === 'isSecretary',
          isTreasurer: association.role === 'isTreasurer',
          isVicePresident: association.role === 'isVicePresident'
        }
        acc.push(userService.updateUserAssociations(userId, association.id, infosToPatch))
      }
      return acc
    }, [])

    await Promise.all(updatePromises)
  }

  function addAssociation() {
    newUserAssociations.value.push({
      id: null,
      role: 'isMember',
      options: associationRoleOptions
    })
  }

  // todo : vérifier ça (j'ai l'impression qu'on se complique la vie)
  /*function updateRegisterRoleInAssociation(): AssociationUser[] {
    newAssociationUsers.value = []
    newUserAssociations.value.forEach(association => {
      newAssociationUsers.value.push({
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
    return newAssociationUsers.value
  }*/

  const initAssociationMembers = async (associationId: number, withPresident: boolean) => {
    associationMembers.value = []
    await associationStore.getAssociationUsers(associationId)
    associationMembers.value = associationStore.associationUsers
      .filter(associationUser => withPresident || associationUser.user.id !== userStore.user?.id)
      .map(associationUser => ({
        id: associationUser.user.id,
        firstName: associationUser.user.firstName,
        lastName: associationUser.user.lastName,
        role: associationUserRole(associationUser),
        canBePresidentFrom: associationUser.canBePresidentFrom,
        canBePresidentTo: associationUser.canBePresidentTo,
        isValidatedByAdmin: associationUser.isValidatedByAdmin
      }))
  }

  const initUserAssociations = (editedByStaff: boolean) => {
    const associations: AssociationUser[] = editedByStaff ? userManagerStore.userAssociations : userStore.userAssociations
    userAssociations.value = associations.map(association => ({
      id: association.association.id,
      name: association.association.name,
      role: associationUserRole(association),
      options: associationRoleOptions,
      isValidatedByAdmin: association.isValidatedByAdmin,
      canBePresidentFrom: association.canBePresidentFrom,
      canBePresidentTo: association.canBePresidentTo,
      deleteAssociation: false
    }))
  }

  async function getUnvalidatedAssociationUsers() {
    const associationUsers = await userService.getAssociationUsers({isValidatedByAdmin: false})
    associationMembers.value = associationUsers.map((userAssociation) => {
      return {
        id: userAssociation.user.id,
        firstName: userAssociation.user.firstName,
        lastName: userAssociation.user.lastName,
        associationId: userAssociation.association.id,
        associationName: userAssociation.association.name,
        role: associationRoleOptions
          .find(role => role.value === associationUserRole(userAssociation))?.label,
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
      newUserAssociations.value,
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
    addAssociation,
    removeAssociation,
    //updateRegisterRoleInAssociation,
    //newAssociationUsers,
    associationRoleOptions,
    newUserAssociations,
    getUnvalidatedAssociationUsers,
    associationMembers,
    associationUserRole,
    initUserAssociations,
    initAssociationMembers,
    getAssociationUsers,
    userAssociationsToRegister,
    registerUserAssociations
  }
}
