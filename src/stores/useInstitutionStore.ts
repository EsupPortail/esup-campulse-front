import {defineStore} from 'pinia'
import type {InstitutionStore} from '#/institution'
import * as institutionService from '@/services/InstitutionService'

export const useInstitutionStore = defineStore('institutionStore', {
  state: (): InstitutionStore => ({
    institutions: [],
    institutionComponents: []
  }),

  getters: {
    institutionLabels: (state: InstitutionStore) => {
      return state.institutions.map((
        institution => ({
          value: institution.id,
          label: `${institution.acronym} (${institution.name})`
        })))
    },
    institutionComponentLabels: (state: InstitutionStore) => {
      return state.institutionComponents.map((
        institutionComponent => ({
          value: institutionComponent?.id,
          label: institutionComponent?.name,
          institution: institutionComponent?.institution
        })))
    },
  },
  actions: {
    async getInstitutions() {
      this.institutions = await institutionService.getInstitutions()
    },

    async getInstitutionComponents() {
      this.institutionComponents = await institutionService.getInstitutionComponents()
    },
  }
})
