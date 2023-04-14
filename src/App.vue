<script lang="ts" setup>
import {RouterView, useRoute} from 'vue-router'
import useColorVariants from '@/composables/useColorVariants'

const {colorVariant} = useColorVariants()
const route = useRoute()

const routesNames = ['Home', 'Login', 'CASLogin', '404', 'DesignSystem']
</script>

<template>
    <RouterView
        v-if="colorVariant || (route.name ? routesNames.includes(route.name?.toString()) : true)"
    />
</template>

<style lang="sass">
@import "@/assets/base.css"
@import "@/assets/plan-a-design.scss"
</style>
