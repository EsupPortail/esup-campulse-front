import type {UserGroup} from '#/user'
import {useGroupStore} from '@/stores/useGroupStore'
import {useProfileStore} from '@/stores/useProfileStore'


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

function hasPerm(permission: string): boolean {
  const profileStore = useProfileStore()
  return profileStore.user?.permissions.includes(permission) ?? false
}

export const usePermission = () => {
  return {
    canEditUser,
    hasPerm
  }
}