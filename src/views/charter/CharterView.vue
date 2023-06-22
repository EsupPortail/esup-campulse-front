<script lang="ts" setup>
import DashboardCharterStudent from '@/components/charter/DashboardCharterStudent.vue'
import useUserGroups from '@/composables/useUserGroups'

const {isStaff} = useUserGroups()
</script>

<template>
    <DashboardCharterStudent v-if="!isStaff"/>
</template>
