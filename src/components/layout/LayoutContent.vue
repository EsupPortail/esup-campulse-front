<script lang="ts" setup>
import {RouterView} from 'vue-router'
import AlertAbortedCasRegistration from '@/components/alert/AlertAbortedCasRegistration.vue'
import useColorVariants from '@/composables/useColorVariants'
import NavigateTopButton from '@/components/NavigateTopButton.vue'

const {colorVariant} = useColorVariants()

</script>


<template>
    <QPageContainer
        id="layout-content"
        :class="'variant-' + colorVariant"
    >
        <main>
            <!--<LayoutBreadcrumbs/>-->
            <NavigateTopButton/>
            <Suspense>
                <RouterView/>
            </Suspense>
            <AlertAbortedCasRegistration/>
        </main>
    </QPageContainer>
</template>
