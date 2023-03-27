import {useAssociationStore} from '@/stores/useAssociationStore'
import type {Association, AssociationSearch} from '#/association'
import {useAxios} from '@/composables/useAxios'


export default function () {

    const associationStore = useAssociationStore()

    /**
     * It takes a string, removes all spaces, converts it to lowercase, removes all accents, and returns the result
     * @param {string} stringToFilterize - The string you want to filterize.
     * @returns A string with no spaces, lowercase, and without accents.
     */
    function filterizeSearch(stringToFilterize: string) {
        return stringToFilterize.replace(/ /g, '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    }

    /**
     * It filters the associations in the store based on the search settings on the front end
     * @param {AssociationSearch} settings - AssociationSearch
     * @returns An array of associations that match the search criteria
     */
    function advancedSearch(settings: AssociationSearch) {
        if (associationStore.associations.length > 0 &&
            (settings.name || settings.acronym || settings.institution || settings.institutionComponent || settings.activityField)) {
            let matches: Association[] = []
            if (settings.name) {
                matches = associationStore.associations.filter(association => {
                    return filterizeSearch(association.name).includes(filterizeSearch(settings.name))
                })
            }
            if (settings.acronym) {
                // checking if a search has already been made
                // If so, we filter on current matches, if not, we filter in store
                if (matches.length) {
                    const newMatches = matches.filter(association => {
                        return filterizeSearch(association.acronym).includes(filterizeSearch(settings.acronym))
                    })
                    matches = [...newMatches]
                } else {
                    matches = associationStore.associations.filter(association => {
                        return filterizeSearch(association.acronym).includes(filterizeSearch(settings.acronym))
                    })
                }
            }
            if (settings.institution) {
                if (matches.length) {
                    const newMatches = matches.filter(association => association.institution === settings.institution)
                    matches = [...newMatches]
                } else {
                    matches = associationStore.associations.filter(association => association.institution === settings.institution)
                }
            }
            if (settings.institutionComponent) {
                if (matches.length) {
                    const newMatches = matches.filter(association => association.institutionComponent === settings.institutionComponent)
                    matches = [...newMatches]
                } else {
                    matches = associationStore.associations.filter(association => association.institutionComponent === settings.institutionComponent)
                }
            }
            if (settings.activityField) {
                if (matches.length) {
                    const newMatches = matches.filter(association => association.activityField === settings.activityField)
                    matches = [...newMatches]
                } else {
                    matches = associationStore.associations.filter(association => association.activityField === settings.activityField)
                }
            }
            return matches
        }
    }

    /**
     * It searches for associations that are public and match the search value on the API.
     * @param {string} value - The value to search for
     * @returns An array of AssociationList objects.
     */
    async function simpleAssociationSearch(value: string): Promise<Association[]> {
        const {axiosPublic} = useAxios()
        await Promise.all([associationStore.getInstitutions(), associationStore.getInstitutionComponents(), associationStore.getActivityFields()])
        const associations = (await axiosPublic.get<Association[]>(`/associations/?is_public=true&search=${value}`)).data
        return associationStore.getAssociationsSubDetails(associations)
    }

    return {
        advancedSearch,
        simpleAssociationSearch,
        filterizeSearch
    }
}
