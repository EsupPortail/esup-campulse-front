import {computed, ref} from 'vue'
import type {Group, GroupName, SelectLabelGroup} from '#/group'
import i18n from '@/plugins/i18n'
import {useProfileStore} from '@/stores/useProfileStore'
import useSecurity from '@/composables/useAuthentication'
import {useGroupStore} from '@/stores/useGroupStore'
import type {User, UserGroupUpdate} from '#/user'
import * as userGroupService from '@/services/UserGroupService'
import * as userService from '@/services/UserService'
import useUser from '@/composables/useUser'
import {useUserStore} from '@/stores/useUserStore'
import useUtil from '@/composables/useUtil'


// Global state
const newGroups = ref<number[]>([])
const groupLabels = ref<SelectLabelGroup[]>([])

// Helpers
const groupChoiceLimit: number = 2
const hasSelectedGroups = computed<boolean>(() => newGroups.value.length > 0)
const isUnderLimit = computed<boolean>(() => newGroups.value.length <= groupChoiceLimit)
const groupChoiceIsValid = computed<boolean>(() => {
  return hasSelectedGroups.value && isUnderLimit.value
})
// old = canJoinAssociationGroups
const associationMemberGroups = new Set(['STUDENT_INSTITUTION'])
const studentGroups = new Set(['STUDENT_INSTITUTION', 'STUDENT_MISC'])
const commissionMemberGroups = new Set(['MANAGER_MISC'])

