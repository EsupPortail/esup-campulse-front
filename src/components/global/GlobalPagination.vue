<script lang="ts" setup>
import {useI18n} from 'vue-i18n'

defineProps<{
  count?: number,
  totalPages?: number
}>()

const currentPage = defineModel<number>({required: true})

const emit = defineEmits<{
  change: []
}>()

const {t} = useI18n()
</script>

<template>
  <nav
    v-if="(count ?? 0) > 10"
    :aria-label="t('pagination')"
    class="flex-row-center"
  >
    <QPagination
      v-model="currentPage"
      :max="totalPages ?? 1"
      color="commission"
      @update:model-value="emit('change')"
    />
  </nav>
</template>
