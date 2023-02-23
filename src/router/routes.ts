import type {RouteRecordRaw} from 'vue-router'
import i18n from '@/plugins/i18n'


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
                path: 'associations',
                meta: {
                    breadcrumb: i18n.global.t('breadcrumbs.directory'),
                },
                children: [
                    {
                        path: '',
                        name: 'Associations',
                        component: () => import('@/views/directory/AssociationsView.vue'),
                        meta: {
                            title: 'Annuaire des associations'
                        }
                    },
                    {
                        path: ':id',
                        name: 'AssociationDetail',
                        component: () => import('@/views/directory/AssociationDetailView.vue'),
                        meta: {
                            breadcrumb: i18n.global.t('breadcrumbs.association-detail'),
                        }
                    }
                ]
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
                component: () => import('@/views/LoginView.vue'),
                meta: {
                    breadcrumb: i18n.global.t('breadcrumbs.login'),
                }
            },
            {
                path: 'cas-login',
                name: 'CASLogin',
                component: () => import('@/views/CASLoginView.vue')
            },
            {
                path: 'dashboard',
                meta: {
                    requiresAuth: true,
                    breadcrumb: i18n.global.t('breadcrumbs.dashboard')
                },
                children: [
                    {
                        path: '',
                        name: 'Dashboard',
                        component: () => import('@/views/dashboard/DashboardView.vue')
                    },
                    {
                        path: 'password-edit',
                        name: 'PasswordEdit',
                        component: () => import('@/views/PasswordEditView.vue'),
                        meta: {
                            breadcrumb: i18n.global.t('breadcrumbs.password-edit')
                        }
                    },
                    {
                        path: 'association-dashboard/:id',
                        meta: {
                            breadcrumb: i18n.global.t('breadcrumbs.association-dashboard'),
                            associationMembersOnly: true
                        },
                        children: [
                            {
                                path: '',
                                name: 'AssociationDashboard',
                                component: () => import('@/views/dashboard/AssociationDashboardView.vue')
                            },
                            {
                                path: 'edit-my-association',
                                name: 'EditMyAssociation',
                                meta: {
                                    breadcrumb: i18n.global.t('breadcrumbs.edit-my-association')
                                },
                                component: () => import('@/views/dashboard/AssociationEditionView.vue')
                            }
                        ]
                    },
                    {
                        path: 'validate-users',
                        meta: {
                            staffOnly: true,
                            breadcrumb: i18n.global.t('breadcrumbs.validate-users')
                        },
                        children: [
                            {
                                path: '',
                                name: 'ValidateUsers',
                                component: () => import('@/views/dashboard/UserManagementView.vue')
                            },
                            {
                                path: ':id',
                                name: 'UserValidationDetail',
                                component: () => import('@/views/dashboard/UserValidationDetailView.vue'),
                                meta: {
                                    breadcrumb: i18n.global.t('breadcrumbs.user-account')
                                }
                            },
                        ]
                    },
                    {
                        path: 'manage-users',
                        meta: {
                            staffOnly: true,
                            breadcrumb: i18n.global.t('breadcrumbs.manage-users')
                        },
                        children: [
                            {
                                path: '',
                                name: 'ManageUsers',
                                component: () => import('@/views/dashboard/UserManagementView.vue')
                            },
                            {
                                path: ':id',
                                name: 'UserManagementDetail',
                                component: () => import('@/views/dashboard/UserManagementDetailView.vue'),
                                meta: {
                                    breadcrumb: i18n.global.t('breadcrumbs.user-account')
                                }
                            },
                            {
                                path: 'add-user',
                                name: 'AddUser',
                                component: () => import('@/views/dashboard/UserAddView.vue'),
                                meta: {
                                    breadcrumb: i18n.global.t('breadcrumbs.add-user')
                                }
                            },
                        ]
                    },
                    {
                        path: 'manage-associations',
                        meta: {
                            breadcrumb: i18n.global.t('breadcrumbs.manage-associations')
                        },
                        children: [
                            {
                                path: '',
                                name: 'ManageAssociations',
                                component: () => import('@/views/dashboard/AssociationsManagementView.vue'),
                                meta: {staffOnly: true}
                            },
                            {
                                path: ':id',
                                name: 'EditAssociation',
                                meta: {
                                    breadcrumb: i18n.global.t('breadcrumbs.edit-association')
                                },
                                component: () => import('@/views/dashboard/AssociationEditionView.vue')
                            },
                            {
                                path: 'create-new',
                                name: 'CreateAssociation',
                                meta: {
                                    staffOnly: true,
                                    breadcrumb: i18n.global.t('breadcrumbs.create-association')
                                },
                                component: () => import('@/views/dashboard/AssociationCreateView.vue')
                            }
                        ]
                    }
                ]
            },
            {
                path: 'register',
                name: 'Registration',
                meta: {
                    breadcrumb: i18n.global.t('breadcrumbs.register')
                },
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
