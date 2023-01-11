import _axios from '@/plugins/axios'
import {computed, ref} from 'vue'
import type {User, UserAssociations} from '#/user'
import type {
    AssociationComponent,
    AssociationField,
    AssociationInstitution,
    AssociationList,
    AssociationSocialNetwork
} from '#/association'
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
            field: association.activityField?.name
        })
    )
})

// Needed to manage the institution of an association
const associationInstitutions = ref<AssociationInstitution[]>([])
const associationInstitutionsLabels = computed(() => {
    return associationInstitutions.value.map(
        institution => ({
            value: institution.id,
            label: institution.name
        })
    )
})

// Needed to manage the component of an association
const associationComponents = ref<AssociationComponent[]>([])
const associationComponentsLabels = computed(() => {
    return associationComponents.value.map(
        component => ({
            value: component.id,
            label: component.name
        })
    )
})

// Needed to manage the component of an association
const associationFields = ref<AssociationField[]>([])
const associationFieldsLabels = computed(() => {
    return associationFields.value.map(
        field => ({
            value: field.id,
            label: field.name
        })
    )
})

export default function () {

    async function createAssociation(name: string) {
        await _axios.post('/associations/', {name: name})
    }

    // Add or remove new multiple associations
    function addAssociation() {
        newAssociations.value.push({
            id: null,
            hasOfficeStatus: false
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

    // to test
    async function getAssociationInstitutions() {
        if (associationInstitutions.value.length === 0) {
            associationInstitutions.value = (await _axios.get<AssociationInstitution[]>('/associations/institutions')).data
        }
    }

    function getCurrentInstitutionLabel() {
        if (associationStore.association?.institution) {
            return associationInstitutionsLabels.value.find(({value}) => value === associationStore.association?.institution.id)
        } else {
            return undefined
        }
    }

    async function getAssociationComponents() {
        if (associationComponents.value.length === 0) {
            associationComponents.value = (await _axios.get<AssociationComponent[]>('/associations/institution_components')).data
        }
    }

    function getCurrentComponentLabel() {
        if (associationStore.association?.institutionComponent) {
            return associationComponentsLabels.value.find(({value}) => value === associationStore.association?.institutionComponent.id)
        } else {
            return undefined
        }
    }

    async function getAssociationFields() {
        if (associationFields.value.length === 0) {
            associationFields.value = (await _axios.get<AssociationField[]>('/associations/activity_fields')).data
        }
    }

    function getCurrentFieldLabel() {
        if (associationStore.association?.activityField) {
            return associationFieldsLabels.value.find(({value}) => value === associationStore.association?.activityField.id)
        } else {
            return undefined
        }
    }

    // Manage the social networks of an association
    function addNetwork() {
        const newNetwork: AssociationSocialNetwork = {
            type: '',
            location: ''
        }
        associationStore.association?.socialNetworks.push(newNetwork)
    }

    function removeNetwork(index: number) {
        associationStore.association?.socialNetworks.splice(index, 1)
    }


    return {
        createAssociation,
        newAssociations,
        addAssociation,
        removeAssociation,
        getManagedAssociations,
        managedAssociations,
        managedAssociationsDirectory,
        getAssociationInstitutions,
        associationInstitutionsLabels,
        getCurrentInstitutionLabel,
        associationComponentsLabels,
        getAssociationComponents,
        getCurrentComponentLabel,
        associationFieldsLabels,
        getAssociationFields,
        getCurrentFieldLabel,
        addNetwork,
        removeNetwork
    }
}