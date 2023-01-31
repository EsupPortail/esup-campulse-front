import {ref} from 'vue'

import type {AssociationSocialNetwork, EditedAssociation} from '#/association'
import type {UserAssociations} from '#/user'
import useUtility from '@/composables/useUtility'
import {useAxios} from '@/composables/useAxios'
import {useAssociationStore} from '@/stores/useAssociationStore'


const newAssociations = ref<UserAssociations>([])

// Need to modify the social networks of an association
const associationSocialNetworks = ref<AssociationSocialNetwork[]>([])

// Changed data when modifying an association
let changedData = {}

export default function () {

    const associationStore = useAssociationStore()


    async function createAssociation(name: string) {
        const {axiosAuthenticated} = useAxios()
        await axiosAuthenticated.post('/associations/', {name: name})
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
            else if (key == 'institution' && value !== associationStore.association?.institution?.id) {
                changedData = Object.assign(changedData, {[key]: value})
            } else if (key == 'institutionComponent' && value !== associationStore.association?.institutionComponent?.id) {
                changedData = Object.assign(changedData, {[key]: value})
            } else if (key == 'activityField' && value !== associationStore.association?.activityField?.id) {
                changedData = Object.assign(changedData, {[key]: value})
            }
            // Check date
            else if (key == 'lastGoaDate' && value !== formatDate(associationStore.association?.lastGoaDate as string)) {
                if (value !== null) {
                    changedData = Object.assign(changedData, {lastGoaDate: `${value}T00:00:00.000Z`})
                }
            }
        }
        // Check social media
        checkSocialNetworks()
        return changedData
    }

    function checkSocialNetworks() {
        let hasChanges = false
        // If there already are social networks
        if (associationStore.association?.socialNetworks.length !== 0) {
            // If there are as many networks in old and new arrays
            // Then we need to compare more deeply
            if (associationStore.association?.socialNetworks.length === associationSocialNetworks.value.length) {
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
                // If we detect changes, we can patch the new array
                if (hasChanges) {
                    changedData = Object.assign(changedData, {socialNetworks: associationSocialNetworks.value})
                }
            }
            // If there are not the same amount of networks
            else {
                // We can safely patch every new network
                changedData = Object.assign(changedData, {socialNetworks: associationSocialNetworks.value})
            }
        }
        // If there are not already social networks
        else {
            // But if there are new networks
            if (associationSocialNetworks.value.length !== 0) {
                // We can safely patch every new network
                changedData = Object.assign(changedData, {socialNetworks: associationSocialNetworks.value})
            }
        }
    }

    // test
    async function updateAssociation() {
        const {axiosAuthenticated} = useAxios()
        await axiosAuthenticated.patch(`/associations/${associationStore.association?.id}`, changedData)
    }


    return {
        createAssociation,
        newAssociations,
        addAssociation,
        removeAssociation,
        addNetwork,
        removeNetwork,
        associationSocialNetworks,
        checkChanges,
        updateAssociation,
        checkSocialNetworks,
        changedData
    }
}
