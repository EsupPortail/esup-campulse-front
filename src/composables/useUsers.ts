import {useUserManagerStore} from '@/stores/useUserManagerStore'
import type {User, UserGroup, UserManagerStore, UserSearch, UserStore, UserToUpdate} from '#/user'
import {ref} from 'vue'
import useUserGroups from '@/composables/useUserGroups'
import {useAxios} from '@/composables/useAxios'
import {useUserStore} from '@/stores/useUserStore'
import useUtility from '@/composables/useUtility'

// Used to update user infos
const userToUpdate = ref<UserToUpdate>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    newEmail: '',
    newEmailVerification: '',
    phone: '',
    address: '',
    zipcode: '',
    city: '',
    country: ''
})

// Used to patch user
interface InfosToPatch {
    firstName?: string,
    lastName?: string,
    email?: string,
    phone?: string,
    address?: string,
    zipcode?: string,
    city?: string,
    country?: string,
    username?: string
}

const infosToPatch: InfosToPatch = {}


export default function () {

    const userManagerStore = useUserManagerStore()
    const {updateUserGroups} = useUserGroups()
    const {filterizeSearch} = useUtility()

    async function validateUser() {
        await updateUserGroups()
        await userManagerStore.validateUser()
    }

    function canEditUser(userGroups: UserGroup[]): boolean {
        const {groups} = useUserGroups()
        let perm = false
        if (userGroups.length && groups.value.length) {
            perm = true
            for (const userGroup of userGroups) {
                const group = groups.value.find(obj => obj.id === userGroup.groupId)
                if (!group?.isPublic) {
                    perm = false
                    break
                }
            }
        }
        return perm
    }

    async function updateUserInfos(user: User | undefined, editedByStaff: boolean) {
        const hasInfosToPatch = Object.keys(infosToPatch).length
        if (!hasInfosToPatch) return
        let store: UserStore | UserManagerStore = useUserStore()
        let url = '/users/auth/user/'
        if (editedByStaff) {
            store = userManagerStore
            url = `/users/${user?.id}`
        }
        const {axiosAuthenticated} = useAxios()
        store.user = (await axiosAuthenticated.patch(url, infosToPatch)).data
    }

    function initInfosToPatch(user: User | undefined) {
        for (const key of Object.keys(infosToPatch)) {
            delete infosToPatch[key as keyof typeof infosToPatch]
        }
        if (userToUpdate.value.firstName && (userToUpdate.value.firstName !== user?.firstName)) infosToPatch.firstName = userToUpdate.value.firstName
        if (userToUpdate.value.lastName && (userToUpdate.value.lastName !== user?.lastName)) infosToPatch.lastName = userToUpdate.value.lastName
        if (userToUpdate.value.newEmail && userToUpdate.value.newEmail !== userToUpdate.value.email &&
            userToUpdate.value.newEmail === userToUpdate.value.newEmailVerification) infosToPatch.email = userToUpdate.value.newEmail
        if (userToUpdate.value.phone !== user?.phone) infosToPatch.phone = userToUpdate.value.phone
        if (userToUpdate.value.address !== user?.address) infosToPatch.address = userToUpdate.value.address
        if (userToUpdate.value.zipcode !== user?.zipcode) infosToPatch.zipcode = userToUpdate.value.zipcode
        if (userToUpdate.value.city !== user?.city) infosToPatch.city = userToUpdate.value.city
        if (userToUpdate.value.country !== user?.country) infosToPatch.country = userToUpdate.value.country
    }

    function advancedSearch(settings: UserSearch) {
        const hasSettings: boolean = !!(settings.firstName || settings.lastName || settings.email || settings.association)
        if (!userManagerStore.users.length || !hasSettings) return
        let matches: User[] = []
        if (settings.firstName) {
            const term = filterizeSearch(settings.firstName)
            matches = userManagerStore.users.filter(user => {
                return filterizeSearch(user.firstName).includes(term)
            })
        }
        if (settings.lastName) {
            // checking if a search has already been made
            // If so, we filter on current matches, if not, we filter in store
            const term = filterizeSearch(settings.lastName)
            matches = (matches.length ? matches : userManagerStore.users).filter(user => {
                return filterizeSearch(user.lastName).includes(term)
            })
        }
        if (settings.email) {
            matches = (matches.length ? matches : userManagerStore.users).filter(user => {
                return user.email === settings.email
            })
        }
        if (settings.association) {
            matches = (matches.length ? matches : userManagerStore.users).filter(user => {
                return user.associations.map(association => association.id).includes(settings.association)
            })
        }
        return matches
    }

    return {
        validateUser,
        canEditUser,
        userToUpdate,
        updateUserInfos,
        infosToPatch,
        initInfosToPatch,
        advancedSearch
    }
}
