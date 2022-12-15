import {createRouter, createWebHistory} from 'vue-router'
import routes from '@/router/routes'
import {useUserStore} from '@/stores/useUserStore'
import {loadUser} from '@/services/userService'


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach(async (to) => {
    const userStore = useUserStore()
    await loadUser()

    if (to.meta.requiresAuth && !userStore.isAuth) {
        return {name: 'Login'}
    }
    if (to.name == 'PasswordResetConfirm' && !to.query.uid && !to.query.token) {
        return {name: '404'}
    }
    if (to.name == 'RegistrationVerifyEmail' && !to.query.key) {
        return {name: '404'}
    }

    if (to.meta.uniManagerOnly && !userStore.isUniManager) {
        return {name: '404'}
    }

    if (userStore.isAuth) {
        if (to.name == 'Registration' || to.name == 'Login') {
            return {name: 'Dashboard'}
        } else if (to.name == 'PasswordReset') {
            return {name: 'ProfilePasswordEdit'}
        }
    }
})

export default router
