<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <QPageContainer>
      <Suspense>
        <router-view/>
      </Suspense>
  </QPageContainer>
</template>
