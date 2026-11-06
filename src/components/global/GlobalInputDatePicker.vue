<script lang="ts" setup>
import useUtil from '@/composables/useUtil'
import {computed} from 'vue'
import type {DateRange} from '#/global'

const {reverseDate} = useUtil()

const props = defineProps<{
  dateRange: DateRange,
  color: string,
  label: string,
}>()

const emit = defineEmits<{
  (e: 'update:dateRange', value: DateRange): void
}>()


const formattedDateRange = computed<string>(() => {
  if (!props.dateRange) return ''
  const factory: string[] = []
  if (props.dateRange.from) factory.push(reverseDate(props.dateRange.from))
  if (props.dateRange.to) factory.push(reverseDate(props.dateRange.to))
  return factory.join(' - ')
})

</script>

<template>
  <QInput
    :color
    :label
    :model-value="formattedDateRange"
    clearable
    filled
    @clear="emit('update:dateRange', {from: null, to: null})"
  >
    <template #append>
      <QIcon
        class="bi-calendar"
        size="small"
      >
        <QPopupProxy
          cover
          transition-hide="scale"
          transition-show="scale"
        >
          <QDate
            :color
            :model-value="dateRange"
            range
            @update:model-value="emit('update:dateRange', $event)"
          >
            <div class="row items-center justify-end">
              <QBtn
                v-close-popup
                :color
                flat
                label="Fermer"
              />
            </div>
          </QDate>
        </QPopupProxy>
      </QIcon>
    </template>
  </QInput>
</template>