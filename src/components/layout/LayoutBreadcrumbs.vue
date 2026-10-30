<script lang="ts" setup>
import {useRoute} from 'vue-router'
import {onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import useColorVariants from '@/composables/useColorVariant'

const {t} = useI18n()
const route = useRoute()
const {initBreadcrumbs} = useUtil()
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
    :aria-label="t('you-are-here')"
    :class="'variant-' + colorVariant"
    role="navigation"
  >
    <ul class="flex-row container">
      <li>
        <RouterLink :to="{ name: 'Home' }">{{ t('breadcrumbs.home') }}</RouterLink>
      </li>
      <li
        v-for="(element, index) in breadcrumbs"
        :key="index"
        :aria-current="(index === breadcrumbs.length - 1) ? 'page' : 'false'"
      >
        <RouterLink :to="element.to">{{ element.label }}</RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss">
@import '@/assets/styles/breadcrumbs.scss';
</style>
