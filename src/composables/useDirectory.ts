import {useAssociationStore} from '@/stores/useAssociationStore'
import type {AssociationList, AssociationSearch} from '#/association'
import _axios from '@/plugins/axios'


export default function () {

    const associationStore = useAssociationStore()

    async function getAssociationDetail(routeParams: string) {
        if (routeParams) {
            const id = parseInt(routeParams)
            await associationStore.getAssociationDetail(id)
        }
    }

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
            let matches: AssociationList[] = []
            if (settings.name) {
                if (matches.length) {
                    const newMatches = matches.filter(association => {
                        return filterizeSearch(association.name).includes(filterizeSearch(settings.name))
                    })
                    matches = [...newMatches]
                } else {
                    matches = associationStore.associations.filter(association => {
                        return filterizeSearch(association.name).includes(filterizeSearch(settings.name))
                    })
                }
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
                    const newMatches = matches.filter(association => association.institution?.id === settings.institution)
                    matches = [...newMatches]
                } else {
                    matches = associationStore.associations.filter(association => association.institution?.id === settings.institution)
                }
            }
            if (settings.institutionComponent) {
                if (matches.length) {
                    const newMatches = matches.filter(association => association.institutionComponent?.id === settings.institutionComponent)
                    matches = [...newMatches]
                } else {
                    matches = associationStore.associations.filter(association => association.institutionComponent?.id === settings.institutionComponent)
                }
            }
            if (settings.activityField) {
                if (matches.length) {
                    const newMatches = matches.filter(association => association.activityField?.id === settings.activityField)
                    matches = [...newMatches]
                } else {
                    matches = associationStore.associations.filter(association => association.activityField?.id === settings.activityField)
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
    async function simpleAssociationSearch(value: string): Promise<AssociationList[]> {
        return (await _axios.get<AssociationList[]>(`/associations/?is_public=true&search=${value}`)).data
    }

    return {
        getAssociationDetail,
        advancedSearch,
        simpleAssociationSearch
    }
}
