<script lang="ts" setup>
import {RouterView, useRoute} from 'vue-router'
import AlertAbortedCasRegistration from '@/components/alert/AlertAbortedCasRegistration.vue'
import useColorVariants from '@/composables/useColorVariants'
import NavigateTopButton from '@/components/NavigateTopButton.vue'

const {colorVariant} = useColorVariants()
const route = useRoute()

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
        <AlertAbortedCasRegistration v-if="route.name !== 'Registration'"/>
    </main>
</template>
