<script lang="ts" setup>
import {useRoute} from 'vue-router'
import {onMounted, ref, watch} from 'vue'
import useUtility from '@/composables/useUtility'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
const route = useRoute()
const {initBreadcrumbs} = useUtility()

const breadcrumbs = ref<{ label: string, to: string }[]>([])

watch(() => route.path, () => {
    breadcrumbs.value = initBreadcrumbs(route.matched, route.params)
})

onMounted(() => {
    breadcrumbs.value = initBreadcrumbs(route.matched, route.params)
})

</script>

<template>
    <QBreadcrumbs>
        <QBreadcrumbsEl :label="t('breadcrumbs.home')" :to="{ name: 'Home' }" icon="mdi-home"/>
        <QBreadcrumbsEl v-for="(element, index) in breadcrumbs" :key="index" :label="element.label" :to="element.to"/>
    </QBreadcrumbs>
</template>
