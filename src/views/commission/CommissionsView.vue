<script lang="ts" setup>
import useUserGroups from '@/composables/useUserGroups'
import DashboardStudentProjectsManagement from '@/components/dashboard/DashboardStudentProjectsManagement.vue'
import DashboardProjectsManagement from '@/components/dashboard/DashboardProjectsManagement.vue'

const {isStaff} = useUserGroups()

</script>

<template>
    <section class="dashboard-section">
        <div class="dashboard-section-container">
            <DashboardProjectsManagement v-if="isStaff"/>
            <DashboardStudentProjectsManagement v-else/>
        </div>
    </section>
</template>

