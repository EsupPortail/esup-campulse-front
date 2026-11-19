<script lang="ts" setup>
import {useProjectStore} from '@/stores/useProjectStore'

const projectStore = useProjectStore()
</script>

<template>
  <div class="flex-row flex-wrap">
    <QChip
      v-for="category in projectStore.project?.categories"
      :key="category.id"
      color="commission"
      outline
    >
      {{ category.name }}
    </QChip>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms";
@import "@/assets/styles/dashboard";

.q-chip {
  margin: 0.25rem 0;
}
</style>
