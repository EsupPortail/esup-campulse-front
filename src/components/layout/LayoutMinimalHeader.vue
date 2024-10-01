<script lang="ts" setup>
import {RouterLink, useRoute} from 'vue-router'
import LayoutHeaderNav from '@/components/layout/LayoutHeaderNav.vue'
import LayoutMobileMenu from '@/components/layout/LayoutMobileMenu.vue'

const route = useRoute()

const siteName = import.meta.env.VITE_APP_SITE_NAME
</script>

<template>
    <QHeader
        id="layout-minimal-header"
        class="variant-space-1"
        data-test="header"
        height-hint="98"
        role="banner"
    >
        <div class="container">
            <QToolbar>
                <QToolbarTitle>
                    <RouterLink
                        :to="{ name: 'Home' }"
                        class="home-link"
                    >
                        {{ siteName }}
                    </RouterLink>
                </QToolbarTitle>
                <LayoutHeaderNav
                    v-if="route.name !== 'Maintenance'"
                    device="desktop"
                />
            </QToolbar>
        </div>
        <LayoutMobileMenu v-if="route.name !== 'Maintenance'"/>
    </QHeader>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/header.scss';
</style>
