import {defineStore} from 'pinia'
import type {
    Association,
    AssociationActivityField,
    AssociationName,
    AssociationStore,
    Institution,
    InstitutionComponent,
} from '#/association'
import {useAxios} from '@/composables/useAxios'
import {useUserStore} from '@/stores/useUserStore'
import useSecurity from '@/composables/useSecurity'
import useUserGroups from '@/composables/useUserGroups'
import type {UserAssociation} from '#/user'
import type {DocumentProcessType, DocumentUpload} from '#/documents'


export const useAssociationStore = defineStore('associationStore', {
    state: (): AssociationStore => ({
        association: undefined,
        associations: [],
        associationNames: [],
        institutions: [],
        institutionComponents: [],
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
        institutionLabels: (state: AssociationStore) => {
            return state.institutions.map((
                institution => ({
                    value: institution.id,
                    label: `${institution.acronym} (${institution.name})`
                })))
        },
        institutionComponentLabels: (state: AssociationStore) => {
            const institutionComponents = state.institutionComponents.length ?
                state.institutionComponents : [state.association?.institutionComponent]
            return institutionComponents.map((
                institutionComponent => ({
                    value: institutionComponent?.id,
                    label: institutionComponent?.name
                })))
        },
        activityFieldLabels: (state: AssociationStore) => {
            const activityFields = state.activityFields.length ?
                state.activityFields : [state.association?.activityField]
            return activityFields.map((
                activityField => ({
                    value: activityField?.id,
                    label: activityField?.name
                })))
        }
    },

    actions: {
        async getAssociations(isPublic: boolean) {
            const {axiosPublic, axiosAuthenticated} = useAxios()
            let url = '/associations/'
            let instance = axiosPublic

            if (isPublic) url += '?is_public=true'

            if (!isPublic) instance = axiosAuthenticated

            const response = await instance.get<Association[]>(url)
            this.associations = response.data
        },

        async getInstitutionAssociations() {
            const {axiosAuthenticated} = useAxios()
            const userStore = useUserStore()
            const url = `/associations/?institutions=${userStore.userInstitutions?.join(',')}`
            const response = await axiosAuthenticated.get<Association[]>(url)
            this.associations = response.data
        },

        async getAssociationNames(publicRequest: boolean, allowNewUsers: boolean) {
            const {axiosPublic} = useAxios()
            const userStore = useUserStore()
            const {isStaff} = useUserGroups()

            let urlString = '/associations/names'
            const urlArray = []

            if (publicRequest) urlArray.push('is_public=true')
            if (!publicRequest && isStaff.value && userStore.userInstitutions?.length !== 0) {
                urlArray.push(`institutions=${userStore.userInstitutions?.join(',')}`)
            }
            if (allowNewUsers) urlArray.push('allow_new_users=true')

            if (urlArray.length > 0) {
                urlString += '?'
                urlString += urlArray.join('&')
            }

            this.associationNames = (await axiosPublic.get<AssociationName[]>(urlString)).data
        },

        async getManagedAssociations() {
            const userStore = useUserStore()
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
        },

        async getAssociationDetail(id: number, publicRequest: boolean) {
            const {axiosPublic, axiosAuthenticated} = useAxios()
            const instance = publicRequest ? axiosPublic : axiosAuthenticated
            const response = await instance.get<Association>(`/associations/${id}`)
            this.association = response.data
        },

        async updateAssociationLogo(logoData: FormData | object, id: number) {
            if (!this.association) return
            const {axiosAuthenticated} = useAxios()
            const response = (await axiosAuthenticated.patch(`/associations/${id}`, logoData)).data
            this.association.pathLogo.detail = response.pathLogo
        },
        async getInstitutions() {
            if (this.institutions.length) return
            const {axiosPublic} = useAxios()
            this.institutions = (await axiosPublic.get<Institution[]>('/institutions/')).data
        },
        async getInstitutionComponents() {
            if (this.institutionComponents.length) return
            const {axiosPublic} = useAxios()
            this.institutionComponents = (await axiosPublic.get<InstitutionComponent[]>('/institutions/institution_components')).data
        },
        async getActivityFields() {
            if (this.activityFields.length) return
            const {axiosPublic} = useAxios()
            this.activityFields = (await axiosPublic.get<AssociationActivityField[]>('/associations/activity_fields')).data
        },

        async deleteAssociation(associationId: number | undefined) {
            if (!associationId) return
            const {axiosAuthenticated} = useAxios()
            await axiosAuthenticated.delete(`/associations/${associationId}`)
        },

        async patchEnabledAssociation(isEnabled: boolean, associationId: number | undefined) {
            const {axiosAuthenticated} = useAxios()
            const response = await axiosAuthenticated.patch(`/associations/${associationId}`, {isEnabled})
            this.association = response.data
        },

        async patchPublicAssociation(isPublic: boolean, associationId: number | undefined) {
            const {axiosAuthenticated} = useAxios()
            const response = await axiosAuthenticated.patch(`/associations/${associationId}`, {isPublic})
            this.association = response.data
        },
        async patchSiteAssociation(isSite: boolean, associationId: number | undefined) {
            const {axiosAuthenticated} = useAxios()
            const response = await axiosAuthenticated.patch(`/associations/${associationId}`, {isSite})
            this.association = response.data
        },
        async patchCanSubmitProjects(canSubmitProjects: boolean, associationId: number | undefined) {
            const {axiosAuthenticated} = useAxios()
            const response = await axiosAuthenticated.patch(`/associations/${associationId}`, {canSubmitProjects})
            this.association = response.data
        },
        async getAssociationUsers(associationId: number) {
            const {axiosAuthenticated} = useAxios()
            this.associationUsers = (await axiosAuthenticated.get<UserAssociation[]>(`/associations/${associationId}/users`)).data
        },
        async getAssociationDocuments(processTypes?: DocumentProcessType[]) {
            const {axiosAuthenticated} = useAxios()
            let url = `/documents/uploads?association_id=${this.association?.id}`
            if (processTypes?.length) {
                url += `&process_types=${processTypes.join(',')}`
            }
            this.associationDocuments = (await axiosAuthenticated.get<DocumentUpload[]>(url)).data
        },
        async export(associations: number[], format: string) {
            const {axiosAuthenticated} = useAxios()
            const url = `/associations/export?associations=${associations.join(',')}&mode=${format}`
            return (await axiosAuthenticated.get<Blob>(url, {responseType: 'blob'})).data
        }
    }
})
