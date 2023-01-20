import {defineStore} from 'pinia'
import type {
    ActivityFieldList,
    ActivityFieldNames,
    Association,
    AssociationList,
    AssociationNames,
    AssociationStore,
    InstitutionComponentList,
    InstitutionComponentNames,
    InstitutionList,
    InstitutionNames,
} from '#/association'
import _axios from '@/plugins/axios'

export const useAssociationStore = defineStore('associationStore', {
    state: (): AssociationStore => ({
        association: undefined,
        associations: [],
        institutions: [],
        institutionComponents: [],
        activityFields: []
    }),

    getters: {
        associationNames: (state: AssociationStore): AssociationNames => {
            return state.associations
                .map(association => ({
                    value: association.id,
                    label: association.name
                }))
        },
        /*associationDirectory: (state: AssociationStore): AssociationDirectory => {
            return state.associations
                .map(association => ({
                    id: association.id,
                    name: association.name,
                    acronym: association.acronym,
                    institution: association.institution?.name,
                    component: association.institutionComponent?.name,
                    field: association.activityField?.name
                }))
        },*/
        institutionNames: (state: AssociationStore): InstitutionNames => {
            return state.institutions
                .map(institution => ({
                    value: institution.id,
                    label: institution.name
                }))
        },
        institutionComponentNames: (state: AssociationStore): InstitutionComponentNames => {
            return state.institutionComponents
                .map(institutionComponent => ({
                    value: institutionComponent.id,
                    label: institutionComponent.name
                }))
        },
        activityFieldNames: (state: AssociationStore): ActivityFieldNames => {
            return state.activityFields
                .map(activityField => ({
                    value: activityField.id,
                    label: activityField.name
                }))
        },
    },

    actions: {
        async getAssociations() {
            if (this.associations.length === 0) {
                this.associations = (await _axios.get<AssociationList[]>('/associations/')).data
                this.associations.forEach((association) => {
                    association.isVisible = true
                })
            }
        },
        async getAssociationDetail(id: number) {
            if (this.association?.id !== id) {
                this.association = (await _axios.get<Association>(`/associations/${id}`)).data
            }
        },
        async getAssociationsListFields() {
            if (this.institutions.length === 0) {
                this.institutions = (await _axios.get<InstitutionList[]>('/associations/institutions')).data
                this.institutions.push({id: 0, name: "Non rattaché à une composante", acronym: ""})
            }
            if (this.institutionComponents.length === 0) {
                this.institutionComponents = (await _axios.get<InstitutionComponentList[]>('/associations/institution_components')).data
            }
            if (this.activityFields.length === 0) {
                this.activityFields = (await _axios.get<ActivityFieldList[]>('/associations/activity_fields')).data
            }
        },
        async deleteAssociation() {
            const assoToDelete = this.associations.findIndex((association) => association.id === this.association?.id)
            await _axios.delete('/associations/${this.association?.id}')
            this.associations.splice(assoToDelete, 1)
        },
        async createAssociation(name: string) {
            await _axios.post('/associations/', {name: name})
        }
    }
})
