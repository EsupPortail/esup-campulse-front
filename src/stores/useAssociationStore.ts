import {defineStore} from 'pinia'
import type {
    Association,
    AssociationActivityField,
    AssociationDirectory,
    AssociationName,
    AssociationStore,
    Institution,
    InstitutionComponent,
} from '#/association'
import {useAxios} from '@/composables/useAxios'
import {useUserStore} from '@/stores/useUserStore'
import useSecurity from "@/composables/useSecurity";
import type {SelectLabel} from "#/index";
import useUserGroups from "@/composables/useUserGroups";


export const useAssociationStore = defineStore('associationStore', {
    state: (): AssociationStore => ({
        association: undefined,
        associations: [],
        associationNames: [],
        institutions: [],
        institutionComponents: [],
        activityFields: []
    }),

    getters: {
        associationLabels: (state: AssociationStore): SelectLabel[] => {
            return state.associationNames
                .map(association => ({
                    value: association.id,
                    label: association.name,
                    hasPresident: association.hasPresident,
                    institution: association.institution,
                    disable: false
                }))
        },
        associationDirectory: (state: AssociationStore): AssociationDirectory => {
            return state.associations
                .map(association => ({
                    id: association.id,
                    name: association.name,
                    acronym: association.acronym,
                    institution: association.institution?.name,
                    institutionComponent: association.institutionComponent?.name,
                    activityField: association.activityField?.name,
                }))
        },
        institutionLabels: (state: AssociationStore) => {
            return state.institutions.map((
                institution => ({
                    value: institution.id,
                    label: institution.name
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

            this.associations = (await instance.get<Association[]>(url)).data
        },
        // To test
        async getInstitutionAssociations() {
            const {axiosAuthenticated} = useAxios()
            const userStore = useUserStore()
            const url = `/associations/?institution${userStore.userInstitutions?.join(',')}`
            this.associations = (await axiosAuthenticated.get<Association[]>(url)).data
        },
        async getAssociationNames(institutionIds: (number | undefined)[]) {
            const {axiosPublic} = useAxios()
            let url = '/associations/names'
            if (institutionIds.length !== 0) {
                url += `?institutions=${institutionIds.join(',')}`
            }
            this.associationNames = (await axiosPublic.get<AssociationName[]>(url)).data
        },
        /**
         * It the user is a manager, it simply gets all associations
         * If the user is a student member of associations, it gets all the associations linked to that user
         */
        async getManagedAssociations() {
            const userStore = useUserStore()
            const {hasPerm} = useSecurity()
            const {isStaff} = useUserGroups()
            if (!isStaff && hasPerm('change_association')) {
                const {axiosAuthenticated} = useAxios()
                this.associations = []
                for (let i = 0; i < (userStore.user?.associations.length as number); i++) {
                    const associationId = userStore.user?.associations[i].id as number
                    const association = (await axiosAuthenticated.get<Association>(`/associations/${associationId}`)).data
                    this.associations.push(association)
                }
            } else if (hasPerm('change_association_any_institution')) {
                await this.getAssociations(false)
            } else if (hasPerm('change_association')) {
                await this.getInstitutionAssociations()
            }
        },
        async getAssociationDetail(id: number, publicRequest: boolean) {
            const {axiosPublic, axiosAuthenticated} = useAxios()
            let instance = axiosAuthenticated
            if (publicRequest) instance = axiosPublic
            this.association = (await instance.get<Association>(`/associations/${id}`)).data
        },
        async updateAssociationLogo(logoData: FormData | object, id: number) {
            if (this.association) {
                const {axiosAuthenticated} = useAxios()
                const response = (await axiosAuthenticated.patch(`/associations/${id}`, logoData)).data
                if (this.association.pathLogo) {
                    this.association.pathLogo.detail = response.pathLogo
                }
                this.association.altLogo = response.altLogo
            }
        },
        async getInstitutions() {
            if (this.institutions.length === 0) {
                const {axiosPublic} = useAxios()
                this.institutions = (await axiosPublic.get<Institution[]>('/institutions/institutions')).data
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
        // To test
        async patchPublicAssociation(isPublic: boolean, associationId: number | undefined) {
            const {axiosAuthenticated} = useAxios()
            const patchedData = await axiosAuthenticated.patch(`/associations/${associationId}`, {isPublic})
            const {data} = patchedData
            this.association = data
        }
    }
})
