import {useUserManagerStore} from '@/stores/useUserManagerStore'
import type {AssociationUser, UserAssociationManagement, UserAssociationStatus} from '#/user'
import {ref} from 'vue'
import useUserGroups from '@/composables/useUserGroups'

// Used to store a new user's associations
const newUserAssociations = ref<UserAssociationStatus[]>([])

// Used to store a user's associations, while it is modified by a manager
const userAssociations = ref<UserAssociationManagement[]>([])

export default function () {

    const userManagerStore = useUserManagerStore()
    const {updateUserGroups} = useUserGroups()


    /**
     * If the route is ValidateUsers, get the unvalidated users, otherwise get all the users
     * It is used on the same view to get various data sets based on the route
     */
    async function getUsers(routeName: string) {
        if (routeName === 'ValidateUsers') {
            await userManagerStore.getUnvalidatedUsers()
        }
        if (routeName === 'ManageUsers') {
            await userManagerStore.getUsers()
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
            if (association.deleteAssociation) {
                await userManagerStore.deleteUserAssociation(association.associationId)
            }
            // If we need to update the association
            else {
                // We search for the corresponding association in store
                const storeAssociation: AssociationUser | undefined = userManagerStore.userAssociations.find(obj =>
                    obj.id === association.associationId)
                // We set a boolean to track changes
                let hasChanges = false
                // We compare the 2 objects
                for (const [key, value] of Object.entries(association)) {
                    if (key == 'roleName' || key == 'hasOfficeStatus' || key == 'isPresident') {
                        if (value !== storeAssociation?.[key as keyof AssociationUser]) {
                            hasChanges = true
                        }
                    }
                }
                if (hasChanges) {
                    const infosToPatch = {
                        roleName: association.roleName,
                        hasOfficeStatus: association.hasOfficeStatus,
                        isPresident: association.isPresident,
                    }
                    await userManagerStore.patchUserAssociations(association.associationId, infosToPatch)
                }
            }
        })
    }

    return {
        getUsers,
        updateUserAssociations,
        userAssociations,
        validateUser,
        newUserAssociations
    }
}