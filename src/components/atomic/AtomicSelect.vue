<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import type {SelectLabel} from '#/index'
import {ref} from 'vue'

const {t} = useI18n()

const props = defineProps<{
    label: string,
    model: number | string | undefined,
    options: SelectLabel[],
    required?: boolean,
    readonly?: boolean,
    width?: string,
    icon?: string,
    color: 'association' | 'dashboard' | 'commission' | 'charter'
}>()

const emit = defineEmits<{
    (_e: 'update:model', _value: number | string): void
}>()

const isValid = ref(true)

function verifyField(val: string | undefined): boolean {
    if (props.required) {
        isValid.value = !!val
    }
    return isValid.value
}
</script>

<template>
    <QSelect
        :aria-describedby="isValid ? undefined : 'error-message'"
        :aria-required="required"
        :color
        :label="`${label}${required ? ' *' : ''}`"
        :model-value="model"
        :options="options"
        :readonly="readonly"
        :rules="required ? [val => verifyField(val) || t('forms.required-field', { field: label })] : []"
        :style="width ? `width: ${width}` : 'width: 100%'"
        emit-value
        filled
        map-options
        reactive-rules
        stack-label
        @update:model-value="emit('update:model', $event)"
    >
        <template
            v-if="icon"
            v-slot:prepend
        >
            <QIcon :name="icon"/>
        </template>
    </QSelect>
    <div
        v-if="!isValid"
        id="error-message"
        role="alert"
    >
        <p>{{ t('forms.requiredField', {field: label}) }}</p>
    </div>
</template>

<style lang="sass" scoped>
.q-select
    max-width: v-bind('width')
    width: 100%
    padding-bottom: 2.5rem

p
    position: absolute
    left: -99999rem
</style>
