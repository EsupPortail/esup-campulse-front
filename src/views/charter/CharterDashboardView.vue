<script lang="ts" setup>
import ManagerCharterDashboard from '@/components/charter/ManagerCharterDashboard.vue'
import StudentCharterDashboard from '@/components/charter/StudentCharterDashboard.vue'
import useUserGroups from '@/composables/useUserGroup'

const {isStaff} = useUserGroups()
</script>

<template>
  <ManagerCharterDashboard v-if="isStaff"/>
  <StudentCharterDashboard v-else/>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
</style>
