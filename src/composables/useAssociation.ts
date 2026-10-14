import {ref} from 'vue'
import type {Association, AssociationSocialNetwork, EditedAssociation, NewAssociation} from '#/association'
import type {AssociationRole} from '#/user'
import useUtility from '@/composables/useUtil'
import {useAssociationStore} from '@/stores/useAssociationStore'
import useUserAssociations from '@/composables/useUserAssociation'
import useDocumentUploads from '@/composables/useDocumentUpload'
import * as associationService from '@/services/AssociationService'


// Needed to modify the social networks of an association
const associationSocialNetworks = ref<AssociationSocialNetwork[]>([])

// Needed to temporarily store associations (for searching and pagination)
const associations = ref<Association[]>([])

// Functions
async function createAssociation(newAssociation: NewAssociation): Promise<void> {
  await associationService.createAssociation(newAssociation)
}

async function getAssociationPdfExport(associationId: number): Promise<ArrayBuffer> {
  return await associationService.getAssociationPdfExport(associationId)
}

export const useAssociation = () => {

  const associationStore = useAssociationStore()
  const {newAssociations} = useUserAssociations()
  const {processDocuments} = useDocumentUploads()

  function checkHasPresident(association: AssociationRole) {
    if (!association.options) return
    association.options[0].disable = false
    const associationDetail = associationStore.associationNames.find(obj => obj.id === association.id)
    if (!associationDetail?.hasPresident) return
    association.options[0].disable = true
    if (association.role === 'isPresident') {
      const model = newAssociations.value.find(obj => obj.id === association.id)
      if (model) model.role = 'isMember'
    }
  }

  // Commented in component since issue is not clear
  function checkHasStudentCertificate(association: AssociationRole) {
    if (!association.options) return
    // If new user has not uploaded a student certificate
    // He/she cannot join an association as an office member
    if (processDocuments.value.filter(doc => doc.pathFile).length === 0) {
      association.options.forEach(association => {
        if (association.isInOffice) association.disable = true
      })
    } else {
      association.options.forEach(association => {
        if (association.isInOffice) association.disable = false
      })
    }
  }

  function addNetwork() {
    const newNetwork: AssociationSocialNetwork = {
      type: '',
      location: ''
    }
    associationSocialNetworks.value?.push(newNetwork)
  }

  function removeNetwork(index: number) {
    associationSocialNetworks.value?.splice(index, 1)
  }

  function checkChanges(association: EditedAssociation) {
    const {formatDate} = useUtility()

    const original = associationStore.association
    const directFields = new Set([
      'name', 'acronym', 'socialObject', 'originalProjects', 'address',
      'zipcode', 'city', 'country', 'email', 'phone', 'siret',
      'website', 'presidentNames', 'presidentPhone', 'presidentEmail'
    ])
    const numericFields = new Set(['amountMembersAllowed', 'studentCount'])
    const relationFields = new Set(['institution', 'institutionComponent', 'activityField'])

    const changedData: Partial<Association | EditedAssociation> = {}

    const compareAndAssign = <K extends keyof EditedAssociation>(key: K, newValue: EditedAssociation[K]) => {
      if (newValue !== original?.[key]) {
        changedData[key] = newValue
      }
    }

    for (const [key, value] of Object.entries(association)) {
      const typedKey = key as keyof EditedAssociation

      if (directFields.has(key)) {
        compareAndAssign(typedKey, value)
      } else if (numericFields.has(key)) {
        compareAndAssign(typedKey, Number.parseInt(value))
      } else if (relationFields.has(key)) {
        const relationKey = relationFields[key]
        const originalId = (original?.[relationKey])?.id
        if (value !== originalId) {
          changedData[key] = value
        }
      } else if (key === 'lastGoaDate' && value !== null) {
        const formattedOriginal = formatDate(original?.lastGoaDate)
        if (value !== formattedOriginal) {
          changedData.lastGoaDate = value
        }
      }
    }
    const socialChanges = checkSocialNetworks()
    if (socialChanges !== undefined) {
      changedData['socialNetworks'] = socialChanges
    }
    return changedData
  }

  function checkSocialNetworks(): AssociationSocialNetwork[] | undefined {
    const original = associationStore.association?.socialNetworks ?? []
    const edited = associationSocialNetworks.value ?? []
    if (original.length !== edited.length) {
      return edited
    }
    const hasChanged = original.some((originalItem) =>
      !edited.some((editedItem) => editedItem.type === originalItem.type
        && editedItem.location === originalItem.location)
    )
    return hasChanged ? edited : undefined
  }

  async function updateAssociation(editedAssociation: EditedAssociation) {
    const associationId = associationStore.association?.id
    if (!associationId) return
    const data = checkChanges(editedAssociation)
    await associationService.updateAssociation(associationId, data)
  }

  async function changeAssociationLogo(newLogo: undefined | File, deleteLogoData: null | object) {
    if (deleteLogoData === null) {
      const patchLogoData = new FormData()
      if (newLogo instanceof File) {
        patchLogoData.append('pathLogo', newLogo)
      }
      await associationStore.updateAssociationLogo(patchLogoData, associationStore.association?.id as number)
    } else {
      await associationStore.updateAssociationLogo(deleteLogoData, associationStore.association?.id as number)
    }
  }

  return {
    createAssociation,
    addNetwork,
    removeNetwork,
    associationSocialNetworks,
    checkChanges,
    updateAssociation,
    checkSocialNetworks,
    checkHasPresident,
    changeAssociationLogo,
    associations,
    getAssociationPdfExport,
    checkHasStudentCertificate
  }
}
