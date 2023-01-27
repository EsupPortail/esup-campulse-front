import {useRoute} from 'vue-router'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import type {UserAssociationDetail, UserAssociationManagement, UserAssociationStatus} from '#/user'
import {ref, watch} from 'vue'
import useUserGroups from '@/composables/useUserGroups'


const userManagerStore = useUserManagerStore()

const newUserAssociations = ref<UserAssociationStatus[]>(userManagerStore.userAssociationStatus)
watch(() => userManagerStore.userAssociations, () => {
    newUserAssociations.value = userManagerStore.userAssociationStatus
})

// Used in FormUpdateManagedUserAssociations
const userAssociations = ref<UserAssociationManagement[]>([])
watch(() => userManagerStore.userAssociations, () => {
    userManagerStore.userAssociations.forEach(function (association) {
        userAssociations.value.push({
            associationId: association.association.id,
            associationName: association.association.name,
            roleName: association.roleName,
            hasOfficeStatus: association.hasOfficeStatus,
            isPresident: association.isPresident,
            deleteAssociation: false
        })
    })
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

    // to re test
    async function validateUser() {
        await updateUserGroups()
        await userManagerStore.validateUser()
    }

    // Used in FormManagedUserUpdate - test for #8
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
        newUserAssociations,
        updateUserAssociations,
        userAssociations,
        validateUser
    }
}