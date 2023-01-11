import {defineStore} from 'pinia'
import type {
    Association,
    AssociationDirectory,
    AssociationList,
    AssociationNames,
    AssociationStore
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
                    institution: association.institution?.name,
                    component: association.institutionComponent?.name,
                    field: association.activityField?.name
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
        async updateAssociation(institution: number | null, institutionComponent: number | null, activityField: number | null) {
            const data = {
                institution,
                institutionComponent,
                activityField,
                name: this.association?.name,
                acronym: this.association?.acronym,
                description: this.association?.description,
                activities: this.association?.activities,
                address: this.association?.address,
                phone: this.association?.phone,
                email: this.association?.email,
                siret: this.association?.siret,
                website: this.association?.website,
                presidentNames: this.association?.presidentNames,
                approvalDate: this.association?.approvalDate,
                lastGoaDate: this.association?.lastGoaDate,
                /*socialNetworks: this.association?.socialNetworks*/
            }
            await _axios.patch(`/associations/${this.association?.id}`, data)
        }
        /* async deleteAssociation() {
             const assoToDelete = this.associations.findIndex((association) => association.id === this.association?.id)
             await _axios.delete('/associations/${this.association?.id}')
             this.associations.splice(assoToDelete, 1)
         }*/
    }
})
