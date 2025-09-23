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

    async function getGroups() {
        if (groups.value.length) return
        const {axiosPublic} = useAxios()
        groups.value = (await axiosPublic.get<Group[]>('/groups/')).data
    }

    function getGroupLiteral(groupId: number): string | undefined {
        const group = (groups.value?.find(obj => obj.id === groupId))
        const groupName = groupNames.find(obj => obj.codeName === group?.name)
        if (!groupName) return undefined
        return groupName.literalName
    }

    const groupLabels = ref<SelectGroupLabel[]>([])

    // To re test
    async function initGroupLabels(onlyPublicGroups: boolean) {
        const {hasPerm} = useSecurity()
        const labels: SelectGroupLabel[] = []
        groups.value?.map(function (group) {
            if (onlyPublicGroups && group.isPublic || !onlyPublicGroups) {
                const label: string | undefined = getGroupLiteral(group.id)
                if (!label) return
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

    function preSelectGroup(groupCodeName: string) {
        if (!groups.value?.length) return
        const groupToPreSelect = groups.value?.find(group => group.name === groupCodeName)
        if (!groupToPreSelect) return
        newGroups.value.push(groupToPreSelect.id)
    }

    const initGroupPermToJoinAssociation = (groupArray: number[]) => {
        let perm = false
        if (groups.value?.length) {
            for (const group of groupArray) {
                const groupDetail = groups.value?.find(obj => obj.id === group)
                if (canJoinAssociationGroups.includes(groupDetail?.name)) {
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
