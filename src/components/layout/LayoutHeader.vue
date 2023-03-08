<script lang="ts" setup>
import {RouterLink, useRoute} from 'vue-router'
import LayoutHeaderNav from '@/components/layout/LayoutHeaderNav.vue'
import {useI18n} from 'vue-i18n'
import {onMounted, ref, watch} from 'vue'

const {t} = useI18n()
const route = useRoute()

const title = ref<string>(route.meta.title as string)
watch(() => route.name, () => {
    title.value = route.meta.title as string
})

const mobileMenuVisible = ref(false);
function ToggleMenu() {
    mobileMenuVisible.value = !mobileMenuVisible.value;
}
</script>

<template>
    <QHeader id="layout-header" :class="{'variant-space-1': title, 'variant-home': route.name === 'Home'}" elevated height-hint="98">
        <QToolbar>
            <QToolbarTitle>
                <RouterLink :to="{name: 'Home'}" class="home-link">{{ t("header.title") }}</RouterLink>
            </QToolbarTitle>

            <div id="menu-items">
                <button id="mobile-menu-button" @click="ToggleMenu">
                    <i class="bi bi-list"></i>
                </button>
                <span id="mobile-menu-background" :class="{ 'visible': mobileMenuVisible }" aria-hidden="true"></span>
                
                <LayoutHeaderNav :class="{ 'visible': mobileMenuVisible }" />
            </div>
        </QToolbar>

        <div v-if="route.name !== 'Login'">
            <div
                v-if="route.name === 'Home'"
                id="header-home-title"
            >
                <h2>Bienvenue sur <strong>OPALINE</strong></h2>
                <h3>Le site de la vie étudiante de l'UNISTRA</h3>
            </div>

            <div id="header-title">
                <h1 v-if="title">
                <span id="header-title-icon">
                    <i class="bi bi-geo-alt space-1-icon"></i>
                    <i class="bi bi-book space-2-icon"></i>
                    <i class="bi bi-send space-3-icon"></i>
                    <i class="bi bi-send space-4-icon"></i>
                </span>
                    {{ title }}
                </h1>
            </div>
        </div>

    </QHeader>
</template>

<style lang="sass">
@import '@/assets/styles/header.scss'
</style>