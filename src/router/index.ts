import { createRouter, createWebHistory } from 'vue-router'
import routes from '@/router/routes'
import { useUserStore } from '@/stores/useUserStore'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})


router.beforeEach((to) => {
    if (to.meta.requiresAuth) {
        if (localStorage.getItem('access') == null) {
            return ({name: 'Login'})
        }
        const userStore = useUserStore()
        if (!userStore.isAuth) {
            return ({name: 'Login'})
        }
    }
})

export default router
