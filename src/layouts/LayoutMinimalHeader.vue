<script lang="ts" setup>
import LayoutTest from '@/components/layout/LayoutTest.vue'
import LayoutMinimalHeader from '@/components/layout/LayoutMinimalHeader.vue'
import LayoutContent from '@/components/layout/LayoutContent.vue'
import LayoutFooter from '@/components/layout/LayoutFooter.vue'

const testMessage = import.meta.env.VITE_APP_TEST_MESSAGE
</script>

<template>
    <QLayout
        id="layout-page"
        view="hhh lpr fff"
    >
        <LayoutTest v-if="testMessage !== ''" />
        <LayoutMinimalHeader />
        <LayoutContent />
        <LayoutFooter />
    </QLayout>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/header.scss';
</style>

