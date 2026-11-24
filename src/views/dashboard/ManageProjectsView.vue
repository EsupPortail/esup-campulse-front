<script lang="ts" setup>
import {computed} from 'vue'
import useUserGroups from '@/composables/useUserGroup'
import ManagerProjectsView from '@/views/dashboard/manager/commission/ManagerProjectsView.vue'
import StudentProjectsView from '@/views/dashboard/student/StudentProjectsView.vue'

const {isStaff} = useUserGroups()

const currentProjectsView = computed(() => isStaff.value ? ManagerProjectsView : StudentProjectsView)
</script>

<template>
  <component :is="currentProjectsView" />
</template>
