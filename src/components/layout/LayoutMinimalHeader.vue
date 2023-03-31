<script lang="ts" setup>
import {RouterLink} from 'vue-router'
import LayoutHeaderNav from '@/components/layout/LayoutHeaderNav.vue'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()

</script>

<template>
    <QHeader
        id="layout-minimal-header"
        class="variant-space-1"
        elevated
        height-hint="98"
    >
        <QToolbar>
            <QToolbarTitle>
                <RouterLink
                    :to="{name: 'Home'}"
                    class="home-link"
                >
                    {{ t("header.title") }}
                </RouterLink>
            </QToolbarTitle>
            <LayoutHeaderNav/>
        </QToolbar>
    </QHeader>
</template>