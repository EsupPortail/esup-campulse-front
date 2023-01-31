<script lang="ts" setup>
import {useRoute} from 'vue-router'
import {onMounted, ref, watch} from 'vue'

const route = useRoute()

const breadcrumbs = ref<{ label: string, to: string }[]>([])

function initBreadcrumbs() {
    breadcrumbs.value = []
    for (let i = 0; i < route.matched.length; i++) {
        if (route.matched[i].meta.breadcrumb) {
            breadcrumbs.value.push({
                label: route.matched[i].meta.breadcrumb as string,
                to: route.matched[i].path
            })
        }
    }
}

watch(() => route.path, initBreadcrumbs)

onMounted(initBreadcrumbs)

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