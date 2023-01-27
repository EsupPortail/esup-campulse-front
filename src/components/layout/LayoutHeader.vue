<script lang="ts" setup>
import {RouterLink} from 'vue-router'
import LayoutHeaderNav from '@/components/layout/LayoutHeaderNav.vue'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()

</script>

<template>
    <QHeader elevated height-hint="98">
        <QToolbar>
            <QToolbarTitle>
                <RouterLink class="home-link" to="/">{{ t("header.title") }}</RouterLink>
            </QToolbarTitle>
            <LayoutHeaderNav/>
        </QToolbar>
    </QHeader>
</template>