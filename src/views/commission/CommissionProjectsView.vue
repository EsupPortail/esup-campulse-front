<script lang="ts" setup>
import ProjectListTable from '@/components/project/projectList/ProjectListTable.vue'
import {computed} from 'vue'
import {useRoute} from 'vue-router'

const route = useRoute()

const commissionId = computed<number>(() => {
  return parseInt(route.params.commissionId as string)
})
</script>

<template>
  <ProjectListTable :commission-id="commissionId"/>
</template>