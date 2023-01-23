import {computed, ref} from 'vue'

import type {AssociationList, AssociationSocialNetwork, EditedAssociation} from '#/association'
import type {User, UserAssociations} from '#/user'
import useUtility from '@/composables/useUtility'
import _axios from '@/plugins/axios'
import {useUserStore} from '@/stores/useUserStore'
import {useAssociationStore} from '@/stores/useAssociationStore'

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
            isEnabled: association.isEnabled
        })
    )
})

// Need to modify the social networks of an association
const associationSocialNetworks = ref<AssociationSocialNetwork[]>([])

// Changed data when modifying an association
let changedData = {}

export default function () {

    async function createAssociation(name: string) {
        await _axios.post('/associations/', {name: name})
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
                await associationStore.getAssociations()
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
        changedData = {}
        const {formatDate} = useUtility()
        for (const [key, value] of Object.entries(association)) {
            // Check non formatted values first
            const indexes = ['name', 'acronym', 'description', 'activities', 'address', 'email', 'phone', 'siret', 'website', 'presidentNames', 'phonePres']
            if (indexes.indexOf(key) !== -1) {
                if (value !== associationStore.association?.[key as keyof typeof associationStore.association]) {
                    changedData = Object.assign(changedData, {[key]: value})
                }
            }
            // Check institution, component and field
            else if (key == 'institution' && value !== associationStore.association?.institution.id) {
                changedData = Object.assign(changedData, {[key]: value})
            } else if (key == 'institutionComponent' && value !== associationStore.association?.institutionComponent.id) {
                changedData = Object.assign(changedData, {[key]: value})
            } else if (key == 'activityField' && value !== associationStore.association?.activityField.id) {
                changedData = Object.assign(changedData, {[key]: value})
            }
            // Check date
            else if (key == 'lastGoaDate' && value !== formatDate(associationStore.association?.lastGoaDate as string)) {
                changedData = Object.assign(changedData, {lastGoaDate: `${value}T00:00:00.000Z`})
            }
        }
        // Check social media
        checkSocialNetworks()
        return changedData
    }

    function checkSocialNetworks() {
        let hasChanges = false
        // If there already are social networks, and the same amount between old and new
        if (associationStore.association?.socialNetworks.length && associationStore.association?.socialNetworks.length === associationSocialNetworks.value.length) {
            for (let i = 0; i < associationStore.association?.socialNetworks.length; i++) {
                // Look for the same types
                const editedType = associationSocialNetworks.value.find(({type}) => type === associationStore.association?.socialNetworks[i].type)
                // If type has changed
                if (editedType === undefined && !hasChanges) {
                    hasChanges = true
                    break
                }
                // If location has changed
                const editedLocation = associationSocialNetworks.value.find(({location}) => location === associationStore.association?.socialNetworks[i].location)
                if (editedLocation === undefined && !hasChanges) {
                    hasChanges = true
                    break
                }
            }
            if (hasChanges) {
                changedData = Object.assign(changedData, {socialNetworks: associationSocialNetworks.value})
            }
        }
        // If there are only new social networks or new ones
        else {
            changedData = Object.assign(changedData, {socialNetworks: associationSocialNetworks.value})
        }
    }

    async function updateAssociation() {
        if (associationStore.association && changedData) {
            await _axios.patch(`/associations/${associationStore.association?.id}`, changedData)
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
        updateAssociation
    }
}
