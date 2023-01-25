import { defineStore } from 'pinia'
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
import _axios from '@/plugins/axios'

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
        }
    },

    actions: {
        async getAssociations(forDirectory: boolean) {
            this.associations = (await _axios.get<AssociationList[]>(`/associations/${forDirectory ? '?is_public=true' : ''}`)).data
            this.associations.forEach((association) => {
                association.isVisible = true
            })
        },
        async getAssociationDetail(id: number) {
            if (this.association?.id !== id) {
                this.association = (await _axios.get<Association>(`/associations/${id}`)).data
            }
        },
        async updateAssociationLogo(logo: FormData, id: number) {
            if (this.association) {
                const response = (await _axios.patch(`/associations/${id}`, logo)).data
                this.association.pathLogo = response.pathLogo
            }
        },
        async getInstitutions() {
            if (this.institutions.length === 0) {
                this.institutions = (await _axios.get<AssociationInstitution[]>('/associations/institutions')).data
            }
        },
        async getComponents() {
            if (this.components.length === 0) {
                this.components = (await _axios.get<AssociationComponent[]>('/associations/institution_components')).data
            }
        },
        async getFields() {
            if (this.fields.length === 0) {
                this.fields = (await _axios.get<AssociationField[]>('/associations/activity_fields')).data
            }
        },
        async deleteAssociation(associationId: number | undefined = undefined) {
            if (associationId === null) {
                associationId = this.association?.id
            }
            const assoToDelete = this.associations.findIndex((association) => association.id === associationId)
            await _axios.delete(`/associations/${associationId}`)
            this.associations.splice(assoToDelete, 1)
        },
        async patchEnabledAssociation(isEnabled: boolean, associationId: number | undefined = undefined) {
            if (associationId === null) {
                associationId = this.association?.id
            }
            const assoToEnable = this.associations.findIndex((association) => association.id === associationId)
            const updatedAssociation = (await _axios.patch(`/associations/${associationId}`, { isEnabled })).data
            this.associations[assoToEnable].isEnabled = updatedAssociation.isEnabled
            if (this.association) {
                this.association.isEnabled = updatedAssociation.isEnabled
            }
        }
    }
})
