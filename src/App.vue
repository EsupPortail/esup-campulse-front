<script lang="ts" setup>
import {RouterView, useRoute} from 'vue-router'
import useColorVariants from '@/composables/useColorVariants'

const {colorVariant} = useColorVariants()
const route = useRoute()
</script>

<template>
    <RouterView
        v-if="colorVariant || (route.name === 'Home' || route.name === 'Login' || route.name === 'DesignSystem')"
    />
</template>

<style lang="sass">
@import "@/assets/base.css"
@import "@/assets/plan-a-design.scss"
</style>
