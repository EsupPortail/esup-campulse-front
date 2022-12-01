<script setup lang="ts">
import { RouterView } from 'vue-router'
import AlertAbortedCasRegistration from '@/components/alert/AlertAbortedCasRegistration.vue'
</script>

<template>
  <QPageContainer>
    <main>
      <Suspense>
        <RouterView/>
      </Suspense>
      <AlertAbortedCasRegistration />
    </main>
  </QPageContainer>
</template>
