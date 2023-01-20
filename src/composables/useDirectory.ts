import {useAssociationStore} from '@/stores/useAssociationStore'
import {ref, watch} from 'vue'
import type {AssociationList, AssociationSearch} from '#/association'

const associationStore = useAssociationStore()

// Used as temp for a search on associations
const shownAssociations = ref<AssociationList[] | []>([...associationStore.associations])
watch(() => associationStore.associations, () => {
    shownAssociations.value = associationStore.associations
})


export default function () {

    async function getAssociationDetail(routeParams: string) {
        if (routeParams) {
            const id = parseInt(routeParams)
            await associationStore.getAssociationDetail(id)
        }
    }

    function advancedSearch(settings: AssociationSearch) {
        if (associationStore.associations.length > 0 &&
            (settings.name || settings.acronym || settings.institution || settings.institutionComponent || settings.activityField)) {
            let matches: AssociationList[] = []
            if (settings.name) {
                matches = associationStore.associations.filter(association => {
                    return association.name.toLowerCase().includes(settings.name.toLowerCase())
                })
            }
            if (settings.acronym) {
                // checking if a search has already been made
                // If so, we filter on current matches, if not, we filter in store
                if (matches.length) {
                    const newMatches = matches.filter(association => {
                        return association.acronym.toLowerCase().includes(settings.acronym.toLowerCase())
                    })
                    matches = [...newMatches]
                } else {
                    matches = associationStore.associations.filter(association => {
                        return association.acronym.toLowerCase().includes(settings.acronym.toLowerCase())
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
            shownAssociations.value = matches
        }
    }

    return {
        getAssociationDetail,
        shownAssociations,
        advancedSearch
    }
}
