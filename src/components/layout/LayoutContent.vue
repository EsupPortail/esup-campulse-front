<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <QPageContainer>
    <main>
      <Suspense>
        <RouterView/>
      </Suspense>
    </main>
  </QPageContainer>
</template>
