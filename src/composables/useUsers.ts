import {useRoute} from 'vue-router'
import useUserGroups from '@/composables/useUserGroups'
import useUtility from '@/composables/useUtility'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import type {ManagedUser, UserAssociationDetail} from '#/user'


export default function () {

    const userManagerStore = useUserManagerStore()
    const route = useRoute()
    const {groupsToDelete} = useUserGroups()
    const {arraysAreEqual} = useUtility()
    const {updateUserGroups} = useUserGroups()

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

    // to re test
    async function validateUser() {

        const oldGroups = userManagerStore.userGroups
        const {newGroups} = useUserGroups()
        if (!arraysAreEqual(newGroups.value, oldGroups)) {
            await userManagerStore.updateUserGroups(newGroups.value)
            await userManagerStore.deleteUserGroups(groupsToDelete(newGroups.value, oldGroups))
        }
        await userManagerStore.validateUser()
    }

    // to test
    async function updateUserInfos(updatedUser: ManagedUser, updatedUserAssociations: UserAssociationDetail[]) {
        // update user
        await userManagerStore.updateUserInfos(updatedUser)
        // update user groups
        await updateUserGroups()
        // update user associations
        await userManagerStore.updateUserAssociations(updatedUserAssociations)
    }

    return {getUsers, getUser, validateUser, updateUserInfos}
}
