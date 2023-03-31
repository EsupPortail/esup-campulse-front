import type {Group} from '#/groups'

export const _groups: Group[] = [
    {
        id: 1,
        name: 'MANAGER_GENERAL',
        isPublic: false,
        permissions: [
            // associations
            'add_association',
            'add_association_any_institution',
            'change_association',
            'change_association_any_institution',
            'change_association_all_fields',
            'delete_association',
            'delete_association_any_institution',
            'view_association_not_enabled',
            'view_association_not_public',
            // commissions
            'add_commissiondate',
            'delete_commissiondate',
            // documents
            'add_document',
            'add_document_any_commission',
            'add_document_any_institution',
            'delete_document',
            'delete_document_any_commission',
            'delete_document_any_institution',
            'add_documentupload',
            'add_documentupload_all',
            'change_documentupload',
            'delete_documentupload',
            'delete_documentupload_all',
            'view_documentupload',
            'view_documentupload_all',
            // projects
            'change_project',
            'change_project_restricted_fields',
            'change_projectcommissiondate',
            'change_projectcommissiondate_restricted_fields',
            'view_project',
            'view_project_all',
            'view_projectcategory',
            'view_projectcategory_all',
            'view_projectcommissiondate',
            'view_projectcommissiondate_all',
            // users
            'add_user',
            'add_user_misc',
            'change_user',
            'change_user_misc',
            'change_user_all_fields',
            'delete_user',
            'delete_user_misc',
            'view_user',
            'view_user_misc',
            'view_user_anyone',
            'change_associationuser',
            'change_associationuser_any_institution',
            'delete_associationuser',
            'delete_associationuser_any_institution',
            'view_associationuser',
            'view_associationuser_anyone',
            'add_groupinstitutioncommissionuser_any_group',
            'delete_groupinstitutioncommissionuser',
            'delete_groupinstitutioncommissionuser_any_group',
            'view_groupinstitutioncommissionuser',
            'view_groupinstitutioncommissionuser_any_group',
        ]
    },
    {
        id: 2,
        name: 'MANAGER_INSTITUTION',
        isPublic: false,
        permissions: [
            // associations
            'add_association',
            'change_association',
            'change_association_all_fields',
            'delete_association',
            'view_association_not_enabled',
            'view_association_not_public',
            // commissions
            'add_commissiondate',
            'delete_commissiondate',
            // documents
            'add_document',
            'delete_document',
            'add_documentupload',
            'add_documentupload_all',
            'change_documentupload',
            'delete_documentupload',
            'delete_documentupload_all',
            'view_documentupload',
            'view_documentupload_all',
            // projects
            'change_project',
            'change_project_restricted_fields',
            'change_projectcommissiondate',
            'change_projectcommissiondate_restricted_fields',
            'view_project',
            'view_project_all',
            'view_projectcategory',
            'view_projectcategory_all',
            'view_projectcommissiondate',
            'view_projectcommissiondate_all',
            // users
            'add_user',
            'change_user',
            'change_user_all_fields',
            'delete_user',
            'view_user',
            'view_user_anyone',
            'change_associationuser',
            'delete_associationuser',
            'view_associationuser',
            'view_associationuser_anyone',
            'delete_groupinstitutioncommissionuser',
            'view_groupinstitutioncommissionuser',
            'view_groupinstitutioncommissionuser_any_group',
        ]
    },
    {
        id: 3,
        name: 'MANAGER_MISC',
        isPublic: false,
        permissions: [
            // associations
            'add_association',
            'change_association',
            'change_association_all_fields',
            'delete_association',
            'view_association_not_enabled',
            'view_association_not_public',
            // commissions
            'add_commissiondate',
            'delete_commissiondate',
            // documents
            'add_document',
            'delete_document',
            'add_documentupload',
            'add_documentupload_all',
            'change_documentupload',
            'delete_documentupload',
            'delete_documentupload_all',
            'view_documentupload',
            'view_documentupload_all',
            // projects
            'change_project',
            'change_project_restricted_fields',
            'change_projectcommissiondate',
            'change_projectcommissiondate_restricted_fields',
            'view_project',
            'view_project_all',
            'view_projectcategory',
            'view_projectcategory_all',
            'view_projectcommissiondate',
            'view_projectcommissiondate_all',
            // users
            'add_user',
            'add_user_misc',
            'change_user',
            'change_user_misc',
            'change_user_all_fields',
            'delete_user',
            'delete_user_misc',
            'view_user',
            'view_user_misc',
            'change_associationuser',
            'delete_associationuser',
            'view_associationuser',
            'view_associationuser_anyone',
            'delete_groupinstitutioncommissionuser',
            'view_groupinstitutioncommissionuser',
            'view_groupinstitutioncommissionuser_any_group',
        ]
    },
    {
        id: 4,
        name: 'COMMISSION',
        isPublic: true,
        permissions: [
            // associations
            'view_association_not_public',
            // documents
            'view_documentupload',
            'view_documentupload_all',
            // projects
            'view_project',
            'view_project_all',
            'view_projectcategory',
            'view_projectcategory_all',
            'view_projectcommissiondate',
            'view_projectcommissiondate_all',
            // users
            'view_user',
            'view_user_misc',
            'view_user_anyone',
            'view_associationuser',
            'view_groupinstitutioncommissionuser',
        ]
    },
    {
        id: 6,
        name: 'STUDENT_INSTITUTION',
        isPublic: true,
        permissions: [
            // associations
            'change_association',
            // documents
            'add_documentupload',
            'delete_documentupload',
            'view_documentupload',
            // projects
            'add_project',
            'change_project',
            'change_project_basic_fields',
            'view_project',
            'add_projectcategory',
            'delete_projectcategory',
            'view_projectcategory',
            'add_projectcommissiondate',
            'change_projectcommissiondate',
            'change_projectcommissiondate_basic_fields',
            'delete_projectcommissiondate',
            'view_projectcommissiondate',
            // users
            'view_user',
            'change_associationuser',
            'delete_associationuser',
            'view_associationuser',
            'view_groupinstitutioncommissionuser',
        ]
    },
    {
        id: 7,
        name: 'STUDENT_MISC',
        isPublic: true,
        permissions: [
            // documents
            'add_documentupload',
            'delete_documentupload',
            'view_documentupload',
            // projects
            'add_project',
            'change_project',
            'change_project_basic_fields',
            'view_project',
            'add_projectcategory',
            'delete_projectcategory',
            'view_projectcategory',
            'add_projectcommissiondate',
            'change_projectcommissiondate',
            'change_projectcommissiondate_basic_fields',
            'delete_projectcommissiondate',
            'view_projectcommissiondate',
            // users
            'view_groupinstitutioncommissionuser',
        ]
    },
]

export const _publicGroupLabels = [
    {
        value: 6,
        label: 'Étudiant membre d\'association',
        disable: false
    },
    {
        value: 7,
        label: 'Étudiant porteur de projet individuel',
        disable: false
    },
    {
        value: 5,
        label: 'Membre de commission Culture/ActionS',
        disable: false
    },
    {
        value: 4,
        label: 'Membre de commission FSDIE/IdEx',
        disable: false
    }
]

export const _privateGroupLabels = [
    {
        value: 6,
        label: 'Étudiant membre d\'association',
        disable: false
    },
    {
        value: 7,
        label: 'Étudiant porteur de projet individuel',
        disable: false
    },
    {
        value: 3,
        label: 'Gestionnaire Crous',
        disable: true
    },
    {
        value: 2,
        label: 'Gestionnaire établissement',
        disable: true
    },
    {
        value: 1,
        label: 'Gestionnaire général',
        disable: true
    },
    {
        value: 5,
        label: 'Membre de commission Culture/ActionS',
        disable: false
    },
    {
        value: 4,
        label: 'Membre de commission FSDIE/IdEx',
        disable: false
    }
]
