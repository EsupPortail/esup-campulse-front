import {createRouter, createWebHistory} from 'vue-router'
import routes from '@/router/routes'
import {useUserStore} from '@/stores/useUserStore'
import useUserGroups from '@/composables/useUserGroups'
import {ref} from 'vue'
import useSecurity from '@/composables/useSecurity'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

const colorVariant = ref<string>('')


router.beforeEach(async (to) => {

    const userStore = useUserStore()
    const {initStaffStatus, isStaff, getGroups} = useUserGroups()
    const {newUser, hasPerm} = useSecurity()

    // Get auth user with token
    const accessToken = localStorage.getItem('JWT__access__token')
    if (!userStore.user && accessToken) {
        await userStore.getUser()
    }

    // Get isStaff status if user is auth
    if (userStore.isAuth && isStaff.value === undefined) {
        await getGroups()
        await initStaffStatus()
    }

    colorVariant.value = to.meta.colorVariant as string

    if (to.meta.requiresAuth && !userStore.isAuth) return {name: 'Login'}

    if (to.name == 'PasswordResetConfirm' && !to.query.uid && !to.query.token) return {name: '404'}

    if (to.name == 'RegistrationVerifyEmail' && !to.query.key) return {name: '404'}

    if (to.name == 'RegistrationSuccessful' && !newUser.firstName) return {name: '404'}

    if (to.meta.staffOnly && !isStaff.value) return {name: '404'}

    if (to.meta.associationMembersOnly && !userStore.isAssociationMember) return {name: '404'}

    if (userStore.isAuth) {
        if (to.name == 'Registration' || to.name == 'Login') {
            return {name: 'Dashboard'}
        } else if (to.name == 'PasswordReset') {
            return {name: 'ProfilePasswordEdit'}
        }
    }

    if (to.meta.projectBearersOnly && (!hasPerm('add_project')
        && !hasPerm('change_project_as_bearer'))) return {name: '404'}

    if (to.name === 'ManageCommissionDates' && !hasPerm('change_commissiondate')) return {name: '404'}
})

export default router
