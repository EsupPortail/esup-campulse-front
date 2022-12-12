import {useRoute} from 'vue-router'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import useUtility from '@/composables/useUtility'

export default function () {

    const userManagerStore = useUserManagerStore()
    const route = useRoute()
    const {arraysAreEqual} = useUtility()

    // to test
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

    // to test
    async function validateUser(userGroups: number[]) {
        if (!arraysAreEqual(userGroups, userManagerStore.userGroups)) {
            await userManagerStore.updateUserGroups(userGroups)
            await userManagerStore.deleteUserGroups()
        }
        await userManagerStore.validateUser()
        userManagerStore.unLoadUsers()
    }

    return {getUsers, getUser, validateUser}
}