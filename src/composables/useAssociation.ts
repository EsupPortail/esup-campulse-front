import {ref} from 'vue'
import i18n from "@/plugins/i18n";
import type {Association, AssociationSocialNetwork, EditedAssociation, NewAssociation} from '#/association'
import type {AssociationRole, AssociationUser} from '#/user'
import useUtility from '@/composables/useUtility'
import {useAxios} from '@/composables/useAxios'
import {useAssociationStore} from '@/stores/useAssociationStore'


const newAssociations = ref<AssociationRole[]>([])
const newAssociationsUser = ref<AssociationUser[]>([])

// Need to modify the social networks of an association
const associationSocialNetworks = ref<AssociationSocialNetwork[]>([])

// Changed data when modifying an association
let changedData = {}

export default function () {

    const associationStore = useAssociationStore()

    /** Setup altLogo default value if association does not have one
     *
     * @param association
     */
    function altLogoText(association: Association | EditedAssociation) {
        return association?.altLogo !== "" ? association?.altLogo : i18n.global.t('association.logo.default-alt') + association?.name
    }

    /* Used to create the options for the select in the form to create an association. */
    const associationRoleOptions = [
        {
            label: i18n.global.t('forms.im-association-president'),
            value: "isPresident",
        },
        {
            label: i18n.global.t('forms.im-association-secretary'),
            value: "isSecretary"
        },
        {
            label: i18n.global.t('forms.im-association-treasurer'),
            value: "isTreasurer"
        }
    ]


    /**
     * It creates an association with the name provided as a parameter
     * @param newAssociation
     */
    async function createAssociation(newAssociation: NewAssociation) {
        const {axiosAuthenticated} = useAxios()
        await axiosAuthenticated.post('/associations/', newAssociation)
    }


    /**
     * When the user clicks the 'Add Association' button in registration for example,
     * add a new association to the list of associations.
     *
     * The function is called when the user clicks the 'Add Association' button
     *
     * It's the same for the 'Remove Association' function below.
     */
    function addAssociation() {
        newAssociations.value.push({
            id: null,
            role: '',
            options: associationRoleOptions
        })
    }

    function removeAssociation(index: number) {
        newAssociations.value.splice(index, 1)
    }

    function checkHasPresident(associationId: number) {
        for (const association of associationStore.associationNames) {
            if (association.id === associationId) {
                return association.hasPresident
            }
        }
    }

    function updateRegisterRoleInAssociation(): AssociationUser[] {
        newAssociationsUser.value = []
        newAssociations.value.forEach(association => {
            newAssociationsUser.value.push({
                id: association.id,
                name: "",
                isPresident: association.role === 'isPresident',
                canBePresident: false,
                isValidatedByAdmin: false,
                isSecretary: association.role === 'isSecretary',
                isTreasurer: association.role === 'isTreasurer'
            })
        })
        return newAssociationsUser.value
    }


    /**
     * It adds a new network to the associationSocialNetworks array.
     *
     * It works with the 'Remove Network' function below.
     */
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


    /**
     * It checks if the data of an association has been modified by a member or a manager and returns the changed data
     * @param {EditedAssociation} association - EditedAssociation
     * @returns an object with the keys of the changed data and the values of the changed data.
     */
    function checkChanges(association: EditedAssociation) {
        changedData = {}
        const {formatDate} = useUtility()
        for (const [key, value] of Object.entries(association)) {
            // Check non formatted values first
            const indexes = ['name', 'acronym', 'socialObject', 'currentProjects', 'address', 'email', 'phone', 'siret', 'website', 'presidentNames', 'presidentPhone']
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

    /**
     * It checks if there are changes in an association's social networks array
     *
     * If the association have already social networks, we check if there are the same amount of networks in the old and new arrays,
     * if so we check if the type or location of the networks have changed, if so we patch the new array,
     * if not we do nothing,
     * if there are not the same amount of networks we patch the new array,
     * if there are not already social networks but there are new networks we patch the new array,
     * if there are not already social networks and there are no new networks we do nothing
     */
    function checkSocialNetworks() {
        let hasChanges = false
        // If there already are social networks
        if (associationStore.association?.socialNetworks?.length !== 0) {
            // If there are as many networks in old and new arrays
            // Then we need to compare more deeply
            if (associationStore.association?.socialNetworks?.length === associationSocialNetworks.value.length) {
                associationStore.association?.socialNetworks.some((socialNetwork) => {
                    // Look for the same types
                    const editedType = associationSocialNetworks.value.find(({type}) => type === socialNetwork.type)
                    // If type has changed
                    if (editedType === undefined && !hasChanges) {
                        hasChanges = true
                        return hasChanges
                    }
                    // If location has changed
                    const editedLocation = associationSocialNetworks.value.find(({location}) => location === socialNetwork.location)
                    if (editedLocation === undefined && !hasChanges) {
                        hasChanges = true
                        return hasChanges
                    }
                })
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

    async function changeAssociationLogo(newLogo: undefined | Blob, altLogo: string, deleteLogoData: null | object) {
        if (deleteLogoData === null) {
            const patchLogoData = new FormData()
            if (typeof newLogo === 'object') {
                patchLogoData.append('pathLogo', newLogo)
                if (altLogo === associationStore.association?.altLogo) {
                    altLogo = ""
                }
            }
            patchLogoData.append('altLogo', altLogo)
            await associationStore.updateAssociationLogo(patchLogoData, associationStore.association?.id as number)
        } else {
            await associationStore.updateAssociationLogo(deleteLogoData, associationStore.association?.id as number)
        }
    }


    return {
        createAssociation,
        newAssociations,
        newAssociationsUser,
        addAssociation,
        removeAssociation,
        addNetwork,
        removeNetwork,
        associationSocialNetworks,
        checkChanges,
        updateAssociation,
        checkSocialNetworks,
        changedData,
        altLogoText,
        checkHasPresident,
        updateRegisterRoleInAssociation,
        changeAssociationLogo,
        associationRoleOptions
    }
}
