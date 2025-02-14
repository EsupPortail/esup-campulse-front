<script lang="ts" setup>
defineProps<{
    title: string,
    color: 'association' | 'dashboard' | 'commission' | 'charter'
}>()
</script>

<template>
    <div :class="`display-field ${color}`">
        <dt>{{ title }}</dt>
        <dd>
            <slot/>
        </dd>
    </div>
</template>

<style lang="scss">
@import "@/assets/_variables.scss";

.display-field {
    display: flex;
    flex-direction: column;
    background-color: $backgroundColor1;
    box-shadow: $fieldsBoxShadow;
    padding: 1rem;
    color: $textColor1;
    font-weight: $medium-weight;

    dt {
        font-weight: $semibold-weight;
    }

    &.association {
        border-left: 4px solid $associationColor;
    }

    &.charter {
        border-left: 4px solid $charterColor;
    }

    &.commission {
        border-left: 4px solid $commissionColor;
    }

    &.dashboard {
        border-left: 4px solid $dashboardColor;
    }

    ul {
        padding-left: 0;
        margin: 0;
        list-style: none;
    }
}
</style>