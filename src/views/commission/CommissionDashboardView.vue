<script lang="ts" setup>
import useUserGroups from '@/composables/useUserGroup'
import DashboardStudentProjectsManagement from '@/components/project/DashboardStudentProjectsManagement.vue'
import DashboardProjectsManagement from '@/components/project/DashboardProjectsManagement.vue'
import {usePermission} from '@/composables/usePermission'

const {isStaff, isInGroup} = useUserGroups()
const {hasPerm} = usePermission()

</script>

<template>
  <DashboardStudentProjectsManagement
    v-if="hasPerm('add_project_association') || hasPerm('add_project_user')"
  />
  <DashboardProjectsManagement v-if="isStaff || isInGroup('MEMBER_FUND')"/>
</template>

