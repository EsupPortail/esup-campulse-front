<script lang="ts" setup>
import LayoutTest from '@/components/layout/LayoutTest.vue'
import LayoutHeader from '@/components/layout/LayoutHeader.vue'
import LayoutBreadcrumbs from '@/components/layout/LayoutBreadcrumbs.vue'
import LayoutContent from '@/components/layout/LayoutContent.vue'
import LayoutFooter from '@/components/layout/LayoutFooter.vue'
import {useRoute} from 'vue-router'


const route = useRoute()
const testMessage = import.meta.env.VITE_APP_TEST_MESSAGE
</script>

<template>
    <QLayout
        id="layout-page"
        view="hhh lpr fff"
    >
        <LayoutTest v-if="testMessage !== ''" />
        <LayoutHeader />
        <LayoutBreadcrumbs v-if="route.name !== 'Home'" />
        <LayoutContent />
        <LayoutFooter />
    </QLayout>
</template>

