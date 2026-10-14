import {createRouter, createWebHistory} from 'vue-router'
import routes from '@/router/routes'
import {useProfileStore} from '@/stores/useProfileStore'
import useUserGroups from '@/composables/useUserGroup'
import {ref, watch} from 'vue'
import useSecurity from '@/composables/useAuthentication'
import useUtility from '@/composables/useUtil'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

const colorVariant = ref<string>('')

router.beforeEach(async (to) => {
  if (to.name === 'Logout' || to.name === 'Login') {
    return
  }

  const profileStore = useProfileStore()
  const {initStaffStatus, isStaff, getGroups, initIsMemberFund} = useUserGroups()
  const {hasPerm} = useSecurity()
  const {dynamicTitle, openMenu} = useUtility()

  if (openMenu.value) {
    openMenu.value = false
  }

  // Scroll to top when on a new page (except for anchors)
  if (!to.hash.includes('#')) window.scrollTo(0, 0)

  // Dynamically update <title>
  const initDocumentTitle = () => {
    document.title = `${to.meta.title ? (to.meta.title + ' | ')
      : (dynamicTitle.value ? dynamicTitle.value + ' | ' : '')}${import.meta.env.VITE_APP_SITE_NAME}`
  }
  initDocumentTitle()
  watch(() => dynamicTitle.value, initDocumentTitle)

  // Set color variant
  colorVariant.value = to.meta.colorVariant as string

  // Get auth user with token
  const accessToken = localStorage.getItem('JWT__access__token')
  if (!profileStore.user && accessToken) {
    try {
      await profileStore.getUser()
    } catch (error) {
      return {name: 'Logout'}
    }
  }

  // Get isStaff status if user is auth
  if (profileStore.isAuth) {
    await getGroups()
    initStaffStatus()
    initIsMemberFund()
  }

  // Authenticated views
  if (to.meta.requiresAuth && !profileStore.isAuth) return {name: 'Login'}

  // Check token expiration
  if (to.meta.requiresAuth) {
    const {tokenExpired} = useSecurity()
    const refreshToken = localStorage.getItem('JWT__refresh__token')
    if (tokenExpired(refreshToken)) {
      return {name: 'Logout'}
    }
  }

  // Restrict a certain type of member only
  if (to.meta.projectBearersOnly &&
    !(hasPerm('add_project') || hasPerm('change_project') || hasPerm('change_project_as_bearer'))
  ) return {name: '404'}
  if (to.meta.staffOnly && !isStaff.value) return {name: '404'}
  if (to.meta.associationMembersOnly && !profileStore.isAssociationMember) return {name: '404'}

  // Commission
  if (to.name == 'ArchivedCommission' && !hasPerm('view_project')) return {name: '404'}
  if (to.name === 'ManageCommissionDates' && !(hasPerm('add_commission') || hasPerm('change_commission'))) return {name: '404'}

  // Dashboard
  if ((to.name === 'ValidateUsers' || to.name === 'UserValidationDetail')
    && !hasPerm('change_user')) return {name: '404'}
  if ((to.name === 'ValidateAssociationUsers' || to.name === 'AssociationUserValidationDetail')
    && !hasPerm('change_associationuser')) return {name: '404'}
  if ((to.name === 'ManageUsers' || to.name === 'UserManagementDetail')
    && !hasPerm('change_user')) return {name: '404'}
  if (to.name === 'AddUser' && !hasPerm('add_user')) return {name: '404'}
  if ((to.name === 'ManageAssociations' || to.name === 'EditAssociation')
    && !hasPerm('change_association')) return {name: '404'}
  if (to.name === 'CreateAssociation' && !hasPerm('add_association')) return {name: '404'}
  if (to.name === 'ManageDocumentsLibrary'
    && (!hasPerm('add_document') || !hasPerm('change_document'))) return {name: '404'}
  if ((to.name === 'ManageContents' || to.name === 'ContentManagementDetail')
    && !hasPerm('change_content')) return {name: '404'}

  // Password setting and registration
  if (to.name == 'PasswordResetConfirm' && !to.query.uid && !to.query.token) return {name: '404'}
  if (to.name == 'RegistrationVerifyEmail' && !to.query.key) return {name: '404'}
  // if (to.name == 'RegistrationSuccessful' && !newUser.firstName) return {name: '404'}

  // If user is authenticated
  if (userStore.isAuth) {
    if (to.name == 'Registration' || to.name == 'Login') return {name: 'Dashboard'}
    else if (to.name == 'PasswordReset') return {name: 'ProfilePasswordEdit'}
  }
})

export default router
