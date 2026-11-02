import {useAssociationStore} from '@/stores/useAssociationStore'
import type {Association, AssociationFilters, SearchAssociation} from '#/association'
import {useProfileStore} from '@/stores/useProfileStore'
import * as associationService from '@/services/AssociationService'
import useUtil from '@/composables/useUtil'

async function simpleAssociationSearch(search: string, forDirectory: boolean): Promise<Association[]> {
  const profileStore = useProfileStore()
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

function advancedSearch(settings: SearchAssociation): Association[] {
  const {filterizeSearch} = useUtil()
  const associationStore = useAssociationStore()
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

export default function useDirectory() {

  return {
    advancedSearch,
    simpleAssociationSearch
  }
}
