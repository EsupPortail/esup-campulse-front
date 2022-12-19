import type {GroupList, UserGroup} from '#/user'
import _axios from '@/plugins/axios'
import {computed, ref} from 'vue'


// Functions to choose or update groups
const newGroups = ref<number[]>([])

const groupChoiceLimit = 2
const groupChoiceIsValid = computed(() => {
    return newGroups.value.length > 0 && newGroups.value.length <= groupChoiceLimit
})

export default function () {

    const groups = ref<UserGroup[]>()

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

    function groupsToDelete(newGroups: number [], oldGroups: number[]) {
        return oldGroups.filter(x => newGroups.indexOf(x) === -1)
    }

    return {
        groups,
        getGroups,
        groupList,
        studentGroup,
        groupsToDelete,
        groupChoiceIsValid,
        newGroups
    }
}