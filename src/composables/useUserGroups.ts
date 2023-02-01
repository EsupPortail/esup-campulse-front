import type {GroupList, UserGroup} from '#/user'
import _axios from '@/plugins/axios'
import {computed, ref} from 'vue'
import useUtility from '@/composables/useUtility'
import {useUserManagerStore} from '@/stores/useUserManagerStore'


// Used to choose or update groups
const newGroups = ref<number[]>([])

// Used to limit the number of groups a user can choose
const groupChoiceLimit = 2
const groupChoiceIsValid = computed(() => {
    return newGroups.value.length > 0 && newGroups.value.length <= groupChoiceLimit
})

// Refactor
// Prevents managers from selecting an association
const groupUnabledToJoinAssociation = [1, 2]
const groupUnabledSelectingAssociation = computed(() => {
    return !newGroups.value.some(group => groupUnabledToJoinAssociation.includes(group))
})

export default function () {
    // Used to store groups
    const groups = ref<UserGroup[]>()

    // to re test
    /**
     * It gets the groups from the server and puts them in the groups variable.
     */
    async function getGroups() {
        groups.value = (await _axios.get<UserGroup[]>('/groups/')).data
    }

    /*
    * Creating an array of objects with the value and label properties.
    * Used in the QCheckboxes for group selection
    */
    const groupList = computed((): GroupList | undefined => {
        return groups.value?.map(group => ({
            value: group.id,
            label: group.name
        }))
    })

    /*
    * Getting the student group to pre-check the corresponding box
    * Used in the QCheckboxes for group selection
    */
    const studentGroup = computed((): UserGroup | undefined => {
        return groups.value?.find(({name}) => name === 'Étudiante ou Étudiant')
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
        groupList,
        studentGroup,
        groupsToDelete,
        groupChoiceIsValid,
        groupUnabledSelectingAssociation,
        newGroups,
        updateUserGroups
    }
}