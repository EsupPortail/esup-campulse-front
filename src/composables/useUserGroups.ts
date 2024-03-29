import {computed, ref, watch} from 'vue'
import useUtility from '@/composables/useUtility'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {useAxios} from '@/composables/useAxios'
import type {Group, GroupCodeLiteralName, SelectGroupLabel} from '#/groups'
import i18n from '@/plugins/i18n'
import type {UserGroup} from '#/user'
import {useUserStore} from '@/stores/useUserStore'
import useCommissions from '@/composables/useCommissions'
import useSecurity from '@/composables/useSecurity'


// Used to store groups
const groups = ref<Group[]>([])

// Used to choose or update groups
const newGroups = ref<number[]>([])

// Used to limit the number of groups a user can choose
const groupChoiceLimit = 2
const groupChoiceIsValid = computed(() => {
    return newGroups.value.length > 0 && newGroups.value.length <= groupChoiceLimit
})

// Used to dynamically show or hide FormRegisterUserAssociations
const groupCanJoinAssociation = ref<boolean>(true)

// Helper to know if a user in userStore is a staff member
const isStaff = ref<boolean | undefined>(undefined)

// Helper to know if a user in userStore is a fund member
const MEMBER_FUND = 'MEMBER_FUND'
const isMemberFund = ref<boolean | undefined>(undefined)

// Used to display or not the select for commissions
const commissionMemberIsSelected = ref<boolean>(false)

// Used to display or not the document needed for registration (only for students)
const studentGroupIsSelected = ref<boolean>(false)

