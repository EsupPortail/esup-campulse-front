import type {Group} from '#/groups'

export const _groups: Group[] = [
    {
        id: 1,
        name: 'MANAGER_GENERAL',
        isPublic: false,
        permissions: [
            'add_association',
            'add_association_any_institution',
            'add_association_all_fields',
            'change_association',
            'change_association_any_institution',
            'change_association_all_fields',
            'delete_association',
            'delete_association_any_institution',
            'view_association_not_enabled',
            'view_association_not_public',
            'add_commission',
            'change_commission',
            'delete_commission',
            'add_commissionfund',
            'delete_commissionfund',
            'change_content',
            'add_document',
            'add_document_any_fund',
            'add_document_any_institution',
            'change_document',
            'change_document_any_fund',
            'change_document_any_institution',
            'delete_document',
            'delete_document_any_fund',
            'delete_document_any_institution',
            'add_documentupload',
            'add_documentupload_all',
            'change_documentupload',
            'delete_documentupload',
            'delete_documentupload_all',
            'view_documentupload',
            'view_documentupload_all',
            'change_project',
            'change_project_as_validator',
            'view_project',
            'view_project_any_fund',
            'view_project_any_institution',
            'view_projectcategory',
            'view_projectcategory_any_fund',
            'view_projectcategory_any_institution',
            'add_projectcomment',
            'change_projectcomment',
            'delete_projectcomment',
            'view_projectcomment',
            'view_projectcomment_any_fund',
            'view_projectcomment_any_institution',
            'change_projectcommissionfund',
            'change_projectcommissionfund_as_validator',
            'view_projectcommissionfund',
            'view_projectcommissionfund_any_fund',
            'view_projectcommissionfund_any_institution',
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
            'add_groupinstitutionfunduser_any_group',
            'delete_groupinstitutionfunduser',
            'delete_groupinstitutionfunduser_any_group',
            'view_groupinstitutionfunduser',
            'view_groupinstitutionfunduser_any_group'
        ]
    },
    {
        id: 2,
        name: 'MANAGER_INSTITUTION',
        isPublic: false,
        permissions: [
            'add_association',
            'add_association_all_fields',
            'change_association',
            'change_association_all_fields',
            'delete_association',
            'view_association_not_enabled',
            'view_association_not_public',
            'add_document',
            'change_document',
            'delete_document',
            'add_documentupload',
            'add_documentupload_all',
            'change_documentupload',
            'delete_documentupload',
            'delete_documentupload_all',
            'view_documentupload',
            'view_documentupload_all',
            'change_project',
            'change_project_as_validator',
            'view_project',
            'view_projectcategory',
            'add_projectcomment',
            'change_projectcomment',
            'delete_projectcomment',
            'view_projectcomment',
            'change_projectcommissionfund',
            'change_projectcommissionfund_as_validator',
            'view_projectcommissionfund',
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
            'delete_groupinstitutionfunduser',
            'view_groupinstitutionfunduser',
            'view_groupinstitutionfunduser_any_group'
        ]
    },
    {
        id: 3,
        name: 'MANAGER_MISC',
        isPublic: false,
        permissions: [
            'add_association',
            'change_association',
            'change_association_all_fields',
            'delete_association',
            'view_association_not_enabled',
            'view_association_not_public',
            'add_document',
            'change_document',
            'delete_document',
            'add_documentupload',
            'add_documentupload_all',
            'change_documentupload',
            'delete_documentupload',
            'delete_documentupload_all',
            'view_documentupload',
            'view_documentupload_all',
            'change_project',
            'change_project_as_validator',
            'view_project',
            'view_projectcategory',
            'add_projectcomment',
            'change_projectcomment',
            'delete_projectcomment',
            'view_projectcomment',
            'change_projectcommissionfund',
            'change_projectcommissionfund_as_validator',
            'view_projectcommissionfund',
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
            'delete_groupinstitutionfunduser',
            'view_groupinstitutionfunduser',
            'view_groupinstitutionfunduser_any_group'
        ]
    },
    {
        id: 4,
        name: 'MEMBER_FUND',
        isPublic: true,
        permissions: [
            'view_association_not_public',
            'view_documentupload',
            'view_documentupload_all',
            'view_project',
            'view_projectcategory',
            'add_projectcomment',
            'change_projectcomment',
            'delete_projectcomment',
            'change_projectcommissionfund_as_validator',
            'view_projectcomment',
            'view_projectcommissionfund',
            'view_user',
            'view_user_misc',
            'view_user_anyone',
            'view_associationuser',
            'view_groupinstitutionfunduser'
        ]
    },
    {
        id: 6,
        name: 'STUDENT_INSTITUTION',
        isPublic: true,
        permissions: [
            'change_association',
            'add_documentupload',
            'delete_documentupload',
            'view_documentupload',
            'add_project',
            'add_project_association',
            'change_project',
            'change_project_as_bearer',
            'delete_project',
            'view_project',
            'add_projectcategory',
            'delete_projectcategory',
            'view_projectcategory',
            'view_projectcomment',
            'add_projectcommissionfund',
            'change_projectcommissionfund',
            'change_projectcommissionfund_as_bearer',
            'delete_projectcommissionfund',
            'view_projectcommissionfund',
            'view_user',
            'change_associationuser',
            'delete_associationuser',
            'view_associationuser',
            'view_groupinstitutionfunduser'
        ]
    },
    {
        id: 7,
        name: 'STUDENT_MISC',
        isPublic: true,
        permissions: [
            'add_documentupload',
            'delete_documentupload',
            'view_documentupload',
            'add_project',
            'add_project_user',
            'change_project',
            'change_project_as_bearer',
            'delete_project',
            'view_project',
            'add_projectcategory',
            'delete_projectcategory',
            'view_projectcategory',
            'view_projectcomment',
            'add_projectcommissionfund',
            'change_projectcommissionfund',
            'change_projectcommissionfund_as_bearer',
            'delete_projectcommissionfund',
            'view_projectcommissionfund',
            'view_groupinstitutionfunduser'
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
