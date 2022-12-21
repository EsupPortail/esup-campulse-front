import {useRoute} from 'vue-router'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import useUserGroups from '@/composables/useUserGroups'
import type {ManagedUser, UserAssociationDetail} from '#/user'
import {ref, watch} from 'vue'


const userManagerStore = useUserManagerStore()

const userToUpdate = ref(userManagerStore.userInfosUpdate)
watch(() => userManagerStore.user, () => {
    userToUpdate.value = userManagerStore.userInfosUpdate
})

const newUserAssociations = ref<UserAssociationDetail[]>(userManagerStore.userAssociations)
watch(() => userManagerStore.userAssociations, () => {
    newUserAssociations.value = userManagerStore.userAssociations
})

export default function () {

    const route = useRoute()
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
        await updateUserGroups()
        await userManagerStore.validateUser()
    }

    // to test
    async function updateUserInfos() {
        // update user
        await userManagerStore.updateUserInfos(userToUpdate.value as ManagedUser)
        // update user groups
        await updateUserGroups()
        // update user associations
        await userManagerStore.updateUserAssociations(newUserAssociations.value as UserAssociationDetail[])
    }

    return {getUsers, getUser, validateUser, updateUserInfos, userToUpdate, newUserAssociations}
}