export default function () {
    const userStore = useUserStore()
    const userManagerStore = useUserManagerStore()
    const {userFunds} = useCommissions()
    // const {axiosPublic} = useAxios()


    const groupNames: GroupCodeLiteralName[] = [
        {
            codeName: 'MANAGER_GENERAL',
            literalName: i18n.global.t('user-groups.manager-general'),
        },
        {
            codeName: 'MANAGER_INSTITUTION',
            literalName: i18n.global.t('user-groups.manager-institution')
        },
        {
            codeName: 'MANAGER_MISC',
            literalName: i18n.global.t('user-groups.manager-misc')
        },
        {
            codeName: 'MEMBER_FUND',
            literalName: i18n.global.t('user-groups.member-fund')
        },
        {
            codeName: 'STUDENT_INSTITUTION',
            literalName: i18n.global.t('user-groups.student-institution')
        },
        {
            codeName: 'STUDENT_MISC',
            literalName: i18n.global.t('user-groups.student-misc')
        },
    ]

    /* A list of groups that can join associations */
    const canJoinAssociationGroups = ['STUDENT_INSTITUTION']

    /**
     * It gets the groups from the server and puts them in the groups variable.
     */
    async function getGroups() {
        if (groups.value.length === 0) {
            const {axiosPublic} = useAxios()
            groups.value = (await axiosPublic.get<Group[]>('/groups/')).data
        }
    }

    /**
     * It takes a groupId, finds the group object in the groups array, and returns the literalName of the groupName object
     * that has the same codeName as the group object
     * @param {number} groupId - The id of the group you want to get the literal name of.
     * @returns The literal name of the group.
     */
    function getGroupLiteral(groupId: number): string | undefined {
        const group = (groups.value?.find(obj => obj.id === groupId))
        if (group) {
            const groupName = groupNames.find(obj => obj.codeName === group.name)
            if (groupName) {
                return groupName.literalName
            }
        }
    }

    const groupLabels = ref<SelectGroupLabel[]>([])

    /**
     * It takes a boolean parameter, and if it's true, it will only return the public groups, otherwise it will return all
     * groups
     * @param {boolean} onlyPublicGroups - boolean - If true, only public groups will be added to the list.
     * @returns the groupLabels value
     */
    // To re test
    async function initGroupLabels(onlyPublicGroups: boolean) {
        const {hasPerm} = useSecurity()
        const labels: SelectGroupLabel[] = []
        groups.value?.map(function (group) {
            if (onlyPublicGroups && group.isPublic || !onlyPublicGroups) {
                const label: string | undefined = getGroupLiteral(group.id)
                if (label) {
                    let disable = !group.isPublic
                    if (hasPerm('add_groupinstitutioncommissionuser_any_group') && group.name !== 'MANAGER_GENERAL') {
                        disable = false
                    }
                    labels.push({
                        value: group.id,
                        label,
                        disable
                    })
                }
            }
        })
        // Sort by alphabetical order
        labels.sort(function (a, b) {
            const labelA = a.label.toLowerCase().normalize('NFD'), labelB = b.label.toLowerCase().normalize('NFD')
            if (labelA < labelB)
                return -1
            if (labelA > labelB)
                return 1
            return 0
        })
        // Assign values to ref groupLabels
        groupLabels.value = labels
    }

    // To test
    const initUserGroups = () => {
        newGroups.value = [...userManagerStore.userGroups]
    }
    watch(() => userManagerStore.userGroups, initUserGroups)

    /**
     * If the groups array has a length, find the group with the name that matches the groupCodeName parameter and push the
     * group's id to the newGroups array
     * @param {string} groupCodeName - The name of the group you want to pre-select.
     */
    function preSelectGroup(groupCodeName: string) {
        if (groups.value?.length) {
            const groupToPreSelect = groups.value?.find(group => group.name === groupCodeName)
            if (groupToPreSelect) {
                newGroups.value.push(groupToPreSelect.id)
            }
        }
    }

    /**
     * If the user has selected a group that is not in the list of groups that can join the association, then the user
     * cannot join the association
     */
    const initGroupPermToJoinAssociation = (groupArray: number[]) => {
        let perm = false
        if (groupArray.length && groups.value?.length) {
            for (let i = 0; i < groupArray.length; i++) {
                const g = groups.value?.find(obj => obj.id === groupArray[i])
                if (g && canJoinAssociationGroups.includes(g.name)) {
                    perm = true
                    break
                }
            }
        }
        groupCanJoinAssociation.value = perm
    }
    watch(() => newGroups.value.length, () => {
        initGroupPermToJoinAssociation(newGroups.value)
    })

    /**
     * If the user is a member of a non-public group, then they are staff
     */
    const initStaffStatus = () => {
        let perm = false
        const userGroups = userStore.user?.groups

        for (let i = 0; i < (userGroups?.length as number); i++) {
            const g = groups.value?.find(obj => obj.id === (userGroups?.[i] as UserGroup).groupId)
            if (g && !g.isPublic) {
                perm = true
                break
            }
        }
        isStaff.value = perm
    }

    watch(() => userStore.user?.groups.length, initStaffStatus)

    const initIsMemberFund = () => {
        let perm = false
        const userGroups = userStore.user?.groups

        if (userGroups?.find(g => g.groupId === (groups.value.find(g => g.name === MEMBER_FUND))?.id)) perm = true
        isMemberFund.value = perm
    }

    watch(() => userStore.user?.groups.length, initIsMemberFund)

    const isManagerMisc = () => {
        const managerMiscGroup = groups.value.find(group => group.name === 'MANAGER_MISC')
        return !!userStore.user?.groups.find(group => group.groupId === managerMiscGroup?.id)
    }

    /**
     * Return the old groups that are not in the new groups.
     * @param {number[]} newGroups - The new groups that the user is a member of.
     * @param {number[]} oldGroups - The groups the user is currently in.
     * @returns The oldGroups array is being filtered to return only the values that are not in the newGroups array.
     * So later on, we can delete those links between the user and the groups.
     */
    function groupsToDelete(newGroups: number[], oldGroups: number[]) {
        return oldGroups.filter(x => newGroups.indexOf(x) === -1)
    }

    // To re test
    function groupsToAdd(newGroups: number[], oldGroups: number[]) {
        let temp = newGroups.filter(x => oldGroups.indexOf(x) === -1)
        temp = temp.filter((element, index) => {
            return temp.indexOf(element) === index
        })
        return temp
    }

    // To test
    function commissionsToUpdate(newCommissions: number[], oldCommissions: number[]) {
        return newCommissions.filter(x => oldCommissions.indexOf(x) === -1)
    }

    // To test
    function commissionsToDelete(newCommissions: number[], oldCommissions: number[]) {
        return oldCommissions.filter(x => newCommissions.indexOf(x) === -1)
    }

    /**
     * It updates the user's groups in the database if the new groups are different from the old groups
     */
    async function updateUserGroups() {
        const userManagerStore = useUserManagerStore()
        const oldGroups = userManagerStore.userGroups
        const {arraysAreEqual} = useUtility()

        if (!arraysAreEqual(newGroups.value, oldGroups) || !arraysAreEqual(userFunds.value, userManagerStore.userCommissionFunds)) {
            await userManagerStore.updateUserGroups(groupsToAdd(newGroups.value, oldGroups),
                commissionsToUpdate(userFunds.value, userManagerStore.userCommissionFunds))
            await userManagerStore.deleteUserGroups(groupsToDelete(newGroups.value, oldGroups),
                commissionsToDelete(userFunds.value, userManagerStore.userCommissionFunds))
        }
    }

    const commissionGroup = ref<Group | undefined>(groups.value.find(obj => obj.name === MEMBER_FUND))
    watch(() => groups.value, () => {
        commissionGroup.value = groups.value.find(obj => obj.name === MEMBER_FUND)
    })

    // To test
    const initCommissionMemberSelection = () => {
        if (commissionGroup.value) {
            commissionMemberIsSelected.value = newGroups.value.includes(commissionGroup.value?.id)
        }
    }
    watch(() => newGroups.value, initCommissionMemberSelection)

    const studentGroups = ref<Group[] | undefined>(groups.value.filter(obj => obj.name === 'STUDENT_INSTITUTION' || obj.name === 'STUDENT_MISC'))
    watch(() => groups.value, () => {
        studentGroups.value = groups.value.filter(obj => obj.name === 'STUDENT_INSTITUTION' || obj.name === 'STUDENT_MISC')
    })

    // To test
    const initStudentGroupSelection = () => {
        studentGroupIsSelected.value = false
        if (studentGroups.value?.length) {
            studentGroups.value?.forEach(group => {
                if (newGroups.value.includes(group.id)) studentGroupIsSelected.value = true
            })
        }
    }
    watch(() => newGroups.value, initStudentGroupSelection)


    return {
        groups,
        getGroups,
        groupLabels,
        groupsToDelete,
        groupsToAdd,
        groupChoiceIsValid,
        newGroups,
        updateUserGroups,
        getGroupLiteral,
        initGroupLabels,
        preSelectGroup,
        groupCanJoinAssociation,
        isStaff,
        initStaffStatus,
        initGroupPermToJoinAssociation,
        groupNames,
        commissionMemberIsSelected,
        initCommissionMemberSelection,
        commissionGroup,
        isMemberFund,
        initIsMemberFund,
        isManagerMisc,
        studentGroupIsSelected,
        initStudentGroupSelection
    }
}
