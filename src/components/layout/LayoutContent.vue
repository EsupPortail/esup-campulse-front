<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <QPageContainer>
    <main>
      <Suspense>
        <router-view/>
      </Suspense>
    </main>
  </QPageContainer>
</template>
