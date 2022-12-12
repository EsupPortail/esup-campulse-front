import type {RouteRecordRaw} from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Root',
        component: () => import('@/layouts/LayoutDefault.vue'),
        children: [
            {
                path: '',
                name: 'Home',
                component: () => import('@/views/HomeView.vue')
            },
            {
                path: 'associations',
                name: 'Associations',
                component: () => import('@/views/AssociationsView.vue')
            },
            {
                path: 'association/:id',
                name: 'AssociationDetail',
                component: () => import('@/views/AssociationDetailView.vue')
            },
            {
                path: 'charter',
                name: 'Charter',
                component: () => import('@/views/CharterView.vue'),
                meta: {requiresAuth: true}
            },
            {
                path: 'commission',
                name: 'Commission',
                component: () => import('@/views/CommissionView.vue'),
                meta: {requiresAuth: true}
            },
            {
                path: 'login',
                name: 'Login',
                component: () => import('@/views/LoginView.vue')
            },
            {
                path: 'cas-login',
                name: 'CASLogin',
                component: () => import('@/views/CASLoginView.vue')
            },
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/DashboardView.vue')
            },
            {
                path: 'register',
                name: 'Registration',
                component: () => import('@/views/RegisterLocalView.vue')
            },
            {
                path: 'cas-register',
                name: 'CASRegistration',
                component: () => import('@/views/RegisterCASView.vue')
            },
            {
                path: 'register-successful',
                name: 'RegistrationSuccessful',
                component: () => import('@/views/RegisterSuccessfulView.vue')
            },
            {
                path: 'register-verify-email',
                name: 'RegistrationVerifyEmail',
                component: () => import('@/views/RegisterVerifyEmailView.vue')
            },
            {
                path: 'register-resend-email',
                name: 'RegistrationResendEmail',
                component: () => import('@/views/RegisterResendEmailView.vue')
            },
            {
                path: 'password-reset',
                name: 'PasswordReset',
                component: () => import('@/views/PasswordResetView.vue')
            },
            {
                path: 'password-reset-confirm',
                name: 'PasswordResetConfirm',
                component: () => import('@/views/PasswordResetConfirmView.vue')
            },
            {
                path: 'profile-password-edit',
                name: 'ProfilePasswordEdit',
                component: () => import('@/views/ProfilePasswordEditView.vue')
            },
            {
                path: 'validate-users',
                name: 'ValidateUsers',
                component: () => import('@/views/UsersView.vue')
            },
            {
                path: 'manage-users',
                name: 'ManageUsers',
                component: () => import('@/views/UsersView.vue')
            },
            {
                path: 'user/:id',
                name: 'UserDetail',
                component: () => import('@/views/UserDetailView.vue')
            },
            // This must be last
            {
                path: '404-not-found',
                name: '404',
                component: () => import('@/views/404View.vue')
            },
            {
                path: '/:catchAll(.*)',
                redirect: {name: '404'}
            }
        ]
    }
]

export default routes
