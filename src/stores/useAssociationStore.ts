import {defineStore} from 'pinia'
import type {
    Association,
    AssociationDirectory,
    AssociationList,
    AssociationNames,
    AssociationStore,
    CreateAssociation
} from '#/association'
import _axios from '@/plugins/axios'

export const useAssociationStore = defineStore('associationStore', {
    state: (): AssociationStore => ({
        association: undefined,
        associations: []
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
                    institution: association.institution.name,
                    component: association.institutionComponent.name,
                    field: association.activityField.name
                }))
        }
    },

    actions: {
        async getAssociations() {
            if (this.associations.length === 0) {
                this.associations = (await _axios.get<AssociationList[]>('/associations/')).data
            }
        },
        async getAssociationDetail(id: number) {
            if (this.association?.id !== id) {
                this.association = (await _axios.get<Association>(`/associations/${id}`)).data
            }
        },
        async createAssociation(name: string, data: CreateAssociation) {
            try {
                await _axios.post(`/associations/${name}`, data)
            } catch (e) {
                // code
            }
        }
    }
})
