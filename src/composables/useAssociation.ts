import {computed, ref} from 'vue'
import type {
  Association,
  AssociationLogoFormats,
  AssociationRole,
  AssociationSocialNetwork,
  CreateAssociation,
  RegisterUserAssociation,
  UpdateAssociation
} from '#/association'
import {useAssociationStore} from '@/stores/useAssociationStore'
import useDocumentUploads from '@/composables/useDocumentUpload'
import * as associationService from '@/services/AssociationService'
import {type AxiosResponse} from 'axios'
import useUtil from '@/composables/useUtil'

const editedAssociation = ref<UpdateAssociation>({
  institution: null,
  institutionComponent: null,
  activityField: null,
  name: '',
  acronym: '',
  socialObject: '',
  currentProjects: '',
  address: '',
  zipcode: '',
  city: '',
  country: '',
  phone: '',
  email: '',
  siret: '',
  website: '',
  presidentNames: '',
  presidentPhone: '',
  presidentEmail: '',
  approvalDate: '',
  lastGoaDate: '',
  amountMembersAllowed: 0,
  isPublic: false,
  studentCount: 0
})


const newLogo = ref<undefined | File>(undefined)

const maxFileSize = 8388608

// Needed to modify the social networks of an association
const associationSocialNetworks = ref<AssociationSocialNetwork[]>([])

// Needed to temporarily store associations (for searching and pagination)
const associations = ref<Association[]>([])

// Functions
async function createAssociation(newAssociation: CreateAssociation): Promise<void> {
  await associationService.createAssociation(newAssociation)
}

async function getAssociationPdfExport(associationId: number): Promise<AxiosResponse> {
  return await associationService.getAssociationPdfExport(associationId)
}

export function useAssociation() {

  const associationStore = useAssociationStore()
  const {processDocuments} = useDocumentUploads()
  const {formatDate} = useUtil()

  const associationMemberCount = computed<number>(() => {
    return associationStore.associationUsers.length
  })

  const pathLogo = computed<AssociationLogoFormats | null>(() => {
    return associationStore.association?.pathLogo ?? null
  })

  const initEditedAssociation = () => {
    editedAssociation.value.name = associationStore.association?.name as string
    editedAssociation.value.acronym = associationStore.association?.acronym as string
    editedAssociation.value.socialObject = associationStore.association?.socialObject as string
    editedAssociation.value.currentProjects = associationStore.association?.currentProjects as string
    editedAssociation.value.address = associationStore.association?.address as string
    editedAssociation.value.zipcode = associationStore.association?.zipcode as string
    editedAssociation.value.city = associationStore.association?.city as string
    editedAssociation.value.country = associationStore.association?.country as string
    editedAssociation.value.phone = associationStore.association?.phone as string
    editedAssociation.value.email = associationStore.association?.email as string
    editedAssociation.value.siret = associationStore.association?.siret as string
    editedAssociation.value.website = associationStore.association?.website as string
    editedAssociation.value.presidentNames = associationStore.association?.presidentNames as string
    editedAssociation.value.presidentPhone = associationStore.association?.presidentPhone as string
    editedAssociation.value.presidentEmail = associationStore.association?.presidentEmail as string
    editedAssociation.value.approvalDate = formatDate(associationStore.association?.approvalDate as string)
    editedAssociation.value.lastGoaDate = formatDate(associationStore.association?.lastGoaDate as string)
    editedAssociation.value.institution = associationStore.association?.institution?.id
    editedAssociation.value.institutionComponent = associationStore.association?.institutionComponent?.id
    editedAssociation.value.activityField = associationStore.association?.activityField?.id
    editedAssociation.value.amountMembersAllowed = associationStore.association?.amountMembersAllowed ?? 0
    editedAssociation.value.isPublic = associationStore.association?.isPublic as boolean
    editedAssociation.value.studentCount = associationStore.association?.studentCount ?? 0
  }

  function verifyAssociationRole(userAssociation: RegisterUserAssociation) {
    userAssociation.options[0].disable = false
    const associationDetail = associationStore.associationNames
      .find(obj => obj.id === userAssociation.associationId)
    if (!associationDetail!.hasPresident) return
    userAssociation.options[0].disable = true
    if (userAssociation.role === 'isPresident') {
      userAssociation.role = 'isMember'
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

  function checkChanges(): Partial<UpdateAssociation> {
    const {formatDate} = useUtil()

    const original = associationStore.association
    const directFields = new Set([
      'name', 'acronym', 'socialObject', 'originalProjects', 'address',
      'zipcode', 'city', 'country', 'email', 'phone', 'siret',
      'website', 'presidentNames', 'presidentPhone', 'presidentEmail'
    ])
    const numericFields = new Set(['amountMembersAllowed', 'studentCount'])
    const relationFields = new Set(['institution', 'institutionComponent', 'activityField'])

    const changedData: Partial<UpdateAssociation> = {}

    const compareAndAssign = <K extends keyof UpdateAssociation>(key: K, newValue: UpdateAssociation[K]) => {
      if (newValue !== original?.[key]) {
        changedData[key] = newValue
      }
    }

    for (const [key, value] of Object.entries(editedAssociation.value)) {
      const typedKey = key as keyof UpdateAssociation

      if (directFields.has(key)) {
        compareAndAssign(typedKey, value)
      } else if (numericFields.has(key)) {
        compareAndAssign(typedKey, Number.parseInt(value as string))
      } else if (relationFields.has(key)) {
        const relationKey = relationFields[key]
        const originalId = (original?.[relationKey])?.id
        if (value !== originalId) {
          changedData[key] = value
        }
      } else if (key === 'lastGoaDate' && value !== null) {
        const formattedOriginal = formatDate(original?.lastGoaDate)
        if (value !== formattedOriginal) {
          changedData.lastGoaDate = value as string
        }
      }
    }
    const socialChanges = checkSocialNetworks()
    if (socialChanges !== undefined) {
      changedData['socialNetworks'] = socialChanges
    }
    return changedData
  }

  return {
    createAssociation,
    addNetwork,
    removeNetwork,
    associationSocialNetworks,
    checkChanges,
    checkSocialNetworks,
    verifyAssociationRole,
    associations,
    getAssociationPdfExport,
    checkHasStudentCertificate,
    initEditedAssociation,
    editedAssociation,
    maxFileSize,
    pathLogo,
    newLogo,
    associationMemberCount
  }
}
