import {useRoute} from 'vue-router'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import type {UserAssociationDetail, UserAssociationManagement, UserAssociationStatus} from '#/user'
import {ref} from 'vue'
import useUserGroups from '@/composables/useUserGroups'


const newUserAssociations = ref<UserAssociationStatus[]>([])

const userAssociations = ref<UserAssociationManagement[]>([])

export default function () {

    const route = useRoute()
    const userManagerStore = useUserManagerStore()
    const {updateUserGroups} = useUserGroups()


    async function getUsers() {
        if (route.name === 'ValidateUsers') {
            await userManagerStore.getUnvalidatedUsers()
        }
        if (route.name === 'ManageUsers') {
            await userManagerStore.getUsers()
        }
    }

    async function validateUser() {
        await updateUserGroups()
        await userManagerStore.validateUser()
    }

    function updateUserAssociations() {
        userAssociations.value.forEach(async function (association) {
            // If we need to delete the association
            if (association.deleteAssociation) {
                await userManagerStore.deleteUserAssociation(association.associationId)
            }
            // If we need to update the association
            else {
                // We search for the corresponding association in store
                const storeAssociation: UserAssociationDetail | undefined = userManagerStore.userAssociations.find(obj =>
                    obj.association.id === association.associationId)
                // We set a boolean to track changes
                let hasChanges = false
                // We compare the 2 objects
                for (const [key, value] of Object.entries(association)) {
                    if (key == 'roleName' || key == 'hasOfficeStatus' || key == 'isPresident') {
                        if (value !== storeAssociation?.[key as keyof UserAssociationDetail]) {
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