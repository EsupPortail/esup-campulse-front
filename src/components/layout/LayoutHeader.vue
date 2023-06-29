<script lang="ts" setup>
import {RouterLink, useRoute} from 'vue-router'
import LayoutHeaderNav from '@/components/layout/LayoutHeaderNav.vue'
import {useI18n} from 'vue-i18n'
import {ref, watch} from 'vue'
import useColorVariants from '@/composables/useColorVariants'
import useUtility from '@/composables/useUtility'

const {t} = useI18n()
const route = useRoute()
const {colorVariant} = useColorVariants()
const {dynamicTitle} = useUtility()

const title = ref<string>(route.meta.title as string)

const initTitle = () => {
    if (!route.meta.title && dynamicTitle.value) {
        title.value = dynamicTitle.value
    } else {
        title.value = route.meta.title as string
    }
}
watch(() => route.name, initTitle)
watch(() => dynamicTitle.value, initTitle)

const mobileMenuVisible = ref(false)
const siteName = import.meta.env.VITE_APP_SITE_NAME

function ToggleMenu() {
    mobileMenuVisible.value = !mobileMenuVisible.value
}
</script>

<template>
    <QHeader
            id="layout-header"
            :class="route.name === 'Home' ? 'variant-home' : 'variant-' + colorVariant"
            elevated
            height-hint="98"
            role="banner"
    >
        <div class="container">
            <QToolbar>
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

                <div id="menu-items">
                    <button @click="ToggleMenu">
                        <i aria-hidden="true" class="bi bi-list"></i>
                    </button>

                    <span
                            id="mobile-menu-background"
                            :class="{'visible': mobileMenuVisible}"
                            aria-hidden="true"
                    ></span>

                    <LayoutHeaderNav :class="{'visible': mobileMenuVisible}"/>
                </div>
            </QToolbar>

            <div v-if="route.name !== 'Login'">
                <div
                        v-if="route.name === 'Home'"
                        id="header-home-title"
                >
                    <div class="flex-column flex-center">
                        <h1>Bienvenue sur <strong>{{ siteName }}</strong></h1>
                        <h2>{{ t('header.subtitle') }}</h2>
                    </div>
                </div>

                <div id="header-title">
                    <h1 v-if="title">
                        <span
                                id="header-title-icon"
                                aria-hidden="true"
                        >
                            <i class="bi bi-geo-alt space-1-icon"></i>
                            <i class="bi bi-book space-2-icon"></i>
                            <i class="bi bi-send space-3-icon"></i>
                            <i class="bi bi-send space-4-icon"></i>
                        </span>
                        {{ title }}
                    </h1>
                </div>
            </div>
        </div>
    </QHeader>
</template>

<style lang="scss">
@import '@/assets/styles/header.scss';
</style>
