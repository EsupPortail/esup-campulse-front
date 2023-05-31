import {useUserManagerStore} from '@/stores/useUserManagerStore'
import type {User, UserGroup, UserManagerStore, UserSearch, UserStore, UserToUpdate} from '#/user'
import {ref} from 'vue'
import useUserGroups from '@/composables/useUserGroups'
import {useAxios} from '@/composables/useAxios'
import {useUserStore} from '@/stores/useUserStore'
import useUtility from '@/composables/useUtility'
import useSecurity from '@/composables/useSecurity'

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

    //const {hasPerm} = useSecurity()

    /**
     * The function `validateUser` calls the function `updateUserGroups` and then calls the function `validateUser` on
     * the `userManagerStore`
     * When validating a user, we can update its groups and need to patch it to set isValidatedByAdmin to true.
     */
    async function validateUser() {
        await updateUserGroups()
        await userManagerStore.validateUser()
    }

    /**
     * If the user is in a group that is not public, then managers can't edit the user
     * @param {UserGroup[]} userGroups - UserGroup[] - this is the array of UserGroup objects that are associated with the
     * user.
     * @returns A boolean value.
     */
    function canEditUser(userGroups: UserGroup[]): boolean {
        const {groups} = useUserGroups()
        let perm = false
        if (userGroups.length && groups.value.length) {
            perm = true
            for (let i = 0; i < userGroups.length; i++) {
                const g = groups.value.find(obj => obj.id === userGroups[i].groupId)
                if (g && !g.isPublic) {
                    perm = false
                    break
                }
            }
        }
        return perm
    }

    /**
     * It takes a user object, compares it to the user object in the form, and if there are differences, it sends a patch
     * request to the server with the differences
     * @param {User} user - User: the user to update
     * @param editedByStaff
     */
    async function updateUserInfos(user: User | undefined, editedByStaff: boolean) {
        if (Object.keys(infosToPatch).length) {
            let store: UserStore | UserManagerStore = useUserStore()
            let url = '/users/auth/user/'
            if (editedByStaff) {
                store = userManagerStore
                url = `/users/${user?.id}`
            }
            const {axiosAuthenticated} = useAxios()
            store.user = (await axiosAuthenticated.patch(url, infosToPatch)).data
        }
    }

    /**
     * It deletes all the properties of the infosToPatch object, then it checks if the userToUpdate object has a different
     * value for each property, and if so, it adds the property to the infosToPatch object
     * @param {User | undefined} user - User | undefined: The user to update.
     */
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

    /**
     * It filters the users in the store based on the search settings on the front end
     * @param {UserSearch} settings - UserSearch
     * @returns An array of users that match the search criteria
     */
    function advancedSearch(settings: UserSearch) {
        if (userManagerStore.users.length > 0 && (settings.firstName || settings.lastName || settings.email)) {
            let matches: User[] = []
            if (settings.firstName) {
                matches = userManagerStore.users.filter(user => {
                    return filterizeSearch(user.firstName).includes(filterizeSearch(settings.firstName))
                })
            }
            if (settings.lastName) {
                // checking if a search has already been made
                // If so, we filter on current matches, if not, we filter in store
                if (matches.length) {
                    const newMatches = matches.filter(user => {
                        return filterizeSearch(user.lastName).includes(filterizeSearch(user.lastName))
                    })
                    matches = [...newMatches]
                } else {
                    matches = userManagerStore.users.filter(user => {
                        return filterizeSearch(user.lastName).includes(filterizeSearch(settings.lastName))
                    })
                }
            }
            if (settings.email) {
                if (matches.length) {
                    const newMatches = matches.filter(user => user.email === settings.email)
                    matches = [...newMatches]
                } else {
                    matches = userManagerStore.users.filter(user => user.email === settings.email)
                }
            }
            return matches
        }
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
