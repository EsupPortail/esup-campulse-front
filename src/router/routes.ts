import type { RouteRecordRaw } from 'vue-router'
import _axios from '@/plugins/axios'
import router from '@/router/index'


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
                component: () => import('@/views/DirectoryView.vue'),
            },
            {
                path: 'charter',
                name: 'Charter',
                component: () => import('@/views/CharterView.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'commission',
                name: 'Commission',
                component: () => import('@/views/CommissionView.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'login',
                name: 'Login',
                component: () => import('@/views/LoginView.vue'),
            },
            {
                path: 'cas-login',
                name: 'CASLogin',
                component: () => import('@/views/CASLoginView.vue'),
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
            },
            {
                path: 'register',
                name: 'Registration',
                component: () => import('@/views/RegisterLocalView.vue'),
            },
            {
                path: 'cas-register',
                name: 'CASRegistration',
                component: () => import('@/views/RegisterCASView.vue'),
            }
        ]
    }
]

export default routes
