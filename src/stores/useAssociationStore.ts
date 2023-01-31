import {defineStore} from 'pinia'
import type {
    Association,
    AssociationComponent,
    AssociationDirectory,
    AssociationField,
    AssociationInstitution,
    AssociationList,
    AssociationNames,
    AssociationStore
} from '#/association'
import {useAxios} from '@/composables/useAxios'
import {useUserStore} from '@/stores/useUserStore'
import type {User} from '#/user'


export const useAssociationStore = defineStore('associationStore', {
    state: (): AssociationStore => ({
        association: undefined,
        associations: [],
        institutions: [],
        components: [],
        fields: []
    }),

    getters: {
        associationNames: (state: AssociationStore): AssociationNames => {
            return state.associations
                .map(association => ({
                    value: association.id,
                    label: association.name
                }))
        },
        associationDirectory: (state: AssociationStore): AssociationDirectory => {
            return state.associations
                .map(association => ({
                    id: association.id,
                    name: association.name,
                    acronym: association.acronym,
                    institution: association.institution?.name,
                    component: association.institutionComponent?.name,
                    field: association.activityField?.name,
                }))
        },
        institutionLabels: (state: AssociationStore) => {
            return state.institutions.map((
                institution => ({
                    value: institution.id,
                    label: institution.name
                })))
        },
        componentLabels: (state: AssociationStore) => {
            return state.components.map((
                component => ({
                    value: component.id,
                    label: component.name
                })))
        },
        fieldLabels: (state: AssociationStore) => {
            return state.fields.map((
                field => ({
                    value: field.id,
                    label: field.name
                })))
        },
        managedAssociations: (state: AssociationStore) => {
            return state.associations.map(
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
        }
    },

    actions: {
        async getAssociations(forDirectory: boolean, forRegistration: boolean) {
            const {axiosPublic} = useAxios()
            let url = '/associations/'

            if (forDirectory) url += '?is_public=true'
            if (forRegistration) url += '?is_enabled=true'

            this.associations = (await axiosPublic.get<AssociationList[]>(url)).data
        },
        async getManagedAssociations() {
            const userStore = useUserStore()
            if (userStore.isUniManager) {
                await this.getAssociations(false, false)
            } else {
                this.associations = []
                const {axiosPublic} = useAxios()
                for (let i = 0; i < (userStore.user as User).associations.length; i++) {
                    const associationId = userStore.user?.associations[i].id
                    this.associations.push((await axiosPublic.get<AssociationList>(`/associations/${associationId}`)).data)
                }
            }
        },
        async getAssociationDetail(id: number) {
            const {axiosPublic} = useAxios()
            this.association = (await axiosPublic.get<Association>(`/associations/${id}`)).data
        },
        async updateAssociationLogo(logoData: FormData | object, id: number) {
            if (this.association) {
                const {axiosAuthenticated} = useAxios()
                const response = (await axiosAuthenticated.patch(`/associations/${id}`, logoData)).data
                this.association.pathLogo = response.pathLogo
            }
        },
        async getInstitutions() {
            if (this.institutions.length === 0) {
                const {axiosPublic} = useAxios()
                this.institutions = (await axiosPublic.get<AssociationInstitution[]>('/associations/institutions')).data
            }
        },
        async getComponents() {
            if (this.components.length === 0) {
                const {axiosPublic} = useAxios()
                this.components = (await axiosPublic.get<AssociationComponent[]>('/associations/institution_components')).data
            }
        },
        async getFields() {
            if (this.fields.length === 0) {
                const {axiosPublic} = useAxios()
                this.fields = (await axiosPublic.get<AssociationField[]>('/associations/activity_fields')).data
            }
        },
        // Test
        async deleteAssociation(associationId: number | undefined = undefined) {
            if (associationId === null) {
                associationId = this.association?.id
            }
            const {axiosAuthenticated} = useAxios()
            await axiosAuthenticated.delete(`/associations/${associationId}`)
        },
        // Test
        async patchEnabledAssociation(isEnabled: boolean, associationId: number | undefined = undefined) {
            if (associationId === null) {
                associationId = this.association?.id
            }
            const assoToEnable = this.associations.findIndex((association) => association.id === associationId)
            const {axiosAuthenticated} = useAxios()
            const updatedAssociation = (await axiosAuthenticated.patch(`/associations/${associationId}`, {isEnabled})).data
            this.associations[assoToEnable].isEnabled = updatedAssociation.isEnabled
            if (this.association) {
                this.association.isEnabled = updatedAssociation.isEnabled
            }
        }
    }
})
