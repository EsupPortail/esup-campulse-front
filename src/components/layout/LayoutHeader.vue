<script setup lang="ts">
import { RouterLink } from 'vue-router'
import LayoutHeaderNav from '@/components/layout/LayoutHeaderNav.vue'

</script>

<template>
  <QHeader elevated height-hint="98">
    <QToolbar>
      <QToolbarTitle><RouterLink to="/" class="home-link">{{ $t("header.title") }}</RouterLink></QToolbarTitle>
      <LayoutHeaderNav />
    </QToolbar>
  </QHeader>
</template>

<style scoped lang="sass">
.home-link
  color: white
  text-decoration: none
  font-size: 2em
</style>
