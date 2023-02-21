import {useUserManagerStore} from '@/stores/useUserManagerStore'
import type {AssociationRole, AssociationUser, AssociationUserDetail, UserGroup} from '#/user'
import {ref} from 'vue'
import useUserGroups from '@/composables/useUserGroups'
import useSecurity from "@/composables/useSecurity";

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
    // To test
    async function getUsers(routeName: string) {
        if (routeName === 'ValidateUsers') {
            let byInstitution = false
            if (hasPerm('change_associationusers') && !hasPerm('change_associationusers_any_institution')) {
                byInstitution = true
            }
            await userManagerStore.getUnvalidatedUsers(byInstitution)
        }
        if (routeName === 'ManageUsers' && hasPerm('change_associationusers_any_institution')) {
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
            if (association.id && association.deleteAssociation) {
                await userManagerStore.deleteUserAssociation(association.id)
            }
            // If we need to update the association
            else {
                // We search for the corresponding association in store
                const storeAssociation: AssociationUserDetail | undefined = userManagerStore.userAssociations.find(obj =>
                    obj.id === association.id)
                // We set a boolean to track changes
                let hasChanges = false
                // We compare the 2 objects
                for (const [key, value] of Object.entries(association)) {
                    const availableKeys = ['isPresident', 'canBePresident', 'isSecretary', 'isTreasurer']
                    if (availableKeys.indexOf(key) !== -1) {
                        if (value !== storeAssociation?.[key as keyof AssociationUserDetail]) {
                            hasChanges = true
                        }
                    }
                }
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

    // To test
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

    return {
        getUsers,
        updateUserAssociations,
        userAssociations,
        validateUser,
        newUserAssociations,
        canEditUser
    }
}
