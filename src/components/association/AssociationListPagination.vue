<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useDirectoryStore} from '@/stores/useDirectoryStore'

const {t} = useI18n()
const directoryStore = useDirectoryStore()

const emit = defineEmits<{
    (_e: 'scrollToTop'): void
}>()
</script>

<template>
    <QPagination
        v-if="directoryStore.pages > 1"
        v-model="directoryStore.currentPage"
        :aria-label="t('pagination')"
        :max="directoryStore.pages"
        @update:model-value="emit('scrollToTop')"
    />
</template>