import { defineStore } from 'pinia'
import type {Association, AssociationList, AssociationStore} from '#/association'
import _axios from "@/plugins/axios";



export const useAssociationStore = defineStore('associationStore', {
    state: (): AssociationStore => ({
        association: undefined,
        associations: []
    }),

    getters: {
        associationList: (state: AssociationStore): AssociationList => {
            return state.associations
                .map(association => ({
                    value: association.id,
                    label: association.name
                }))
        }
    },

    actions: {
        async getAssociations() {
            this.associations = (await _axios.get<Association[]>('/associations/')).data
        }
    }
})
