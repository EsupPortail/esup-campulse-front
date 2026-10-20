import type {UserGroup} from '#/user'
import useUserGroups from '@/composables/useUserGroup'


function canEditUser(userGroups: UserGroup[]): boolean {
  const {groups} = useUserGroups()

  let perm = false
  if (userGroups.length && groups.value.length) {
    perm = true
    for (const userGroup of userGroups) {
      const group = groups.value.find(obj => obj.id === userGroup.groupId)
      if (!group?.isPublic) {
        perm = false
        break
      }
    }
  }
  return perm
}

export const usePermission = () => {
  return {
    canEditUser,
  }
}