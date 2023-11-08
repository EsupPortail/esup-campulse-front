<script lang="ts" setup>
import useUserGroups from '@/composables/useUserGroups'
import DashboardStudentProjectsManagement from '@/components/project/DashboardStudentProjectsManagement.vue'
import DashboardProjectsManagement from '@/components/project/DashboardProjectsManagement.vue'
import useSecurity from '@/composables/useSecurity'

const {isStaff, isMemberFund} = useUserGroups()
const {hasPerm} = useSecurity()

</script>

<template>
    <DashboardStudentProjectsManagement
        v-if="hasPerm('add_project_association') || hasPerm('add_project_user')"
    />
    <DashboardProjectsManagement v-if="isStaff || isMemberFund"/>
</template>

