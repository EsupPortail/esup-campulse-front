import { computed, ref } from 'vue'

import type { AssociationList, AssociationSocialNetwork, EditedAssociation } from '#/association'
import type { User, UserAssociations } from '#/user'
import useUtility from '@/composables/useUtility'
import _axios from '@/plugins/axios'
import { useUserStore } from '@/stores/useUserStore'
import { useAssociationStore } from '@/stores/useAssociationStore'

const associationStore = useAssociationStore()

const newAssociations = ref<UserAssociations>([])

const managedAssociations = ref<AssociationList[]>([])
const managedAssociationsDirectory = computed(() => {
    return managedAssociations.value.map(
        association => ({
            id: association.id,
            name: association.name,
            acronym: association.acronym,
            institution: association.institution?.name,
            component: association.institutionComponent?.name,
            field: association.activityField?.name,
            isEnabled: association.isEnabled,
            email: association.email,
        })
    )
})

// Need to modify the social networks of an association
const associationSocialNetworks = ref<AssociationSocialNetwork[]>([])

// Changed data when modifying an association
let changedData = {}

export default function() {

    async function createAssociation(name: string) {
        await _axios.post('/associations/', { name: name })
    }

    // Add or remove new multiple associations
    function addAssociation() {
        newAssociations.value.push({
            id: null,
            roleName: null,
            hasOfficeStatus: false,
            isPresident: false
        })
    }

    function removeAssociation(index: number) {
        newAssociations.value.splice(index, 1)
    }

    // to test for #14
    // Get the associations managed by the user depending on status or association role
    async function getManagedAssociations() {
        const userStore = useUserStore()
        if (userStore.isAuth && managedAssociations.value.length === 0) {
            const associationStore = useAssociationStore()
            if (userStore.isUniManager) {
                await associationStore.getAssociations(false)
                managedAssociations.value = associationStore.associations
            } else {
                for (let i = 0; i < (userStore.user as User).associations.length; i++) {
                    const associationId = userStore.user?.associations[i].id
                    const associationDetail = (await _axios.get<AssociationList>(`/associations/${associationId}`)).data
                    managedAssociations.value.push(associationDetail)
                }
                // Get roles only for associations members
                await userStore.getUserAssociationsRoles()
            }
        }
    }

    // Manage the social networks of an association
    function addNetwork() {
        const newNetwork: AssociationSocialNetwork = {
            type: '',
            location: ''
        }
        associationSocialNetworks.value?.push(newNetwork)
    }

    function removeNetwork(index: number) {
        associationSocialNetworks.value?.splice(index, 1)
    }

    // Check if user has modified the association
    function checkChanges(association: EditedAssociation) {
        const { formatDate } = useUtility()
        for (const [key, value] of Object.entries(association)) {
            // Check non formatted values first
            const indexes = ['name', 'acronym', 'description', 'activities', 'address', 'email', 'phone', 'siret', 'website', 'presidentNames']
            if (indexes.indexOf(key) !== -1) {
                if (value !== associationStore.association?.[key as keyof typeof associationStore.association]) {
                    changedData = Object.assign(changedData, { [key]: value })
                }
            }
            // Check institution, component and field
            else if (key == 'institution' && value !== association.institution) {
                changedData = Object.assign(changedData, { [key]: value })
            } else if (key == 'institutionComponent' && value !== association.institutionComponent) {
                changedData = Object.assign(changedData, { [key]: value })
            } else if (key == 'activityField' && value !== association.activityField) {
                changedData = Object.assign(changedData, { [key]: value })
            }
            // Check dates
            else if (key == 'approvalDate' && value !== formatDate(associationStore.association?.approvalDate as string)) {
                changedData = Object.assign(changedData, { approvalDate: `${value}T00:00:00.000Z` })
            } else if (key == 'lastGoaDate' && value !== formatDate(associationStore.association?.lastGoaDate as string)) {
                changedData = Object.assign(changedData, { lastGoaDate: `${value}T00:00:00.000Z` })
            }
        }
        // Check social media
        let hasChanges = false
        for (let i = 0; i < associationSocialNetworks.value.length; i++) {
            // Changes in type or location -> patch
            const unchangedType = associationSocialNetworks.value.find(({ type }) => type === associationStore.association?.socialNetworks[i].type)
            if (!unchangedType && !hasChanges) { // if a type has changed
                hasChanges = true
                break
            }
            const unchangedLocation = associationSocialNetworks.value.find(({ location }) => location === associationStore.association?.socialNetworks[i].location)
            if (!unchangedLocation && !hasChanges) { // if a location has changed
                hasChanges = true
                break
            }
        }
        if (hasChanges) {
            changedData = Object.assign(changedData, { socialNetworks: associationSocialNetworks.value })
        }
    }


    return {
        createAssociation,
        newAssociations,
        addAssociation,
        removeAssociation,
        getManagedAssociations,
        managedAssociations,
        managedAssociationsDirectory,
        addNetwork,
        removeNetwork,
        associationSocialNetworks,
        checkChanges,
        changedData
    }
}
