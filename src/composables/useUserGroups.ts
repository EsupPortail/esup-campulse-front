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

// Prevents managers from selecting an association
const groupUnabledToJoinAssociation = [1, 2]
const groupUnabledSelectingAssociation = computed(() => {
    return !newGroups.value.some(group => groupUnabledToJoinAssociation.includes(group));
})

export default function () {
    // Used to store groups
    const groups = ref<UserGroup[]>()

    // to re test
    async function getGroups() {
        groups.value = (await _axios.get<UserGroup[]>('/groups/')).data
    }

    const groupList = computed((): GroupList | undefined => {
        return groups.value?.map(group => ({
            value: group.id,
            label: group.name
        }))
    })

    const studentGroup = computed((): UserGroup | undefined => {
        return groups.value?.find(({name}) => name === 'Étudiante ou Étudiant')
    })

    function groupsToDelete(newGroups: number[], oldGroups: number[]) {
        return oldGroups.filter(x => newGroups.indexOf(x) === -1)
    }

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