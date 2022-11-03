<script lang="ts" setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <QPageContainer>
      <Suspense>
        <router-view/>
      </Suspense>
  </QPageContainer>
</template>