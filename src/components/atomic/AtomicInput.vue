<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {ref} from 'vue'

const {t} = useI18n()

const props = defineProps<{
    label: string,
    model: string | number | undefined,
    color?: 'association' | 'dashboard' | 'commission' | 'charter',
    required?: boolean,
    type?: 'text' | 'textarea' | 'number' | 'url' | 'date' | 'time' | 'search',
    readonly?: boolean,
    disable?: boolean,
    width?: string,
    icon?: string
}>()

const emit = defineEmits<{
    (_e: 'update:model', _value: string | number | null): void
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
    <QInput
        :aria-describedby="isValid ? undefined : 'error-message'"
        :aria-required="required"
        :disable
        :label="`${label}${required ? ' *' : ''}`"
        :model-value="model"
        :readonly
        :rules="[val => verifyField(val) || t('forms.required-field', { field: label })]"
        :style="`width: ${width ? width : '100%'}`"
        :type="type ?? 'text'"
        clearable
        filled
        reactive-rules
        @update:model-value="emit('update:model', $event)"
    >
        <template
            v-if="icon"
            v-slot:prepend
        >
            <QIcon :name="icon"/>
        </template>
    </QInput>
    <div
        v-if="!isValid"
        id="error-message"
        role="alert"
    >
        <p>{{ t('forms.requiredField', {field: label}) }}</p>
    </div>
</template>

<style lang="sass" scoped>
.q-input
    max-width: v-bind('width')
    width: 100%

p
    position: absolute
    left: -99999rem
</style>
