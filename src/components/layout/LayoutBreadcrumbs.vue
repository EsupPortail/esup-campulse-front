<script lang="ts" setup>
import {useRoute} from 'vue-router'
import {onMounted, ref, watch} from 'vue'

const route = useRoute()

const pathArray = ref<string[]>([])

const breadcrumbs = ref<{ label: string, to: string }[]>([])

function initBreadcrumbs() {
    pathArray.value = []
    pathArray.value = route.path.split("/")
    pathArray.value.shift()
    breadcrumbs.value = pathArray.value.reduce((breadcrumbArray, path, index) => {
        breadcrumbArray.push({
            label: route.matched[index].meta.breadcrumb || path,
            to: breadcrumbArray[index - 1]
                ? "/" + breadcrumbArray[index - 1].path + "/" + path
                : "/" + path
        })
        return breadcrumbArray
    }, [])
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