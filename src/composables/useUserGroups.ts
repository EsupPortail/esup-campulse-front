import type {GroupList, UserGroup} from '#/user'
import _axios from '@/plugins/axios'
import {computed, ref} from 'vue'

export default function () {

    const groups = ref<UserGroup[]>()

    async function getGroups() {
        if (groups.value?.length === 0) {
            groups.value = (await _axios.get<UserGroup[]>('/groups/')).data
        }
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

    return {
        groups,
        getGroups,
        groupList,
        studentGroup
    }
}