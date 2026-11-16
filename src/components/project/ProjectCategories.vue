<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useProjectStore} from '@/stores/useProjectStore'

const {t} = useI18n()
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
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";

.q-chip {
  margin: 0.25rem 0;
}
</style>
