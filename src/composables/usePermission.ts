import type {UserGroup} from '#/user'
import {useGroupStore} from '@/stores/useGroupStore'


function canEditUser(userGroups: UserGroup[]): boolean {
  const groupStore = useGroupStore()

  let perm = false
  if (userGroups.length && groupStore.groups.length) {
    perm = true
    for (const userGroup of userGroups) {
      const group = groupStore.groups.find(obj => obj.id === userGroup.groupId)
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