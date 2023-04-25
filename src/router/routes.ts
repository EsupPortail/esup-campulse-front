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
                    colorVariant: 'space-1'
                },
                children: [
                    {
                        path: '',
                        name: 'Associations',
                        component: () => import('@/views/directory/AssociationsView.vue'),
                        meta: {
                            title: i18n.global.t('breadcrumbs.directory'),
                        }
                    },
                    {
                        path: ':id',
                        name: 'AssociationDetail',
                        component: () => import('@/views/directory/AssociationDetailView.vue'),
                        meta: {
                            breadcrumb: i18n.global.t('breadcrumbs.association-detail')
                        }
                    }
                ]
            },
            {
                path: 'charter',
                name: 'Charter',
                component: () => import('@/views/CharterView.vue'),
                meta: {
                    requiresAuth: true,
                    colorVariant: 'space-2',
                    title: i18n.global.t('breadcrumbs.charter'), // ADDED
                    breadcrumb: i18n.global.t('breadcrumbs.charter') // ADDED
                }
            },
            {
                path: 'commission',
                meta: {
                    breadcrumb: i18n.global.t('breadcrumbs.commission'),
                    requiresAuth: true,
                    colorVariant: 'space-3'
                },
                children: [
                    {
                        path: '',
                        name: 'Commission',
                        component: () => import('@/views/CommissionView.vue'),
                        meta: {
                            title: i18n.global.t('breadcrumbs.commission')
                        }
                    },
                    {
                        path: 'association/:associationId',
                        meta: {
                            breadcrumb: i18n.global.t('breadcrumbs.manage-my-projects'),
                            requiresAddProjectPerm: true
                        },
                        children: [
                            {
                                path: '',
                                name: 'CommissionAssociationDashboard',
                                component: () => import('@/views/dashboard/projectManagement/CommissionAssociationDashboardView.vue'),
                                meta: {
                                    title: i18n.global.t('breadcrumbs.manage-my-projects')
                                }
                            },
                            {
                                path: 'submit-project/:projectId?',
                                name: 'SubmitProjectAssociation',
                                component: () => import('@/views/dashboard/projectManagement/SubmitProjectView.vue'),
                                meta: {
                                    title: i18n.global.t('breadcrumbs.submit-project'),
                                    breadcrumb: i18n.global.t('breadcrumbs.submit-project')
                                }
                            }
                        ]
                    },
                    {
                        path: 'individual',
                        meta: {
                            breadcrumb: i18n.global.t('breadcrumbs.manage-my-projects'),
                            requiresAddProjectPerm: true
                        },
                        children: [
                            {
                                path: '',
                                name: 'CommissionIndividualDashboard',
                                component: () => import('@/views/dashboard/projectManagement/CommissionIndividualDashboardView.vue'),
                                meta: {
                                    title: i18n.global.t('breadcrumbs.manage-my-projects')
                                }
                            },
                            {
                                path: 'submit-project/:projectId?',
                                name: 'SubmitProjectIndividual',
                                component: () => import('@/views/dashboard/projectManagement/SubmitProjectView.vue'),
                                meta: {
                                    title: i18n.global.t('breadcrumbs.submit-project'),
                                    breadcrumb: i18n.global.t('breadcrumbs.submit-project')
                                }
                            }
                        ]
                    },
                    {
                        path: 'submit-project-successful/:projectId',
                        name: 'SubmitProjectSuccessful',
                        component: () => import('@/views/dashboard/projectManagement/SubmitProjectSuccessfulView.vue'),
                        meta: {
                            title: i18n.global.t('breadcrumbs.project-recap'),
                            breadcrumb: i18n.global.t('breadcrumbs.project-recap'),
                            requiresAddProjectPerm: true
                        }
                    }
                ]
            },
            {
                path: 'cas-login',
                name: 'CASLogin',
                component: () => import('@/views/CASLoginView.vue')
            },
            {
                path: 'dashboard',
                meta: {
                    breadcrumb: i18n.global.t('breadcrumbs.dashboard'),
                    requiresAuth: true,
                    colorVariant: 'space-4'
                },
                children: [
                    {
                        path: '',
                        name: 'Dashboard',
                        component: () => import('@/views/dashboard/DashboardView.vue'),
                        meta: {
                            title: i18n.global.t('breadcrumbs.dashboard')
                        }
                    },
                    {
                        path: 'manage-account',
                        name: 'ManageAccount',
                        component: () => import('@/views/dashboard/AccountInfosView.vue'),
                        meta: {
                            breadcrumb: i18n.global.t('breadcrumbs.account-infos'),
                            title: i18n.global.t('breadcrumbs.account-infos')
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
                                component: () => import('@/views/dashboard/AssociationDashboardView.vue'),
                                meta: {
                                    title: i18n.global.t('breadcrumbs.association-dashboard'),
                                }
                            },
                            {
                                path: 'edit-my-association',
                                name: 'EditMyAssociation',
                                component: () => import('@/views/dashboard/AssociationEditionView.vue'),
                                meta: {
                                    breadcrumb: i18n.global.t('breadcrumbs.edit-my-association'),
                                    colorVariant: 'space-1',
                                    title: i18n.global.t('breadcrumbs.edit-my-association'),
                                }
                            },
                            {
                                path: 'presidency-delegation',
                                name: 'AssociationPresidencyDelegation',
                                component: () => import('@/views/dashboard/AssociationPresidencyDelegationView.vue'),
                                meta: {
                                    breadcrumb: i18n.global.t('breadcrumbs.edit-association-president-delegation'),
                                    title: i18n.global.t('breadcrumbs.edit-association-president-delegation')
                                }
                            }

                        ]
                    },
                    {
                        path: 'validate-users',
                        meta: {
                            breadcrumb: i18n.global.t('breadcrumbs.validate-users'),
                            staffOnly: true
                        },
                        children: [
                            {
                                path: '',
                                name: 'ValidateUsers',
                                component: () => import('@/views/dashboard/UserManagementView.vue'),
                                meta: {
                                    title: i18n.global.t('breadcrumbs.validate-users')
                                }
                            },
                            {
                                path: ':id',
                                name: 'UserValidationDetail',
                                component: () => import('@/views/dashboard/UserValidationDetailView.vue'),
                                meta: {
                                    breadcrumb: i18n.global.t('breadcrumbs.user-account'),
                                    title: i18n.global.t('breadcrumbs.user-account')
                                }
                            },
                        ]
                    },
                    {
                        path: 'validate-association-users',
                        meta: {
                            breadcrumb: i18n.global.t('breadcrumbs.validate-association-users'),
                            staffOnly: true
                        },
                        children: [
                            {
                                path: '',
                                name: 'ValidateAssociationUsers',
                                component: () => import('@/views/dashboard/AssociationUsersValidationView.vue'),
                                meta: {
                                    title: i18n.global.t('breadcrumbs.validate-association-users')
                                }
                            },
                            {
                                path: ':userId/:associationId',
                                name: 'AssociationUserValidationDetail',
                                component: () => import('@/views/dashboard/AssociationUserValidationDetailView.vue'),
                                meta: {
                                    breadcrumb: i18n.global.t('breadcrumbs.validate-association-user-detail'),
                                    title: i18n.global.t('breadcrumbs.validate-association-user-detail')
                                }
                            }
                        ]
                    },
                    {
                        path: 'manage-users',
                        meta: {
                            breadcrumb: i18n.global.t('breadcrumbs.manage-users'),
                            staffOnly: true
                        },
                        children: [
                            {
                                path: '',
                                name: 'ManageUsers',
                                component: () => import('@/views/dashboard/UserManagementView.vue'),
                                meta: {
                                    title: i18n.global.t('breadcrumbs.manage-users')
                                }
                            },
                            {
                                path: ':id',
                                name: 'UserManagementDetail',
                                component: () => import('@/views/dashboard/UserManagementDetailView.vue'),
                                meta: {
                                    breadcrumb: i18n.global.t('breadcrumbs.user-account'),
                                    title: i18n.global.t('breadcrumbs.user-account')
                                }
                            },
                            {
                                path: 'add-user',
                                name: 'AddUser',
                                component: () => import('@/views/dashboard/UserAddView.vue'),
                                meta: {
                                    breadcrumb: i18n.global.t('breadcrumbs.add-user'),
                                    title: i18n.global.t('breadcrumbs.add-user')
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
                                meta: {
                                    title: i18n.global.t('breadcrumbs.manage-associations'),
                                    staffOnly: true
                                }
                            },
                            {
                                path: ':id',
                                name: 'EditAssociation',
                                component: () => import('@/views/dashboard/AssociationEditionView.vue'),
                                meta: {
                                    breadcrumb: i18n.global.t('breadcrumbs.edit-association'),
                                    colorVariant: 'space-1'
                                },
                            },
                            {
                                path: 'create-new',
                                name: 'CreateAssociation',
                                component: () => import('@/views/dashboard/AssociationCreateView.vue'),
                                meta: {
                                    breadcrumb: i18n.global.t('breadcrumbs.create-association'),
                                    title: i18n.global.t('breadcrumbs.create-association'),
                                    staffOnly: true
                                },
                            }
                        ]
                    }
                ]
            },
            {
                path: 'register',
                name: 'Registration',
                component: () => import('@/views/RegisterLocalView.vue'),
                meta: {
                    breadcrumb: i18n.global.t('breadcrumbs.register'),
                    title: i18n.global.t('breadcrumbs.register'),
                    colorVariant: 'space-4'
                },
            },
            {
                path: 'cas-register',
                name: 'CASRegistration',
                component: () => import('@/views/RegisterCASView.vue'),
                meta: {
                    breadcrumb: i18n.global.t('breadcrumbs.register'),
                    title: i18n.global.t('breadcrumbs.register'),
                    colorVariant: 'space-4'
                },
            },
            {
                path: 'register-successful',
                name: 'RegistrationSuccessful',
                component: () => import('@/views/RegisterSuccessfulView.vue'),
                meta: {
                    colorVariant: 'space-4'
                }
            },
            {
                path: 'register-verify-email',
                name: 'RegistrationVerifyEmail',
                component: () => import('@/views/RegisterVerifyEmailView.vue'),
                meta: {
                    colorVariant: 'space-4'
                }
            },
            {
                path: 'register-resend-email',
                name: 'RegistrationResendEmail',
                component: () => import('@/views/RegisterResendEmailView.vue'),
                meta: {
                    colorVariant: 'space-4'
                }
            },
            {
                path: 'password-reset',
                name: 'PasswordReset',
                component: () => import('@/views/PasswordResetView.vue'),
                meta: {
                    colorVariant: 'space-4'
                }
            },
            {
                path: 'password-reset-confirm',
                name: 'PasswordResetConfirm',
                component: () => import('@/views/PasswordResetConfirmView.vue'),
                meta: {
                    colorVariant: 'space-4'
                }
            },
            {
                path: 'about-page',
                name: 'About',
                component: () => import('@/views/AboutView.vue'),
                meta: {
                    title: i18n.global.t('breadcrumbs.about'),
                    breadcrumb: i18n.global.t('breadcrumbs.about'),
                    colorVariant: 'space-1',
                }
            },
            {
                path: 'contact-page',
                name: 'Contact',
                component: () => import('@/views/ContactView.vue'),
                meta: {
                    title: i18n.global.t('breadcrumbs.contact'),
                    breadcrumb: i18n.global.t('breadcrumbs.contact'),
                    colorVariant: 'space-1',
                }
            },
            // This must be lasst
            {
                path: '404-not-found',
                name: '404',
                component: () => import('@/views/404View.vue')
            },
            {
                path: '/:catchAll(.*)',
                redirect: {
                    name: '404'
                }
            }
        ]
    },
    {
        path: '/login',
        component: () => import('@/layouts/LayoutMinimalHeader.vue'),
        children: [
            {
                path: '',
                name: 'Login',
                component: () => import('@/views/LoginView.vue'),
            }
        ]
    },
    {
        path: '/design-system',
        name: 'DesignSystem',
        component: () => import('@/views/DesignSystem.vue'),
    },
]

export default routes
