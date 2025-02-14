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
import type {AssociationUser} from '#/user'
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
            return state.institutionComponents.map((
                institutionComponent => ({
                    value: institutionComponent.id,
                    label: institutionComponent.name
                })))
        },
        activityFieldLabels: (state: AssociationStore) => {
            return state.activityFields.map((
                activityField => ({
                    value: activityField.id,
                    label: activityField.name
                })))
        }
    },

    actions: {
        async getAssociations(isPublic: boolean) {
            const {axiosPublic, axiosAuthenticated} = useAxios()
            let url = '/associations/'

            if (isPublic) url += '?is_public=true'

            const instance = isPublic ? axiosPublic : axiosAuthenticated

            this.associations = (await instance.get<Association[]>(url)).data
        },

        async getInstitutionAssociations() {
            const {axiosAuthenticated} = useAxios()
            const userStore = useUserStore()
            const url = `/associations/?institutions=${userStore.userInstitutions?.join(',')}`
            this.associations = (await axiosAuthenticated.get<Association[]>(url)).data
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
                for (let i = 0; i < (userStore.user?.associations.length as number); i++) {
                    const associationId = userStore.user?.associations[i].id as number
                    const association = (await axiosAuthenticated.get<Association>(`/associations/${associationId}`)).data
                    this.associations.push(association)
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
            this.association = (await instance.get<Association>(`/associations/${id}`)).data
        },

        async updateAssociationLogo(logoData: FormData | object, id: number) {
            if (this.association) {
                const {axiosAuthenticated} = useAxios()
                const response = (await axiosAuthenticated.patch(`/associations/${id}`, logoData)).data
                if (this.association.pathLogo) {
                    this.association.pathLogo.detail = response.pathLogo
                }
            }
        },

        async getInstitutions() {
            if (this.institutions.length === 0) {
                const {axiosPublic} = useAxios()
                this.institutions = (await axiosPublic.get<Institution[]>('/institutions/')).data
            }
        },

        async getInstitutionComponents() {
            if (this.institutionComponents.length === 0) {
                const {axiosPublic} = useAxios()
                this.institutionComponents = (await axiosPublic.get<InstitutionComponent[]>('/institutions/institution_components')).data
            }
        },

        async getActivityFields() {
            if (this.activityFields.length === 0) {
                const {axiosPublic} = useAxios()
                this.activityFields = (await axiosPublic.get<AssociationActivityField[]>('/associations/activity_fields')).data
            }
        },

        async deleteAssociation(associationId: number | undefined) {
            if (associationId) {
                const {axiosAuthenticated} = useAxios()
                await axiosAuthenticated.delete(`/associations/${associationId}`)
            }
        },

        async patchEnabledAssociation(isEnabled: boolean, associationId: number | undefined) {
            const {axiosAuthenticated} = useAxios()
            const patchedData = await axiosAuthenticated.patch(`/associations/${associationId}`, {isEnabled})
            const {data} = patchedData
            this.association = data
        },

        async patchPublicAssociation(isPublic: boolean, associationId: number | undefined) {
            const {axiosAuthenticated} = useAxios()
            const patchedData = await axiosAuthenticated.patch(`/associations/${associationId}`, {isPublic})
            const {data} = patchedData
            this.association = data
        },

        async patchSiteAssociation(isSite: boolean, associationId: number | undefined) {
            const {axiosAuthenticated} = useAxios()
            const patchedData = await axiosAuthenticated.patch(`/associations/${associationId}`, {isSite})
            const {data} = patchedData
            this.association = data
        },

        async patchCanSubmitProjects(canSubmitProjects: boolean, associationId: number | undefined) {
            const {axiosAuthenticated} = useAxios()
            const patchedData = await axiosAuthenticated.patch(`/associations/${associationId}`, {canSubmitProjects})
            const {data} = patchedData
            this.association = data
        },

        async getAssociationUsers(associationId: number) {
            const {axiosAuthenticated} = useAxios()
            this.associationUsers = (await axiosAuthenticated.get<AssociationUser[]>(`/users/associations/?association_id=${associationId}`)).data
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
