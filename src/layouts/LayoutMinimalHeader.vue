<script lang="ts" setup>
import LayoutMinimalHeader from '@/components/layout/LayoutMinimalHeader.vue'
import LayoutContent from '@/components/layout/LayoutContent.vue'
import LayoutFooter from '@/components/layout/LayoutFooter.vue'</script>

<template>
    <QLayout
        id="layout-page"
        view="hHh lpR fFf"
    >
        <LayoutMinimalHeader/>
        <LayoutContent/>
        <LayoutFooter/>
    </QLayout>
</template>

<style lang="scss">
@import '@/assets/styles/header.scss';

.q-layout {
    max-width: 1280px;
    margin: 0 auto;
}
</style>
