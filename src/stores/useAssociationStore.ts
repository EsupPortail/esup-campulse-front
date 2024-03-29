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
        getAssociationSubDetails(association: Association) {
            association.institution = this.institutions.find((institution: Institution) => institution.id === association.institution)?.id
            association.institutionComponent = this.institutionComponents.find((institutionComponent: InstitutionComponent) => institutionComponent.id === association.institutionComponent)?.id
            association.activityField = this.activityFields.find((activityField: AssociationActivityField) => activityField.id === association.activityField)?.id
            return association
        },
        getAssociationsSubDetails(associations: Association[]) {
            associations.forEach((association, index) => {
                associations[index] = this.getAssociationSubDetails(association)
            })
            return associations
        },
        /**
         * It gets a list of associations from the server, and stores them in the `associations` variable
         * returned.
         * @param isPublic
         */
        async getAssociations(isPublic: boolean) {
            const {axiosPublic, axiosAuthenticated} = useAxios()
            let url = '/associations/'
            let instance = axiosPublic

            if (isPublic) url += '?is_public=true'

            if (!isPublic) instance = axiosAuthenticated

            await Promise.all([this.getInstitutions(), this.getInstitutionComponents(), this.getActivityFields()])
            const associations = (await instance.get<Association[]>(url)).data
            this.associations = this.getAssociationsSubDetails(associations)
        },
        /**
         * This function gets the associations that the user (manager) is a member of
         */
        async getInstitutionAssociations() {
            const {axiosAuthenticated} = useAxios()
            const userStore = useUserStore()
            const url = `/associations/?institutions=${userStore.userInstitutions?.join(',')}`
            await Promise.all([this.getInstitutions(), this.getInstitutionComponents(), this.getActivityFields()])
            this.associations = this.getAssociationsSubDetails((await axiosAuthenticated.get<Association[]>(url)).data)
        },
        /**
         * It gets the names of all associations, or all public associations, or all associations that the user is a member
         * of
         * @param {boolean} publicRequest - boolean - If true, only public associations will be fetched. If false, only
         * associations that the user is a member of will be fetched.
         * @param allowNewUsers
         */
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
        /**
         * It the user is a manager, it simply gets all associations
         * If the user is a student member of associations, it gets all the associations linked to that user
         */
        async getManagedAssociations() {
            const userStore = useUserStore()
            const {hasPerm} = useSecurity()
            const {isStaff} = useUserGroups()
            if (!isStaff.value && hasPerm('change_association')) { // Student institution
                const {axiosAuthenticated} = useAxios()
                this.associations = []
                await Promise.all([this.getInstitutions(), this.getInstitutionComponents(), this.getActivityFields()])
                for (let i = 0; i < (userStore.user?.associations.length as number); i++) {
                    const associationId = userStore.user?.associations[i].id as number
                    const association = (await axiosAuthenticated.get<Association>(`/associations/${associationId}`)).data
                    this.associations.push(this.getAssociationSubDetails(association))
                }
            } else if (hasPerm('change_association_any_institution')) { // Manager general
                await this.getAssociations(false)
            } else if (hasPerm('change_association')) { // Manager institution
                await this.getInstitutionAssociations()
            }
        },
        /**
         * It gets the association detail from the API.
         * @param {number} id - The id of the association you want to get
         * @param {boolean} publicRequest - boolean - If true, the request will be made using the public axios instance. If
         * false, the request will be made using the authenticated axios instance.
         */
        async getAssociationDetail(id: number, publicRequest: boolean) {
            const {axiosPublic, axiosAuthenticated} = useAxios()
            let instance = axiosAuthenticated
            if (publicRequest) instance = axiosPublic
            await Promise.all([this.getInstitutions(), this.getInstitutionComponents(), this.getActivityFields()])
            this.association = this.getAssociationSubDetails((await instance.get<Association>(`/associations/${id}`)).data)
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
        /**
         * It deletes an association from the database
         * @param {number | undefined} associationId - The id of the association to delete.
         */
        async deleteAssociation(associationId: number | undefined) {
            if (associationId) {
                const {axiosAuthenticated} = useAxios()
                await axiosAuthenticated.delete(`/associations/${associationId}`)
            }
        },
        /**
         * It takes in a boolean and an associationId, and then it patches the association with the given associationId
         * with the given boolean
         * @param {boolean} isEnabled - boolean - This is the value that will be sent to the backend to update the
         * association's isEnabled property.
         * @param {number | undefined} associationId - The id of the association you want to update.
         */
        async patchEnabledAssociation(isEnabled: boolean, associationId: number | undefined) {
            const {axiosAuthenticated} = useAxios()
            const patchedData = await axiosAuthenticated.patch(`/associations/${associationId}`, {isEnabled})
            const {data} = patchedData
            this.association = data
        },
        /**
         * It takes a boolean and an association id, and then it patches the association with the boolean and the
         * association id
         * @param {boolean} isPublic - boolean - this is the value that will be sent to the backend to update the
         * association's isPublic property.
         * @param {number | undefined} associationId - The id of the association you want to patch.
         */
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
