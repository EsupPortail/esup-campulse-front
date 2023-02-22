<script lang="ts" setup>
import { RouterView } from 'vue-router'
import AlertAbortedCasRegistration from '@/components/alert/AlertAbortedCasRegistration.vue'
import LayoutBreadcrumbs from "@/components/layout/LayoutBreadcrumbs.vue";
</script>

<template>
    <QPageContainer>
        <main>
            <LayoutBreadcrumbs />
            <Suspense>
                <RouterView />
            </Suspense>
            <AlertAbortedCasRegistration />
        </main>
    </QPageContainer>
</template>
