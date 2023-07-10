import {createRouter, createWebHistory} from 'vue-router'
import routes from '@/router/routes'
import {useUserStore} from '@/stores/useUserStore'
import useUserGroups from '@/composables/useUserGroups'
import {ref} from 'vue'
import useSecurity from '@/composables/useSecurity'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title ? `${to.meta.title} | ` : ''}${import.meta.env.VITE_APP_SITE_NAME}`
    next()
})

const colorVariant = ref<string>('')

router.beforeEach(async (to) => {
    if (!to.hash.includes('#')) window.scrollTo(0, 0)

    const userStore = useUserStore()
    const {initStaffStatus, isStaff, getGroups} = useUserGroups()
    const {newUser, hasPerm} = useSecurity()

    // Set color variant
    colorVariant.value = to.meta.colorVariant as string

    // Get auth user with token
    const accessToken = localStorage.getItem('JWT__access__token')
    if (!userStore.user && accessToken) {
        try {
            await userStore.getUser()
        } catch (error) {
            userStore.logOut()
        }
    }

    // Get isStaff status if user is auth
    if (userStore.isAuth) {
        await getGroups()
        await initStaffStatus()
    }

    // Authenticated views
    if (to.meta.requiresAuth && !userStore.isAuth) return {name: 'Login'}

    // Restrict a certain type of member only
    if (to.meta.projectBearersOnly && (!hasPerm('add_project')
        && !hasPerm('change_project_as_bearer'))) return {name: '404'}
    if (to.meta.staffOnly && !isStaff.value) return {name: '404'}
    if (to.meta.associationMembersOnly && !userStore.isAssociationMember) return {name: '404'}

    // Commission
    if (to.name == 'ArchivedCommission' && !hasPerm('view_project')) return {name: '404'}
    if (to.name === 'ManageCommissionDates'
        && (!hasPerm('add_commission') || !hasPerm('change_commission') || !hasPerm('delete_commission')))
        return {name: '404'}

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
        && (!hasPerm('add_document' || !hasPerm('change_document')))) return {name: '404'}

    // Password setting and registration
    if (to.name == 'PasswordResetConfirm' && !to.query.uid && !to.query.token) return {name: '404'}
    if (to.name == 'RegistrationVerifyEmail' && !to.query.key) return {name: '404'}
    if (to.name == 'RegistrationSuccessful' && !newUser.firstName) return {name: '404'}

    // If user is authenticated
    if (userStore.isAuth) {
        if (to.name == 'Registration' || to.name == 'Login') return {name: 'Dashboard'}
        else if (to.name == 'PasswordReset') return {name: 'ProfilePasswordEdit'}
    }
})

export default router
