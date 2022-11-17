import { createRouter, createWebHistory } from 'vue-router'
import routes from '@/router/routes'
import { useUserStore } from '@/stores/useUserStore'
import { loadUser } from "@/services/userService";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})


router.beforeEach(async (to) => {
  const userStore = useUserStore()
  await loadUser()
  /*if (to.meta.requiresAuth) {
    /!*
    if (localStorage.getItem('access') == null) {
      return ({ name: 'Login' })
    }*!/
    if (!userStore.isAuth) {
      return { name: 'Login' }
    }
  }*/
  if (to.meta.requiresAuth && !userStore.isAuth) {
    return { name: 'Login' }
  }
  if (userStore.isAuth) {
    if (to.name == 'Registration' || to.name == 'Login') {
      return { name: 'Home' }
    }
    /*if (to.name === 'Login') {
      return ({ name: 'Dashboard' })
    }*/
    if (to.name == 'PasswordReset') {
      return { name: 'ProfilePasswordEdit' }
    }
  }
})

export default router
