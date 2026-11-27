<script lang="ts" setup>
import {useId} from 'vue'

type EditorRule = (value: string) => boolean | string

withDefaults(defineProps<{
  label: string,
  rules?: EditorRule[],
  required?: boolean,
  disable?: boolean,
  color?: string,
}>(), {
  rules: () => [],
  required: false,
  disable: false,
  color: 'dashboard',
})

const model = defineModel<string>({required: true})
const editorId = useId()
</script>

<template>
  <QField
    :disable="disable"
    :for="editorId"
    :label="label + (required ? ' *' : '')"
    :model-value="model"
    :rules="rules"
    borderless
    color="grey-10"
    lazy-rules
    stack-label
  >
    <QEditor
      :id="editorId"
      v-model="model"
      :aria-required="required || undefined"
      :disable="disable"
      :toolbar-toggle-color="color"
      min-height="5rem"
    />
  </QField>
</template>

<style lang="scss" scoped>
.q-editor {
  margin-top: 0.5rem;
  width: 100%;
}
</style>
