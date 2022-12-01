import {createRouter, createWebHistory} from 'vue-router'
import routes from '@/router/routes'
import {useUserStore} from '@/stores/useUserStore'
import {loadUser} from '@/services/userService'


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach(async (to, from) => {
    const userStore = useUserStore()
    await loadUser()
    if (to.meta.requiresAuth && !userStore.isAuth) {
        return {name: 'Login'}
    }
    // If no specific queries in url
    if (to.name == 'PasswordResetConfirm' && !to.query.uid && !to.query.token) {
        return {name: '404'}
    }
    if (to.name == 'RegistrationVerifyEmail' && !to.query.key) {
        return {name: '404'}
    }
    // If to registration successful and not from register of CAS register
    /*    if (to.name == 'RegistrationSuccessful' && from.name !== 'Registration') {
            return {name: '404'}
        } else if (to.name == 'RegistrationSuccessful' && from.name !== 'CASRegistration') {
            return {name: '404'}
        }*/
    // If user is auth
    if (userStore.isAuth) {
        if (to.name == 'Registration' || to.name == 'Login') {
            return {name: 'Dashboard'}
        } else if (to.name == 'PasswordReset') {
            return {name: 'ProfilePasswordEdit'}
        }
    }
})

export default router
