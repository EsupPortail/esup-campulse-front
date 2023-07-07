<script lang="ts" setup>
import {RouterView} from 'vue-router'
import AlertAbortedCasRegistration from '@/components/alert/AlertAbortedCasRegistration.vue'
import useColorVariants from '@/composables/useColorVariants'
import NavigateTopButton from '@/components/NavigateTopButton.vue'

const {colorVariant} = useColorVariants()

</script>


<template>
    <main
        id="main"
        :class="'variant-' + colorVariant"
        role="main"
    >
        <!--<LayoutBreadcrumbs/>-->
        <NavigateTopButton/>
        <Suspense>
            <RouterView/>
        </Suspense>
        <AlertAbortedCasRegistration/>
    </main>
</template>