export default function useUserGroup() {

  const profileStore = useProfileStore()
  const groupStore = useGroupStore()

  const isStaff = computed<boolean>(() => {
    if (!profileStore.user?.groups) return false
    return profileStore.user.groups.some(userGroup => {
      const group = groupStore.groups
        .find(obj => obj.id === userGroup.groupId)
      return !group?.isPublic
    })
  })

  const isInGroup = (groupName: GroupName): boolean => {
    if (!profileStore.user?.groups) return false
    const group = groupStore.groups.find(g => g.name === groupName)
    return profileStore.user.groups.some(g => g.id === group.id)
  }

  // old = getGroupLiteral
  const groupFriendlyName = (groupId: number): string => {
    const group = groupStore.groups.find(obj => obj.id === groupId)
    return i18n.global.t(`user-groups.${group.name.replace(/_/g, '-').toLowerCase()}`) ?? ''
  }

  function initGroupLabels(onlyPublic?: boolean): void {
    const {hasPerm} = useSecurity()
    const labels = groupStore.groups.reduce<SelectLabelGroup[]>((factory, group) => {
      if (!onlyPublic || group.isPublic) {
        const label = groupFriendlyName(group.id)
        if (label) {
          let disable = !group.isPublic
          if (hasPerm('add_groupinstitutioncommissionuser_any_group') && group.name !== 'MANAGER_GENERAL') {
            disable = false
          }
          factory.push({
            value: group.id,
            label,
            disable
          })
        }
      }
      return factory
    }, []) ?? []
    labels.sort(function (a, b) {
      const labelA = a.label.toLowerCase().normalize('NFD'), labelB = b.label.toLowerCase().normalize('NFD')
      if (labelA < labelB)
        return -1
      if (labelA > labelB)
        return 1
      return 0
    })
    groupLabels.value = labels
  }

  // old = preSelectGroup
  function selectGroup(groupName: GroupName): void {
    if (!groupStore.groups.length) return
    const groupToSelect = groupStore.groups
      .find(group => group.name === groupName)
    newGroups.value.push(groupToSelect!.id)
  }

  // old = groupCanJoinAssociation
  const canJoinAssociation = computed<boolean>(() => {
    if (!groupStore.groups.length) return
    let perm = false
    for (const group of newGroups.value) {
      const groupDetail = groupStore.groups
        .find(obj => obj.id === group)
      const canJoinAssociation = associationMemberGroups.has(groupDetail?.name)
      if (canJoinAssociation) {
        perm = true
        break
      }
    }
    return perm
  })

  // old = commissionMemberIsSelected
  const commissionMemberGroupIsSelected = computed<boolean>(() => {
    const targetGroups = new Set(groupStore.groups
      .filter(g => commissionMemberGroups.has(g.name))
      .map(g => g.id))
    return newGroups.value.some(g => targetGroups.has(g))
  })

  const studentGroupIsSelected = computed<boolean>(() => {
    const targetGroups = new Set(groupStore.groups
      .filter(g => studentGroups.has(g.name))
      .map(g => g.id))
    return newGroups.value.some(g => targetGroups.has(g))
  })

  const groupByName = (name: GroupName): Group => {
    return groupStore.groups.find(g => g.name === name)
  }

  async function patchUserGroups(user: number, groupsToPost: number[], fundsToUpdate: number[]) {
    const commissionMemberGroup = groupByName('MEMBER_FUND')

    const postFactory: UserGroupUpdate[] = []

    for (const group of groupsToPost) {
      const isCommissionMemberGroup = group === commissionMemberGroup.id
      if (isCommissionMemberGroup) {
        for (const fund of fundsToUpdate) {
          postFactory.push({
            user,
            group,
            institution: null,
            fund
          })
        }
      } else {
        postFactory.push({
          user,
          group,
          institution: null,
          fund: null
        })
      }
    }

    const needsToPostCommissionGroup = groupsToPost.includes(commissionMemberGroup.id)
    const hasFundsToUpdate = !!fundsToUpdate.length

    if (!needsToPostCommissionGroup && hasFundsToUpdate) {
      for (const fund of fundsToUpdate) {
        const group = commissionMemberGroup.id
        postFactory.push({
          user,
          group,
          institution: null,
          fund,
        })
      }
    }

    const promises = postFactory.map(async (data) => {
      return await userGroupService.postUserGroup(data)
    })
    await Promise.all(promises)
  }

  async function deleteUserGroups(user: User, groupsToDelete: number[], fundsToDelete: number[]) {
    const {userFunds} = useUser()
    const funds = userFunds(user)
    const userId = user.id
    const commissionMemberGroup = groupByName('MEMBER_FUND')

    for (const group of groupsToDelete) {
      const isCommissionMemberGroup = group === commissionMemberGroup.id
      if (isCommissionMemberGroup) {
        for (const fund of funds) {
          await userService.deleteUserGroup(userId, group, fund)
        }
      } else {
        await userService.deleteUserGroup(userId, group)
      }
    }
    for (const fund of fundsToDelete) {
      await userService.deleteUserGroup(userId, commissionMemberGroup.id, fund)
    }
  }

  async function updateUserGroups(user: User) {
    const userStore = useUserStore()
    const originalGroups = userStore.userGroups
    const {arraysAreEqual} = useUtil()
    const {userFunds} = useUser()
    const funds = userFunds(user)

    const groupsToPost = () => {
      let temp = newGroups.value.filter(group => originalGroups.indexOf(group) === -1)
      temp = temp.filter((element, index) => {
        return temp.indexOf(element) === index
      })
      return temp
    }

    const groupsToDelete = () => {
      return originalGroups.filter(group => newGroups.value.indexOf(group) === -1)
    }

    const fundsToUpdate = (newCommissions: number[], oldCommissions: number[]) => {
      return funds.filter(x => oldCommissions.indexOf(x) === -1)
    }

    const commissionsToDelete = (newCommissions: number[], oldCommissions: number[]) => {
      return oldCommissions.filter(x => newCommissions.indexOf(x) === -1)
    }

    if (!arraysAreEqual(newGroups.value, oldGroups) || !arraysAreEqual(userFunds.value, userStore.userCommissionFunds)) {
      await patchUserGroups(groupsToPost(),
        commissionsToUpdate(userFunds.value, userStore.userCommissionFunds))
      await deleteUserGroups(groupsToDelete(),
        commissionsToDelete(userFunds.value, userStore.userCommissionFunds))
    }
  }

  return {
    groupLabels,
    groupChoiceIsValid,
    newGroups,
    isStaff,
    studentGroupIsSelected,
    commissionMemberGroupIsSelected,
    canJoinAssociation,
    selectGroup,
    initGroupLabels,
    isInGroup,
    commissionMemberGroups,
    groupByName,
    updateUserGroups
  }
}
