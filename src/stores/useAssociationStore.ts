import {defineStore} from 'pinia'
import type {
  Association,
  AssociationFilters,
  AssociationNameFilters,
  AssociationStore,
  UpdateAssociation,
} from '#/association'
import type {DocumentProcessType} from '#/document'
import * as associationService from '@/services/AssociationService'
import * as documentUploadService from '@/services/DocumentUploadService'
import type {SelectLabel} from '#/global'


export const useAssociationStore = defineStore('associationStore', {
  state: (): AssociationStore => ({
    association: undefined,
    associations: [],
    associationNames: [],
    activityFields: [],
    associationUsers: [],
    associationDocuments: []
  }),

  getters: {
    associationLabels: (state: AssociationStore) => {
      return state.associationNames
        .map(association => ({
          value: association.id,
          label: association.name,
          hasPresident: association.hasPresident,
          institution: association.institution,
          disable: false
        }))
    },
    activityFieldLabels: (state: AssociationStore): SelectLabel[] => {
      const activityFields = state.activityFields.length ?
        state.activityFields : [state.association?.activityField]
      return activityFields.map((
        activityField => ({
          value: activityField?.id,
          label: activityField?.name
        })))
    },
    associationUserLabels: (state: AssociationStore): SelectLabel[] => {
      return state.associationUsers.map(item => ({
        value: item.id,
        label: item.user.firstName + ' ' + item.user.lastName
      }))
    }
  },

  actions: {
    async getAssociations(filters?: Partial<AssociationFilters>) {
      this.associations = await associationService.getAssociations(filters)
    },

    async getAssociationNames(filters?: Partial<AssociationNameFilters>) {
      this.associationNames = await associationService.getAssociationNames(filters)
    },

    // todo voir si on a toujours besoin de ce bidule
    /*async getManagedAssociations() {
      const profileStore = useProfileStore()
      const {hasPerm} = useSecurity()
      const {isStaff} = useUserGroups()
      if (!isStaff.value && hasPerm('change_association')) { // Student institution
        const {axiosAuthenticated} = useAxios()
        this.associations = []
        for (const userAssociation of userStore.user.associations) {
          const associationId = userAssociation.id as number
          const response = await axiosAuthenticated.get<Association>(`/associations/${associationId}`)
          this.associations = [...this.associations, response.data]
        }
      } else if (hasPerm('change_association_any_institution')) { // Manager general
        await this.getAssociations(false)
      } else if (hasPerm('change_association')) { // Manager institution
        await this.getInstitutionAssociations()
      }
    },*/

    async getAssociationDetail(associationId: number, isPublicRequest: boolean) {
      this.association = await associationService.getAssociationDetail(associationId, isPublicRequest)
    },

    async getAssociationActivityFields() {
      this.activityFields = await associationService.getAssociationActivityFields()
    },

    async getAssociationUsers(associationId: number) {
      this.associationUsers = await associationService.getAssociationUsers(associationId)
    },

    async getAssociationDocuments(processTypes?: DocumentProcessType[]) {
      this.associationDocuments = await documentUploadService.getDocumentUploads({
        associationId: this.association!.id,
        processTypes
      })
    },

    async updateAssociation(payload: Partial<Association | UpdateAssociation>) {
      await associationService.updateAssociation(this.association!.id, payload)
    },

    async updateAssociationLogo(newLogo: undefined | File, deleteLogoData: null | object) {
      if (deleteLogoData === null) {
        const patchLogoData = new FormData()
        if (newLogo instanceof File) {
          patchLogoData.append('pathLogo', newLogo)
        }
        await associationService.updateAssociationLogo(patchLogoData, this.association!.id)
      } else {
        await associationService.updateAssociationLogo(deleteLogoData, this.association!.id)
      }
    },

    async deleteAssociation() {
      await associationService.deleteAssociation(this.association!.id)
    }
  }
})
