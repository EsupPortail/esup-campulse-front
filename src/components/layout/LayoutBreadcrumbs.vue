<script lang="ts" setup>
import {useRoute} from 'vue-router'
import {onMounted, ref, watch} from 'vue'
import useUtility from '@/composables/useUtility'
import {useI18n} from 'vue-i18n'
import useColorVariants from '@/composables/useColorVariants'

const {t} = useI18n()
const route = useRoute()
const {initBreadcrumbs} = useUtility()
const {colorVariant} = useColorVariants()


const breadcrumbs = ref<{ label: string, to: string }[]>([])


watch(() => route.path, () => {
    breadcrumbs.value = initBreadcrumbs(route.matched, route.params)
})

onMounted(() => {
    breadcrumbs.value = initBreadcrumbs(route.matched, route.params)
})

</script>

<template>
    <nav
        id="layout-breadcrumbs"
        :class="'variant-' + colorVariant"
        role="navigation"
        :aria-label="t('you-are-here')"
    >
        <QBreadcrumbs
            gutter="none"
            separator=""
            role="list"
        >
            <QBreadcrumbsEl
                :label="t('breadcrumbs.home')"
                :to="{ name: 'Home' }"
                role="listitem"
            />
            <QBreadcrumbsEl
                v-for="(element, index) in breadcrumbs"
                :key="index"
                :label="element.label"
                :to="element.to"
                role="listitem"
                :aria-current="(index === breadcrumbs.length - 1) ? 'page' : 'false'"
            />
        </QBreadcrumbs>
    </nav>
</template>

<style lang="scss">
@import '@/assets/styles/breadcrumbs.scss';
</style>
