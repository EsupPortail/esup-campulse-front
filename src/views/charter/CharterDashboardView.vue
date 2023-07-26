<script lang="ts" setup>
import DashboardCharterManagement from '@/components/charter/DashboardCharterManagement.vue'
import DashboardStudentCharterManagement from '@/components/charter/DashboardStudentCharterManagement.vue'
import useUserGroups from '@/composables/useUserGroups'

const {isStaff} = useUserGroups()
</script>

<template>
    <DashboardCharterManagement v-if="isStaff"/>
    <DashboardStudentCharterManagement v-else/>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
</style>
