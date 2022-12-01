import {defineStore} from 'pinia'
import type {AssociationDirectory, AssociationList, AssociationNames, AssociationStore} from '#/association'
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
            this.associations = (await _axios.get<AssociationList[]>('/associations/')).data
        }
    }
})
