<script lang="ts" setup>
defineProps<{
    label?: string,
    ariaLabel?: string,
    color: 'association' | 'dashboard' | 'commission' | 'charter' | 'custom-red',
    icon: string
    submit?: boolean,
    title?: string
}>()
</script>

<template>
    <QBtn
        :ariaLabel
        :color
        :icon
        :label
        :title="ariaLabel"
        :type="submit ? 'submit' : 'button'"
        class="btn-lg"
    />
</template>