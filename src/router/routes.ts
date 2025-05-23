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
                meta: {
                    title: i18n.global.t('breadcrumbs.home'),
                    siteMap: true,
                }
            },
            {
                path: 'associations',
                meta: {
                    breadcrumb: i18n.global.t('breadcrumbs.directory'),
                    colorVariant: 'space-1',
                    siteMap: true,
                },
                children: [
                    {
                        path: '',
                        name: 'Associations',
                        component: () => import('@/views/directory/AssociationsView.vue'),
                        meta: {
                            title: i18n.global.t('breadcrumbs.directory'),
                            siteMap: true,
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
                meta: {
                    colorVariant: 'space-2',
                    breadcrumb: i18n.global.t('breadcrumbs.charter'),
                    siteMap: true,
                },
                children: [
                    {
                        path: '',
                        name: 'Charter',
                        component: () => import('@/views/charter/CharterView.vue'),
                        meta: {
                            title: i18n.global.t('breadcrumbs.charter'),
                            siteMap: true,
                        },
                    },
                    {
                        path: 'manage',
                        meta: {
                            requiresAuth: true,
                            breadcrumb: i18n.global.t('breadcrumbs.manage-charters')
                        },
                        children: [
                            {
                                path: '',
                                name: 'ManageCharters',
                                component: () => import('@/views/charter/CharterDashboardView.vue'),
                                meta: {
                                    title: i18n.global.t('breadcrumbs.manage-charters'),
                                }
                            },
                            {
                                path: ':associationId',
                                children: [
                                    {
                                        path: '',
                                        name: 'AssociationCharterList',
                                        component: () => import('@/views/charter/AssociationCharterListView.vue'),
                                        meta: {
                                            breadcrumb: i18n.global.t('breadcrumbs.association-charters-detail')
                                        }
                                    },
                                    {
                                        path: 'validate',
                                        name: 'AssociationCharterValidation',
                                        component: () => import('@/views/charter/AssociationCharterValidationView.vue'),
                                        meta: {
                                            breadcrumb: i18n.global.t('breadcrumbs.association-charter-validation')
                                        }
                                    },
                                    {
                                        path: 'view',
                                        name: 'AssociationCharterDetail',
                                        component: () => import('@/views/charter/AssociationCharterDetailView.vue'),
                                        meta: {
                                            breadcrumb: i18n.global.t('breadcrumbs.association-charter-detail')
                                        }
                                    }
                                ]
                            },
                        ]
                    },
                    {
                        path: 'sign/:associationId',
                        name: 'SignCharter',
                        component: () => import('@/views/charter/SignCharterView.vue'),
                        meta: {
                            breadcrumb: i18n.global.t('breadcrumbs.sign-charter'),
                            title: i18n.global.t('breadcrumbs.sign-charter'),
                            associationMembersOnly: true,
                            requiresAuth: true
                        }
                    },
                    {
                        path: 'sign-successful/:associationId',
                        name: 'SignCharterSuccessful',
                        component: () => import('@/views/charter/SignCharterSuccessfulView.vue'),
                        meta: {
                            breadcrumb: i18n.global.t('breadcrumbs.sign-charter-recap'),
                            title: i18n.global.t('breadcrumbs.sign-charter-recap'),
                            associationMembersOnly: true,
                            requiresAuth: true
                        }
                    }
                ]
            },
            {
                path: 'commission',
                meta: {
                    breadcrumb: i18n.global.t('breadcrumbs.commission'),
                    colorVariant: 'space-3',
                    siteMap: true,
                },
                children: [
                    {
                        path: '',
                        name: 'Commission',
                        component: () => import('@/views/commission/CommissionsView.vue'),
                        meta: {
                            title: i18n.global.t('breadcrumbs.commission')
                        }
                    },
                    {
                        path: 'manage',
                        meta: {
                            breadcrumb: i18n.global.t('breadcrumbs.commission-dashboard'),
                            requiresAuth: true,
                            siteMap: true,
                        },
                        children: [
                            {
                                path: '',
                                name: 'ManageProjects',
                                component: () => import('@/views/commission/CommissionDashboardView.vue'),
                                meta: {
                                    title: i18n.global.t('breadcrumbs.commission-dashboard'),
                                    siteMap: true,
                                }
                            },
                            {
                                path: 'association/:associationId',
                                meta: {
                                    projectBearersOnly: true,
                                    requiresAuth: true
                                },
                                children: [
                                    {
                                        path: 'submit-project/:projectId?',
                                        name: 'SubmitProjectAssociation',
                                        component: () => import('@/views/project/SubmitProjectView.vue'),
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
                                    projectBearersOnly: true,
                                    requiresAuth: true,
                                    siteMap: true,
                                },
                                children: [
                                    {
                                        path: 'submit-project/:projectId?',
                                        name: 'SubmitProjectIndividual',
                                        component: () => import('@/views/project/SubmitProjectView.vue'),
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
                                component: () => import('@/views/project/SubmitProjectSuccessfulView.vue'),
                                meta: {
                                    title: i18n.global.t('breadcrumbs.project-recap'),
                                    breadcrumb: i18n.global.t('breadcrumbs.project-recap'),
                                    projectBearersOnly: true,
                                    requiresAuth: true
                                }
                            },
                            {
                                path: 'view-project/:projectId',
                                name: 'ViewProject',
                                component: () => import('@/views/project/ProjectDetailView.vue'),
                                meta: {
                                    title: i18n.global.t('breadcrumbs.project-recap'),
                                    breadcrumb: i18n.global.t('breadcrumbs.project-recap'),
                                    requiresAuth: true
                                }
                            },
                            {
                                path: 'manage-project/:projectId',
                                name: 'ManageProject',
                                component: () => import('@/views/project/ProjectDetailView.vue'),
                                meta: {
                                    title: i18n.global.t('breadcrumbs.project-recap'),
                                    breadcrumb: i18n.global.t('breadcrumbs.project-recap'),
                                    requiresAuth: true
                                }
                            },
                            {
                                path: 'submit-project-review/:projectId',
                                name: 'SubmitProjectReview',
                                component: () => import('@/views/project/SubmitProjectReviewView.vue'),
                                meta: {
                                    title: i18n.global.t('breadcrumbs.submit-project-review'),
                                    breadcrumb: i18n.global.t('breadcrumbs.submit-project-review'),
                                    requiresAuth: true
                                }
                            },
                            {
                                path: 'submit-project-review-successful/:projectId',
                                name: 'SubmitProjectReviewSuccessful',
                                component: () => import('@/views/project/SubmitProjectReviewSuccessfulView.vue'),
                                meta: {
                                    title: i18n.global.t('breadcrumbs.project-recap'),
                                    breadcrumb: i18n.global.t('breadcrumbs.project-recap'),
                                    projectBearersOnly: true,
                                    requiresAuth: true
                                }
                            },
                            {
                                path: 'view-project-review/:projectId',
                                name: 'ViewProjectReview',
                                component: () => import('@/views/project/ProjectReviewDetailView.vue'),
                                meta: {
                                    title: i18n.global.t('breadcrumbs.project-review-recap'),
                                    breadcrumb: i18n.global.t('breadcrumbs.project-review-recap'),
                                    requiresAuth: true
                                }
                            },
                            {
                                path: 'manage-project-review/:projectId',
                                name: 'ManageProjectReview',
                                component: () => import('@/views/project/ProjectReviewDetailView.vue'),
                                meta: {
                                    title: i18n.global.t('breadcrumbs.project-review-recap'),
                                    breadcrumb: i18n.global.t('breadcrumbs.project-review-recap'),
                                    requiresAuth: true
                                }
                            }
                        ]
                    },
                    {
                        path: 'archived',
                        meta: {
                            breadcrumb: i18n.global.t('breadcrumbs.archived-commission'),
                            staffOnly: true,
                            requiresAuth: true,
                            siteMap: true,
                        },
                        children: [
                            {
                                path: '',
                                name: 'ArchivedCommission',
                                component: () => import('@/views/commission/ArchivedCommissionsView.vue'),
                                meta: {
                                    title: i18n.global.t('breadcrumbs.archived-commission'),
                                    siteMap: true,
                                }
                            },
                            {
                                path: ':id',
                                name: 'ArchivedCommissionDetail',
                                component: () => import('@/views/commission/ArchivedCommissionDetailView.vue'),
                                meta: {
                                    breadcrumb: i18n.global.t('breadcrumbs.archived-projects'),
                                    staffOnly: true
                                }
                            },
                        ]
                    },
                    {
                        path: 'manage-commission-dates',
                        name: 'ManageCommissionDates',
                        component: () => import('@/views/commission/ManageCommissionDatesView.vue'),
                        meta: {
                            title: i18n.global.t('breadcrumbs.manage-commission-dates'),
                            breadcrumb: i18n.global.t('breadcrumbs.manage-commission-dates'),
                            staffOnly: true,
                            requiresAuth: true,
                            siteMap: true,
                        }
                    }
                ]
            },
            {
                path: 'dashboard',
                meta: {
                    breadcrumb: i18n.global.t('breadcrumbs.dashboard'),
                    requiresAuth: true,
                    colorVariant: 'space-4',
                    siteMap: true,
                },
                children: [
                    {
                        path: '',
                        name: 'Dashboard',
                        component: () => import('@/views/dashboard/DashboardView.vue'),
                        meta: {
                            title: i18n.global.t('breadcrumbs.dashboard'),
                            siteMap: true,
                        }
                    },
                    {
                        path: 'manage-account',
                        name: 'ManageAccount',
                        component: () => import('@/views/dashboard/AccountInfosView.vue'),
                        meta: {
                            breadcrumb: i18n.global.t('breadcrumbs.account-infos'),
                            title: i18n.global.t('breadcrumbs.account-infos'),
                            siteMap: true,
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
                            staffOnly: true,
                            siteMap: true,
                        },
                        children: [
                            {
                                path: '',
                                name: 'ValidateUsers',
                                component: () => import('@/views/dashboard/UserManagementView.vue'),
                                meta: {
                                    title: i18n.global.t('breadcrumbs.validate-users'),
                                    siteMap: true,
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
                            staffOnly: true,
                            siteMap: true,
                        },
                        children: [
                            {
                                path: '',
                                name: 'ValidateAssociationUsers',
                                component: () => import('@/views/dashboard/AssociationUsersValidationView.vue'),
                                meta: {
                                    title: i18n.global.t('breadcrumbs.validate-association-users'),
                                    siteMap: true,
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
                            staffOnly: true,
                            siteMap: true,
                        },
                        children: [
                            {
                                path: '',
                                name: 'ManageUsers',
                                component: () => import('@/views/dashboard/UserManagementView.vue'),
                                meta: {
                                    title: i18n.global.t('breadcrumbs.manage-users'),
                                    siteMap: true,
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
                                    title: i18n.global.t('breadcrumbs.add-user'),
                                    siteMap: true,
                                }
                            },
                        ]
                    },
                    {
                        path: 'manage-associations',
                        meta: {
                            breadcrumb: i18n.global.t('breadcrumbs.manage-associations'),
                            siteMap: true,
                        },
                        children: [
                            {
                                path: '',
                                name: 'ManageAssociations',
                                component: () => import('@/views/dashboard/AssociationsManagementView.vue'),
                                meta: {
                                    title: i18n.global.t('breadcrumbs.manage-associations'),
                                    colorVariant: 'space-1',
                                    staffOnly: true,
                                    siteMap: true,
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
                                    staffOnly: true,
                                    siteMap: true,
                                },
                            }
                        ]
                    },
                    {
                        path: 'manage-documents-library',
                        name: 'ManageDocumentsLibrary',
                        component: () => import('@/views/dashboard/ManageDocumentsLibraryView.vue'),
                        meta: {
                            breadcrumb: i18n.global.t('breadcrumbs.template-documents-library'),
                            title: i18n.global.t('breadcrumbs.template-documents-library'),
                            staffOnly: true,
                            siteMap: true,
                        },
                    },
                    {
                        path: 'documents-library',
                        name: 'DocumentsLibrary',
                        component: () => import('@/views/dashboard/DocumentsLibraryView.vue'),
                        meta: {
                            breadcrumb: i18n.global.t('breadcrumbs.template-documents-library'),
                            title: i18n.global.t('breadcrumbs.template-documents-library'),
                            siteMap: true,
                        },
                    },
                    {
                        path: 'manage-contents',
                        meta: {
                            breadcrumb: i18n.global.t('breadcrumbs.contents'),
                            staffOnly: true,
                            siteMap: true,
                        },
                        children: [
                            {
                                path: '',
                                name: 'ManageContents',
                                component: () => import('@/views/dashboard/ContentManagementView.vue'),
                                meta: {
                                    title: i18n.global.t('breadcrumbs.contents'),
                                    staffOnly: true,
                                    siteMap: true,
                                }
                            },
                            {
                                path: ':id',
                                name: 'ContentManagementDetail',
                                component: () => import('@/views/dashboard/ContentManagementDetailView.vue'),
                                meta: {
                                    breadcrumb: i18n.global.t('breadcrumbs.content'),
                                    title: i18n.global.t('breadcrumbs.content'),
                                    staffOnly: true,
                                }
                            }
                        ]
                    },
                ]
            },
            {
                path: 'about',
                name: 'About',
                component: () => import('@/views/misc/AboutView.vue'),
                meta: {
                    title: i18n.global.t('breadcrumbs.about'),
                    breadcrumb: i18n.global.t('breadcrumbs.about'),
                    colorVariant: 'space-1',
                    siteMap: true,
                }
            },
            {
                path: 'contact',
                name: 'Contact',
                component: () => import('@/views/misc/ContactView.vue'),
                meta: {
                    title: i18n.global.t('breadcrumbs.contact'),
                    breadcrumb: i18n.global.t('breadcrumbs.contact'),
                    colorVariant: 'space-1',
                    siteMap: true,
                    breaklineFooter: true,
                }
            },
            {
                path: 'legal-notice',
                name: 'LegalNotice',
                component: () => import('@/views/misc/LegalNoticeView.vue'),
                meta: {
                    title: i18n.global.t('breadcrumbs.legal-notice'),
                    breadcrumb: i18n.global.t('breadcrumbs.legal-notice'),
                    colorVariant: 'space-1',
                    siteMap: true,
                }
            },
            {
                path: 'privacy-policy',
                name: 'PrivacyPolicy',
                component: () => import('@/views/misc/PrivacyPolicyView.vue'),
                meta: {
                    title: i18n.global.t('breadcrumbs.privacy-policy'),
                    breadcrumb: i18n.global.t('breadcrumbs.privacy-policy'),
                    colorVariant: 'space-1',
                    siteMap: true,
                }
            },
            {
                path: 'accessibility-declaration',
                name: 'AccessibilityDeclaration',
                component: () => import('@/views/misc/AccessibilityDeclarationView.vue'),
                meta: {
                    title: i18n.global.t('breadcrumbs.accessibility-declaration'),
                    breadcrumb: i18n.global.t('breadcrumbs.accessibility-declaration'),
                    colorVariant: 'space-1',
                    siteMap: true,
                }
            },
            {
                path: 'multiannual-accessibility-plan',
                name: 'MultiannualAccessibilityPlan',
                component: () => import('@/views/misc/MultiannualAccessibilityPlanView.vue'),
                meta: {
                    title: i18n.global.t('breadcrumbs.multiannual-accessibility-plan'),
                    breadcrumb: i18n.global.t('breadcrumbs.multiannual-accessibility-plan'),
                    colorVariant: 'space-1',
                    siteMap: true,
                    breaklineFooter: true,
                }
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
                path: 'cas-login',
                name: 'CASLogin',
                component: () => import('@/views/CASLoginView.vue'),
                meta: {
                    colorVariant: 'space-4'
                }
            },
            {
                path: 'register',
                name: 'Registration',
                component: () => import('@/views/RegisterLocalView.vue'),
                meta: {
                    breadcrumb: i18n.global.t('breadcrumbs.register'),
                    title: i18n.global.t('breadcrumbs.register'),
                    colorVariant: 'space-4',
                    siteMap: true,
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
                    colorVariant: 'space-4',
                    breadcrumb: i18n.global.t('breadcrumbs.register-resend-email'),
                    title: i18n.global.t('breadcrumbs.register-resend-email'),
                }
            },
            {
                path: 'password-reset',
                name: 'PasswordReset',
                component: () => import('@/views/PasswordResetView.vue'),
                meta: {
                    colorVariant: 'space-4',
                    breadcrumb: i18n.global.t('breadcrumbs.password-reset'),
                    title: i18n.global.t('breadcrumbs.password-reset'),
                    siteMap: true,
                }
            },
            {
                path: 'password-reset-confirm',
                name: 'PasswordResetConfirm',
                component: () => import('@/views/PasswordResetConfirmView.vue'),
                meta: {
                    colorVariant: 'space-4',
                    breadcrumb: i18n.global.t('breadcrumbs.password-reset-confirm'),
                    title: i18n.global.t('breadcrumbs.password-reset-confirm'),
                }
            },
            {
                path: 'logout',
                name: 'Logout',
                component: () => import('@/views/LogoutView.vue'),
                meta: {
                    colorVariant: 'space-4'
                }
            }
        ]
    },
    {
        path: '/login',
        component: () => import('@/layouts/LayoutMinimalHeader.vue'),
        meta: {
            siteMap: true,
        },
        children: [
            {
                path: '',
                name: 'Login',
                component: () => import('@/views/LoginView.vue'),
            }
        ]
    },
    {
        path: '/404',
        component: () => import('@/layouts/LayoutMinimalHeader.vue'),
        children: [
            {
                path: '',
                name: '404',
                component: () => import('@/views/404View.vue')
            }
        ]
    },
    {
        path: '/maintenance',
        component: () => import('@/layouts/LayoutVanilla.vue'),
        children: [
            {
                path: '',
                name: 'Maintenance',
                component: () => import('@/views/MaintenanceView.vue')
            }
        ]
    },
    // This must be last
    {
        path: '/:catchAll(.*)',
        redirect: {
            name: '404'
        }
    }
]

export default routes
