import {computed, ref} from 'vue'
import useUtility from '@/composables/useUtility'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {useAxios} from '@/composables/useAxios'
import type {SelectLabel} from "#/index";
import type {Group} from "#/groups";
import i18n from "@/plugins/i18n";


// Used to choose or update groups
const newGroups = ref<number[]>([])

// Used to limit the number of groups a user can choose
const groupChoiceLimit = 2
const groupChoiceIsValid = computed(() => {
    return newGroups.value.length > 0 && newGroups.value.length <= groupChoiceLimit
})

export default function () {
    // Used to store groups
    const groups = ref<Group[]>()

    const groupNames = [
        {
            codeName: 'MANAGER_GENERAL',
            literalName: i18n.global.t('user-groups.manager-general')
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
            codeName: 'COMMISSION_GENERAL',
            literalName: i18n.global.t('user-groups.commission-general')
        },
        {
            codeName: 'COMMISSION_MISC',
            literalName: i18n.global.t('user-groups.commission-misc')
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

    /**
     * It gets the groups from the server and puts them in the groups variable.
     */
    async function getGroups() {
        const {axiosPublic} = useAxios()
        groups.value = (await axiosPublic.get<Group[]>('/groups/')).data
    }

    function getGroupLiteral(groupId: number): string | undefined {
        if (groups.value?.length) {
            const group = (groups.value?.find(obj => obj.id === groupId))
            if (group) {
                const groupName = groupNames.find(obj => obj.codeName === group.name)
                if (groupName) {
                    return groupName.literalName
                }
            }
        }
    }

    /*
    * Creating an array of objects with the value and label properties.
    * Used in the QCheckboxes for group selection
    */
    const groupLabels = computed((): SelectLabel[] | undefined => {
        return groups.value?.map(group => ({
            value: group.id,
            label: group.name
        }))
    })

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

    /**
     * It updates the user's groups in the database if the new groups are different from the old groups
     */
    async function updateUserGroups() {
        const userManagerStore = useUserManagerStore()
        const oldGroups = userManagerStore.userGroups
        const {arraysAreEqual} = useUtility()
        if (!arraysAreEqual(newGroups.value, oldGroups)) {
            await userManagerStore.updateUserGroups(newGroups.value)
            await userManagerStore.deleteUserGroups(groupsToDelete(newGroups.value, oldGroups))
        }
    }

    return {
        groups,
        getGroups,
        groupLabels,
        groupsToDelete,
        groupChoiceIsValid,
        newGroups,
        updateUserGroups,
        getGroupLiteral
    }
}