import {useUserManagerStore} from '@/stores/useUserManagerStore'
import type {
    AssociationRole,
    AssociationUser,
    AssociationUserDetail,
    User,
    UserGroup,
    UserManagerStore,
    UserStore,
    UserToUpdate
} from '#/user'
import {ref} from 'vue'
import useUserGroups from '@/composables/useUserGroups'
import useSecurity from '@/composables/useSecurity'
import {useAxios} from "@/composables/useAxios";
import {useUserStore} from "@/stores/useUserStore";

// Used to update user infos
const userToUpdate = ref<UserToUpdate>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    newEmail: '',
    newEmailVerification: '',
    phone: ''
})

// Used to store a new user's associations
const newUserAssociations = ref<AssociationUser[]>([])

// Used to store a user's associations, while it is modified by a manager
const userAssociations = ref<AssociationRole[]>([])

export default function () {

    const userManagerStore = useUserManagerStore()
    const {updateUserGroups} = useUserGroups()
    const {hasPerm} = useSecurity()


    /**
     * If the route is ValidateUsers, get the unvalidated users, otherwise get all the users
     * It is used on the same view to get various data sets based on the route
     */
    async function getUsers(routeName: string) {
        if (hasPerm('change_associationusers')) {
            if (routeName === 'ValidateUsers') await userManagerStore.getUnvalidatedUsers()
            if (routeName === 'ManageUsers') await userManagerStore.getUsers()
        }
    }

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
     * It updates the user associations when it is modified by a manager
     */
    function updateUserAssociations() {
        userAssociations.value.forEach(async function (association) {
            // If we need to delete the association
            if (association.id && association.deleteAssociation) {
                await userManagerStore.deleteUserAssociation(association.id)
            }
            // If we need to update the association
            else {
                // We search for the corresponding association in store
                const storeAssociation: AssociationUserDetail | undefined = userManagerStore.userAssociations.find(obj =>
                    obj.association.id === association.id)
                // We set a boolean to track changes
                let hasChanges = false
                // We compare the 2 objects
                console.log(storeAssociation)
                if (storeAssociation?.canBePresident !== association.canBePresident) hasChanges = true
                if (storeAssociation?.isPresident && association.role !== 'isPresident') hasChanges = true
                if (storeAssociation?.isSecretary && association.role !== 'isSecretary') hasChanges = true
                if (storeAssociation?.isTreasurer && association.role !== 'isTreasurer') hasChanges = true

                if (hasChanges && association.id) {
                    const infosToPatch = {
                        isPresident: association.role === 'isPresident',
                        canBePresident: association.canBePresident ? association.canBePresident : false,
                        isSecretary: association.role === 'isSecretary',
                        isTreasurer: association.role === 'isTreasurer',
                    }
                    await userManagerStore.patchUserAssociations(association.id, infosToPatch)
                }
            }
        })
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
    async function updateUserInfos(user: User, editedByStaff: boolean) {
        interface InfosToPatch {
            firstName?: string,
            lastName?: string,
            email?: string,
            phone?: string,
            username?: string
        }

        const infosToPatch: InfosToPatch = {}
        if (userToUpdate.value.firstName !== user.firstName) infosToPatch.firstName = userToUpdate.value.firstName
        if (userToUpdate.value.lastName !== user.lastName) infosToPatch.lastName = userToUpdate.value.lastName
        if (userToUpdate.value.newEmail && userToUpdate.value.newEmail !== userToUpdate.value.email &&
            userToUpdate.value.newEmail === userToUpdate.value.newEmailVerification) infosToPatch.username = userToUpdate.value.newEmail
        if (userToUpdate.value.phone !== user.phone) infosToPatch.phone = userToUpdate.value.phone
        if (Object.keys(infosToPatch).length > 0) {
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

    return {
        getUsers,
        updateUserAssociations,
        userAssociations,
        validateUser,
        newUserAssociations,
        canEditUser,
        userToUpdate,
        updateUserInfos
    }
}
