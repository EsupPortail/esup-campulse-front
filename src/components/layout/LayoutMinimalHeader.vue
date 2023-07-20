<script lang="ts" setup>
import {ref} from 'vue'
import {RouterLink} from 'vue-router'
import LayoutHeaderNav from '@/components/layout/LayoutHeaderNav.vue'
import LayoutMobileMenu from '@/components/layout/LayoutMobileMenu.vue'

const mobileMenuVisible = ref(false)
const siteName = import.meta.env.VITE_APP_SITE_NAME

function ToggleMenu() {
    mobileMenuVisible.value = !mobileMenuVisible.value
}
</script>

<template>
    <QHeader
        id="layout-minimal-header"
        class="variant-space-1"
        height-hint="98"
        role="banner"
    >
        <div class="container">
            <QToolbar role="">
                <QToolbarTitle>
                    <RouterLink
                        :to="{name: 'Home'}"
                        class="home-link"
                    >
                        {{ siteName }}
                    </RouterLink>
                </QToolbarTitle>
                <LayoutHeaderNav device="desktop"/>

                <div id="menu-items">
                    <button
                        class="btn-menu"
                        @click="ToggleMenu"
                    >
                        <i
                            aria-hidden="true"
                            class="bi bi-list"
                        ></i>
                    </button>

                    <span
                        id="mobile-menu-background"
                        :class="{'visible': mobileMenuVisible}"
                        aria-hidden="true"
                    ></span>

                    <LayoutHeaderNav :class="{'visible': mobileMenuVisible}"/>
                </div>
            </QToolbar>
        </div>
        <LayoutMobileMenu/>
    </QHeader>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/header.scss';
</style>
