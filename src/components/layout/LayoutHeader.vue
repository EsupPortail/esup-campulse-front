<script lang="ts" setup>
import {RouterLink, useRoute} from 'vue-router'
import LayoutHeaderNav from '@/components/layout/LayoutHeaderNav.vue'
import {useI18n} from 'vue-i18n'
import {ref, watch} from 'vue'
import useColorVariants from '@/composables/useColorVariants'
import useUtility from '@/composables/useUtility'
import LayoutMobileMenu from '@/components/layout/LayoutMobileMenu.vue'

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

const siteName = import.meta.env.VITE_APP_SITE_NAME

</script>

<template>
    <QHeader
        id="layout-header"
        :class="route.name === 'Home' ? 'variant-home' : 'variant-' + colorVariant"
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
                <LayoutHeaderNav device="desktop" />
            </QToolbar>

            <div v-if="route.name !== 'Login'">
                <div
                    v-if="route.name === 'Home'"
                    id="header-home-title"
                >
                    <div class="flex-column flex-center">
                        <h2>{{ t('header.title') }} <strong>{{ siteName }}</strong></h2>
                        <h3>{{ t('header.subtitle') }}</h3>
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
        <LayoutMobileMenu />
    </QHeader>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/header.scss';
</style>
