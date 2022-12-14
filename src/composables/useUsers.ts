import {useRoute} from 'vue-router'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import useUserGroups from '@/composables/useUserGroups'
import useUtility from '@/composables/useUtility'

export default function () {

    const userManagerStore = useUserManagerStore()
    const route = useRoute()
    const {groupsToDelete} = useUserGroups()
    const {arraysAreEqual} = useUtility()

    async function getUsers() {
        if (route.name === 'ValidateUsers') {
            await userManagerStore.getUnvalidatedUsers()
        }
        if (route.name === 'ManageUsers') {
            await userManagerStore.getUsers()
        }
    }

    async function getUser(routeParams: string) {
        if (routeParams) {
            const id = parseInt(routeParams as string)
            await userManagerStore.getUserDetail(id)
        }
    }

    async function validateUser(newGroups: number[]) {
        const oldGroups = userManagerStore.userGroups
        if (!arraysAreEqual(newGroups, oldGroups)) {
            await userManagerStore.updateUserGroups(newGroups)
            await userManagerStore.deleteUserGroups(groupsToDelete(newGroups, oldGroups))
        }
        await userManagerStore.validateUser()
        userManagerStore.unLoadUsers()
    }

    return {getUsers, getUser, validateUser}
}