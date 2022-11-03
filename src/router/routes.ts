import type { RouteRecordRaw } from 'vue-router'


const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Root',
        component: () => import('@/layouts/LayoutDefault.vue'),
        children: [
            {
                path: '',
                name: 'home',
                component: () => import('@/views/HomeView.vue'),
            },
            {
                path: '/annuaire',
                name: 'directory',
                component: () => import('@/views/HomeView.vue'),
            },
            {
                path: '/charte',
                name: 'charter',
                component: () => import('@/views/HomeView.vue'),
                meta: {requiresAuth: true}
            },
            {
                path: '/cape',
                name: 'commission',
                component: () => import('@/views/HomeView.vue'),
                meta: {requiresAuth: true}
            },
            {
                path: '/login',
                name: 'login',
                component: () => import('@/views/LoginView.vue'),
            },
            {
                path: '/logout',
                name: 'logout',
                component: () => import('@/views/LogoutView.vue'),
            },
            {
                path: '/dashboard',
                name: 'dashboard',
                component: () => import('@/views/DashboardView.vue'),
            }
        ]
    }
]

export default routes
