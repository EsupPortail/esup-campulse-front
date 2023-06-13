<script lang="ts" setup>
import useUserGroups from '@/composables/useUserGroups'
import DashboardStudentProjectsManagement from '@/components/dashboard/DashboardStudentProjectsManagement.vue'
import DashboardProjectsManagement from '@/components/dashboard/DashboardProjectsManagement.vue'

const {isStaff} = useUserGroups()

</script>

<template>
    <DashboardProjectsManagement v-if="isStaff"/>
    <DashboardStudentProjectsManagement v-else/>
</template>

