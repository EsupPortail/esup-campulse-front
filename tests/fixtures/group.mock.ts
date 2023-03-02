import type {Group} from "#/groups";

export const _groups: Group[] = [
    {
        id: 1,
        name: "MANAGER_GENERAL",
        isPublic: false,
        permissions: [
            "add_association",
            "add_association_any_institution",
            "change_association",
            "change_association_any_institution",
            "change_association_all_fields",
            "delete_association",
            "delete_association_any_institution",
            "view_association_not_enabled",
            "view_association_not_public",
            "add_user",
            "add_user_misc",
            "change_user",
            "change_user_misc",
            "delete_user",
            "delete_user_misc",
            "view_user",
            "view_user_misc",
            "view_user_anyone",
            "change_associationusers",
            "change_associationusers_any_institution",
            "delete_associationusers",
            "delete_associationusers_any_institution",
            "view_associationusers",
            "view_associationusers_anyone",
            "delete_groupinstitutionusers",
            "view_groupinstitutionusers",
            "view_groupinstitutionusers_anyone"
        ]
    },
    {
        id: 2,
        name: "MANAGER_INSTITUTION",
        isPublic: false,
        permissions: [
            "add_association",
            "change_association",
            "change_association_all_fields",
            "delete_association",
            "view_association_not_enabled",
            "view_association_not_public",
            "add_user",
            "change_user",
            "delete_user",
            "view_user",
            "view_user_anyone",
            "change_associationusers",
            "delete_associationusers",
            "view_associationusers",
            "view_associationusers_anyone",
            "delete_groupinstitutionusers",
            "view_groupinstitutionusers",
            "view_groupinstitutionusers_anyone"
        ]
    },
    {
        id: 3,
        name: "MANAGER_MISC",
        isPublic: false,
        permissions: [
            "add_association",
            "change_association",
            "change_association_all_fields",
            "delete_association",
            "view_association_not_enabled",
            "view_association_not_public",
            "add_user",
            "add_user_misc",
            "change_user",
            "change_user_misc",
            "delete_user",
            "delete_user_misc",
            "view_user",
            "view_user_misc",
            "change_associationusers",
            "delete_associationusers",
            "view_associationusers",
            "view_associationusers_anyone",
            "delete_groupinstitutionusers",
            "view_groupinstitutionusers",
            "view_groupinstitutionusers_anyone"
        ]
    },
    {
        id: 4,
        name: "COMMISSION_GENERAL",
        isPublic: true,
        permissions: [
            "view_association_not_public",
            "view_user",
            "view_user_misc",
            "view_user_anyone",
            "view_associationusers",
            "view_groupinstitutionusers"
        ]
    },
    {
        id: 5,
        name: "COMMISSION_MISC",
        isPublic: true,
        permissions: [
            "view_association_not_public",
            "view_user",
            "view_user_misc",
            "view_user_anyone",
            "view_associationusers",
            "view_groupinstitutionusers"
        ]
    },
    {
        id: 6,
        name: "STUDENT_INSTITUTION",
        isPublic: true,
        permissions: [
            "change_association",
            "change_associationusers",
            "delete_associationusers",
            "view_associationusers",
            "view_groupinstitutionusers"
        ]
    },
    {
        id: 7,
        name: "STUDENT_MISC",
        isPublic: true,
        permissions: [
            "view_groupinstitutionusers"
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
