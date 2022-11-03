import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})


router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    await router.push({name: 'login'})
  }
})


export default router
