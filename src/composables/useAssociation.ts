import {ref} from 'vue'
import type {Association, AssociationSocialNetwork, EditedAssociation, NewAssociation} from '#/association'
import type {AssociationRole} from '#/user'
import useUtility from '@/composables/useUtility'
import {useAxios} from '@/composables/useAxios'
import {useAssociationStore} from '@/stores/useAssociationStore'
import useUserAssociations from '@/composables/useUserAssociations'
import useDocumentUploads from '@/composables/useDocumentUploads'


// Needed to modify the social networks of an association
const associationSocialNetworks = ref<AssociationSocialNetwork[]>([])

// Needed to temporarily store associations (for searching and pagination)
const associations = ref<Association[]>([])

// Changed data when modifying an association
let changedData = {}

export default function () {

    const associationStore = useAssociationStore()
    const {newAssociations} = useUserAssociations()
    const {processDocuments} = useDocumentUploads()

    /**
     * It creates an association with the name provided as a parameter
     * @param newAssociation
     */
    async function createAssociation(newAssociation: NewAssociation) {
        const {axiosAuthenticated} = useAxios()
        await axiosAuthenticated.post('/associations/', newAssociation)
    }

    /**
     * If the association has a president, then disable the president role and remove the president role from the
     * association
     * @param {AssociationRole} association - AssociationRole - this is the association that is being checked
     */
    function checkHasPresident(association: AssociationRole) {
        if (association.options) {
            association.options[0].disable = false
            const associationDetail = associationStore.associationNames.find(obj => obj.id === association.id)
            if (associationDetail) {
                if (associationDetail.hasPresident) {
                    association.options[0].disable = true
                    if (association.role === 'isPresident') {
                        const model = newAssociations.value.find(obj => obj.id === association.id)
                        if (model) model.role = 'isMember'
                    }
                }
            }
        }
    }

    // Commented in component since issue is not clear
    function checkHasStudentCertificate(association: AssociationRole) {
        if (association.options) {
            // If new user has not uploaded a student certificate
            // He/she cannot join an association as an office member
            if (processDocuments.value.filter(doc => doc.pathFile).length === 0) {
                association.options.forEach(association => {
                    if (association.isInOffice) association.disable = true
                })
            } else {
                association.options.forEach(association => {
                    if (association.isInOffice) association.disable = false
                })
            }
        }
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
            const indexes = ['name', 'acronym', 'socialObject', 'currentProjects', 'address', 'zipcode', 'city', 'country',
                'email', 'phone', 'siret', 'website', 'presidentNames', 'presidentPhone', 'presidentEmail']
            if (indexes.includes(key)) {
                if (value !== associationStore.association?.[key as keyof typeof associationStore.association]) {
                    changedData = Object.assign(changedData, {[key]: value})
                }
            }
            // Check amountMembersAllowed
            else if (key == 'amountMembersAllowed' || key == 'studentCount') {
                if (parseInt(value) !== associationStore.association?.[key as keyof typeof associationStore.association]) {
                    changedData = Object.assign(changedData, {[key]: parseInt(value)})
                }
            }
            // Check institution, component and field
            else if (key == 'institution' && value !== associationStore.association?.institution) {
                changedData = Object.assign(changedData, {[key]: value})
            } else if (key == 'institutionComponent' && value !== associationStore.association?.institutionComponent) {
                changedData = Object.assign(changedData, {[key]: value})
            } else if (key == 'activityField' && value !== associationStore.association?.activityField) {
                changedData = Object.assign(changedData, {[key]: value})
            }
            // Check date
            else if (key == 'lastGoaDate' && value !== formatDate(associationStore.association?.lastGoaDate as string)) {
                if (value !== null) {
                    changedData = Object.assign(changedData, {lastGoaDate: value})
                }
            }
        }
        // Check social media
        checkSocialNetworks()
        return changedData
    }

    function checkSocialNetworks() {
        let hasChanges = false
        const current = associationStore.association?.socialNetworks
        const edited = associationSocialNetworks.value

        if (Array.isArray(current) && current.length !== 0) {
            if (current.length === edited.length) {
                current.some((socialNetwork) => {
                    const editedType = edited.find(({type}) => type === socialNetwork.type)
                    if (editedType === undefined && !hasChanges) {
                        hasChanges = true
                        return true
                    }

                    const editedLocation = edited.find(({location}) => location === socialNetwork.location)
                    if (editedLocation === undefined && !hasChanges) {
                        hasChanges = true
                        return true
                    }

                    return false
                })

                if (hasChanges) {
                    changedData = Object.assign(changedData, {socialNetworks: edited})
                }
            } else {
                changedData = Object.assign(changedData, {socialNetworks: edited})
            }
        } else {
            if (Array.isArray(edited) && edited.length !== 0) {
                changedData = Object.assign(changedData, {socialNetworks: edited})
            }
        }
    }

    /**
     * It updates the association in the database with the data that has been changed in the form
     */
    async function updateAssociation() {
        const {axiosAuthenticated} = useAxios()
        await axiosAuthenticated.patch(`/associations/${associationStore.association?.id}`, changedData)
    }

    async function changeAssociationLogo(newLogo: undefined | File, deleteLogoData: null | object) {
        if (deleteLogoData === null) {
            const patchLogoData = new FormData()
            if (newLogo instanceof File) {
                patchLogoData.append('pathLogo', newLogo)
            }
            await associationStore.updateAssociationLogo(patchLogoData, associationStore.association?.id as number)
        } else {
            await associationStore.updateAssociationLogo(deleteLogoData, associationStore.association?.id as number)
        }
    }

    async function getAssociationPdfExport(id: number) {
        const {axiosAuthenticated} = useAxios()
        return (await axiosAuthenticated.get<Blob>(`/associations/${id}/export`, {responseType: 'blob'})).data
    }


    return {
        createAssociation,
        addNetwork,
        removeNetwork,
        associationSocialNetworks,
        checkChanges,
        updateAssociation,
        checkSocialNetworks,
        changedData,
        checkHasPresident,
        changeAssociationLogo,
        associations,
        getAssociationPdfExport,
        checkHasStudentCertificate
    }
}
