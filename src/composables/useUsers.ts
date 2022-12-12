import {useRoute} from "vue-router";
import {useUserManagerStore} from "@/stores/useUserManagerStore";
import _axios from '@/plugins/axios'

export default function () {

    const userManagerStore = useUserManagerStore()
    const route = useRoute()

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

    function groupsArraysAreEqual(a: number[], b: number[]) {
        if (a.length === b.length) {
            return a.every(element => {
                return b.includes(element)
            })
        }
        return false
    }

    async function validateUser(userGroups: number[]) {
        if (!groupsArraysAreEqual(userGroups, userManagerStore.userGroups)) {
            await _axios.post('/users/groups/', {username: userManagerStore.user?.username, groups: userGroups})
            for (let i = 0; i < userManagerStore.userGroups.length; i++) {
                await _axios.delete(`/users/groups/${userManagerStore.user?.id}/${userManagerStore.userGroups[i]}`)
            }
        }
        await _axios.patch(`/users/${userManagerStore.user?.id}`, {isValidatedByAdmin: true})
        userManagerStore.user = undefined
        userManagerStore.users = []
    }

    async function deleteUser() {
        await _axios.delete(`/users/${userManagerStore.user?.id}`)
        await userManagerStore.getUsers()
    }

    return {getUsers, getUser, validateUser, deleteUser}
}