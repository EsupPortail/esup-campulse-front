<script lang="ts" setup>
import {useRoute} from 'vue-router'
import {onMounted, watch} from 'vue'
import useUtility from '@/composables/useUtility'

const route = useRoute()
const {breadcrumbs, initBreadcrumbs} = useUtility()

watch(() => route.path, () => {
    initBreadcrumbs(route.matched)
})

onMounted(() => {
    initBreadcrumbs(route.matched)
})

</script>

<template>
    <QBreadcrumbs>
        <QBreadcrumbsEl :to="{name: 'Home'}" icon="mdi-home" label="Accueil"/>
        <QBreadcrumbsEl
            v-for="(element, index) in breadcrumbs"
            :key="index"
            :label="element.label"
            :to="element.to"
        />
    </QBreadcrumbs>
</template>