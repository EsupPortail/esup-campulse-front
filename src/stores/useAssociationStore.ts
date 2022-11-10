import { defineStore } from 'pinia'
import type { Associations } from '#/association'


interface AssociationStore {
    associations: Associations
}

export const useAssociationStore = defineStore('associationStore', {
    state: (): AssociationStore => ({
        associations: []
    }),

    getters: {

    },

    actions: {

    }
})
