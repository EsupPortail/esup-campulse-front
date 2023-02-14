import {defineStore} from 'pinia'
import type {
    Association,
    AssociationComponent,
    AssociationDirectory,
    AssociationField,
    AssociationInstitution,
    AssociationName,
    AssociationStore
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
        components: [],
        fields: []
    }),

    getters: {
        associationLabels: (state: AssociationStore): SelectLabel[] => {
            return state.associationNames
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
                    field: association.activityField?.name,
                }))
        },
        institutionLabels: (state: AssociationStore) => {
            return state.institutions.map((
                institution => ({
                    value: institution.id,
                    label: institution.name
                })))
        },
        componentLabels: (state: AssociationStore) => {
            return state.components.map((
                component => ({
                    value: component.id,
                    label: component.name
                })))
        },
        fieldLabels: (state: AssociationStore) => {
            return state.fields.map((
                field => ({
                    value: field.id,
                    label: field.name
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
        async getInstitutionAssociations(institutionId: number) {
            const {axiosAuthenticated} = useAxios()
            const url = `/associations/?institution=${institutionId}`
            this.associations = (await axiosAuthenticated.get<Association[]>(url)).data
        },
        async getAssociationNames() {
            const {axiosPublic} = useAxios()
            this.associationNames = (await axiosPublic.get<AssociationName[]>('/associations/names')).data
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
                const institutionId = userStore.user?.groups[0].institution
                if (institutionId) {
                    await this.getInstitutionAssociations(institutionId)
                }
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
                this.association.pathLogo = response.pathLogo
            }
        },
        async getInstitutions() {
            if (this.institutions.length === 0) {
                const {axiosPublic} = useAxios()
                this.institutions = (await axiosPublic.get<AssociationInstitution[]>('/institutions/institutions')).data
            }
        },
        async getComponents() {
            if (this.components.length === 0) {
                const {axiosPublic} = useAxios()
                this.components = (await axiosPublic.get<AssociationComponent[]>('/institutions/institution_components')).data
            }
        },
        async getFields() {
            if (this.fields.length === 0) {
                const {axiosPublic} = useAxios()
                this.fields = (await axiosPublic.get<AssociationField[]>('/associations/activity_fields')).data
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
        }
    }
})
