import {useAssociationStore} from '@/stores/useAssociationStore'
import type {Association, AssociationFilters, SearchAssociation} from '#/association'
import {useProfileStore} from '@/stores/useProfileStore'
import useUtility from '@/composables/useUtil'
import * as associationService from '@/services/AssociationService'

export default function useDirectory() {

  const associationStore = useAssociationStore()
  const profileStore = useProfileStore()
  const {filterizeSearch} = useUtility()

  function advancedSearch(settings: SearchAssociation): Association[] {
    const hasSettings: boolean = !!(settings.name || settings.acronym || settings.institution || settings.institutionComponent || settings.activityField)
    if (!associationStore.associations.length || !hasSettings) return []
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
        .filter(association => association.institution?.id === settings.institution)
    }
    if (settings.institutionComponent) {
      matches = (matches.length ? matches : associationStore.associations)
        .filter(association => association.institutionComponent?.id === settings.institutionComponent)
    }
    if (settings.activityField) {
      matches = (matches.length ? matches : associationStore.associations)
        .filter(association => association.activityField?.id === settings.activityField)
    }
    return matches
  }

  async function simpleAssociationSearch(search: string, forDirectory: boolean): Promise<Association[]> {
    const filters: Partial<AssociationFilters> = {
      search,
    }
    if (forDirectory) {
      filters.isPublic = true
    } else {
      filters.institutions = profileStore.userInstitutions
    }
    return await associationService.getAssociations(filters)
  }

  return {
    advancedSearch,
    simpleAssociationSearch
  }
}
