<script lang="ts" setup>
import DashboardCharterManagement from '@/components/charter/DashboardCharterManagement.vue'
import DashboardStudentCharterManagement from '@/components/charter/DashboardStudentCharterManagement.vue'
import useUserGroups from '@/composables/useUserGroups'

const {isStaff} = useUserGroups()
</script>

<template>
    <section class="dashboard-section">
        <div class="dashboard-section-container">
            <div class="container">
                <DashboardCharterManagement v-if="isStaff"/>
                <DashboardStudentCharterManagement v-else/>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
</style>
