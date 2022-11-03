import type { RouteRecordRaw } from 'vue-router'


const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Root',
        component: () => import('@/layouts/LayoutDefault.vue'),
        children: [
            {
                path: '',
                name: 'Home',
                component: () => import('@/views/HomeView.vue'),
            },
            {
                path: 'directory',
                name: 'Directory',
                component: () => import('@/views/HomeView.vue'),
            },
            {
                path: 'charter',
                name: 'Charter',
                component: () => import('@/views/HomeView.vue'),
                meta: {requiresAuth: true}
            },
            {
                path: 'commission',
                name: 'Commission',
                component: () => import('@/views/HomeView.vue'),
                meta: {requiresAuth: true}
            },
            {
                path: 'login',
                name: 'Login',
                component: () => import('@/views/LoginView.vue'),
            },
            {
                path: 'logout',
                name: 'Logout',
                component: () => import('@/views/LogoutView.vue'),
            },
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/DashboardView.vue'),
            }
        ]
    }
]

export default routes
