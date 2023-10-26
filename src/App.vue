<script lang="ts" setup>
import {RouterView, useRoute} from 'vue-router'
import useColorVariants from '@/composables/useColorVariants'
import SkipToContentLink from '@/components/layout/SkipToContentLink.vue'

const {colorVariant} = useColorVariants()
const route = useRoute()

const routesNames = ['Home', 'Login', 'CASLogin', '404', 'DesignSystem']

</script>

<template>
    <SkipToContentLink />
    <RouterView
        v-if="colorVariant || (route.name ? routesNames.includes(route.name?.toString()) : true)"
        :data-page=route.name
    />
</template>

<style lang="scss">
@import '@/assets/main-design.scss';
</style>
