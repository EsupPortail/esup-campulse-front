<script lang="ts" setup>
import LayoutHeader from '@/components/layout/LayoutHeader.vue'
import LayoutBreadcrumbs from '@/components/layout/LayoutBreadcrumbs.vue'
import LayoutContent from '@/components/layout/LayoutContent.vue'
import LayoutFooter from '@/components/layout/LayoutFooter.vue'
import {useRoute} from 'vue-router'

const route = useRoute()
</script>

<template>
    <QLayout id="layout-page" view="hHh lpR fFf">
        <LayoutHeader/>
        <LayoutBreadcrumbs v-if="route.name !== 'Login' && route.name !== 'Home'"/>
        <LayoutContent/>
        <LayoutFooter/>
    </QLayout>
</template>

<style lang="sass" scoped>
.q-layout
    max-width: 1280px
    margin: 0 auto
</style>
