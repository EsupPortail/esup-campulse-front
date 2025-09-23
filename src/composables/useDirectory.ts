import {useAssociationStore} from '@/stores/useAssociationStore'
import type {Association, AssociationSearch} from '#/association'
import {useAxios} from '@/composables/useAxios'
import {useUserStore} from '@/stores/useUserStore'
import useUtility from '@/composables/useUtility'

export default function () {

    const associationStore = useAssociationStore()
    const userStore = useUserStore()
    const {filterizeSearch} = useUtility()

    function advancedSearch(settings: AssociationSearch) {
        const hasSettings: boolean = !!(settings.name || settings.acronym || settings.institution || settings.institutionComponent || settings.activityField)
        if (!associationStore.associations.length || !hasSettings) return
        let matches: Association[] = []
        if (settings.name) {
            const term = filterizeSearch(settings.name)
            matches = associationStore.associations.filter(association => {
                return filterizeSearch(association.name).includes(term)
            })
        }
        if (settings.acronym) {
            // checking if a search has already been made
            // If so, we filter on current matches, if not, we filter in store
            const term = filterizeSearch(settings.acronym)
            matches = (matches.length ? matches : associationStore.associations).filter(association => {
                return filterizeSearch(association.acronym).includes(term)
            })
        }
        if (settings.institution) {
            matches = (matches.length ? matches : associationStore.associations)
                .filter(association => association.institution.id === settings.institution)
        }
        if (settings.institutionComponent) {
            matches = (matches.length ? matches : associationStore.associations)
                .filter(association => association.institutionComponent.id === settings.institutionComponent)
        }
        if (settings.activityField) {
            matches = (matches.length ? matches : associationStore.associations)
                .filter(association => association.activityField.id === settings.activityField)
        }
        return matches
    }

    async function simpleAssociationSearch(query: string, forDirectory: boolean): Promise<Association[]> {
        const {axiosPublic, axiosAuthenticated} = useAxios()
        let instance = axiosAuthenticated
        if (forDirectory) instance = axiosPublic

        let stringUrl = '/associations/?'
        const arrayUrl = []

        if (forDirectory) arrayUrl.push('is_public=true')
        else arrayUrl.push(`institutions=${userStore.userInstitutions?.join(',')}`)

        arrayUrl.push(`search=${query}`)

        stringUrl += arrayUrl.join('&')

        return (await instance.get<Association[]>(stringUrl)).data
    }

    return {
        advancedSearch,
        simpleAssociationSearch
    }
}
