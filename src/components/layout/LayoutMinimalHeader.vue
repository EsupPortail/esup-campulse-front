<script lang="ts" setup>
import {RouterLink} from 'vue-router'
import LayoutHeaderNav from '@/components/layout/LayoutHeaderNav.vue'

const siteName = import.meta.env.VITE_APP_SITE_NAME
</script>

<template>
    <QHeader
        id="layout-minimal-header"
        class="variant-space-1"
        elevated
        height-hint="98"
        role="banner"
    >
        <div class="container">
            <QToolbar role="">
                <QToolbarTitle>
                    <h1>
                        <RouterLink
                            :to="{name: 'Home'}"
                            class="home-link"
                        >
                            {{ siteName }}
                        </RouterLink>
                    </h1>
                </QToolbarTitle>
                <LayoutHeaderNav/>
            </QToolbar>
        </div>
    </QHeader>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/header.scss';
</style>
