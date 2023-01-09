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
                component: () => import('@/views/directory/AssociationsView.vue')
            },
            {
                path: 'association/:id',
                name: 'AssociationDetail',
                component: () => import('@/views/directory/AssociationDetailView.vue')
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
                meta: {requiresAuth: true},
                children: [
                    {
                        path: '',
                        name: 'Dashboard',
                        component: () => import('@/views/dashboard/DashboardView.vue'),
                    },
                    {
                        path: 'password-edit',
                        name: 'PasswordEdit',
                        component: () => import('@/views/PasswordEditView.vue')
                    },
                    {
                        path: 'validate-users',
                        children: [
                            {
                                path: '',
                                name: 'ValidateUsers',
                                component: () => import('@/views/dashboard/UsersView.vue')
                            },
                            {
                                path: ':id',
                                name: 'UserValidationDetail',
                                component: () => import('@/views/dashboard/UserValidationDetailView.vue')
                            },
                        ]
                    },
                    {
                        path: 'manage-users',
                        children: [
                            {
                                path: '',
                                name: 'ManageUsers',
                                component: () => import('@/views/dashboard/UsersView.vue')
                            },
                            {
                                path: ':id',
                                name: 'UserManagementDetail',
                                component: () => import('@/views/dashboard/UserManagementDetailView.vue')
                            },
                        ]
                    },
                    {
                        path: 'manage-associations',
                        children: [
                            {
                                path: '',
                                name: 'ManageAssociations',
                                component: () => import('@/views/dashboard/AssociationsManagementView.vue')
                            },
                            {
                                path: 'create-new',
                                name: 'CreateAssociation',
                                component: () => import('@/views/AssociationCreateView.vue')
                            }
                        ]
                    }
                ]
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
