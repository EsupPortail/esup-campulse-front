<script lang="ts" setup>
import LayoutHeader from '@/components/layout/LayoutHeader.vue'
import LayoutBreadcrumbs from '@/components/layout/LayoutBreadcrumbs.vue'
import LayoutContent from '@/components/layout/LayoutContent.vue'
import LayoutFooter from '@/components/layout/LayoutFooter.vue'
import {useRoute} from 'vue-router'


const route = useRoute()
</script>

<template>
    <QLayout
        id="layout-page"
        view="hhh lpr fff"
    >
        <LayoutHeader/>
        <LayoutBreadcrumbs v-if="route.name !== 'Home'"/>
        <LayoutContent/>
        <LayoutFooter/>
    </QLayout>
</template>
