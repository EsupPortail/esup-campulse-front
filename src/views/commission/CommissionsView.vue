<script lang="ts" setup>
import useUserGroups from '@/composables/useUserGroups'
import DashboardStudentProjectsManagement from '@/components/project/DashboardStudentProjectsManagement.vue'
import DashboardProjectsManagement from '@/components/project/DashboardProjectsManagement.vue'

const {isStaff} = useUserGroups()

</script>

<template>
    <DashboardProjectsManagement v-if="isStaff"/>
    <DashboardStudentProjectsManagement v-else/>
</template>

