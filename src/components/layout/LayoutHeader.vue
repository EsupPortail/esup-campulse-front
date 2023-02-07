<script lang="ts" setup>
import {RouterLink} from 'vue-router'
import LayoutHeaderNav from '@/components/layout/LayoutHeaderNav.vue'
import {useI18n} from 'vue-i18n'
import LayoutHeaderProfileButton from './LayoutHeaderProfileButton.vue';

const {t} = useI18n()

</script>

<template>
    <QHeader elevated height-hint="98" id="layout-header" class="variant-space-1">
        <QToolbar>
            <QToolbarTitle>
                <RouterLink class="home-link" to="/">{{ t("header.title") }}</RouterLink>
            </QToolbarTitle>
            <LayoutHeaderNav/>
        </QToolbar>

        <div id="header-home-title">
            <h2>Bienvenue sur <strong>OPALINE</strong></h2>
            <h3>Le site de la vie étudiante de l'UNISTRA</h3>
        </div>

        <div id="header-title">
            <h1>
                <span id="header-title-icon">
                    <i class="bi bi-geo-alt space-1-icon"></i>
                    <i class="bi bi-book space-2-icon"></i>
                    <i class="bi bi-send space-3-icon"></i>
                </span>
                <strong>Annuaire</strong> des associations
            </h1>
        </div>
        
    </QHeader>
</template>