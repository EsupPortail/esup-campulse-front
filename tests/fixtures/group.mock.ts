import type { Group } from "#/groups";

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
        permissions: []
    },
    {
        id: 3,
        name: "MANAGER_MISC",
        isPublic: false,
        permissions: []
    },
    {
        id: 4,
        name: "COMMISSION_GENERAL",
        isPublic: true,
        permissions: []
    },
    {
        id: 5,
        name: "COMMISSION_MISC",
        isPublic: true,
        permissions: []
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
        permissions: []
    },
]
