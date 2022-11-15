<script setup lang="ts">
import { RouterLink } from 'vue-router'
import LayoutHeaderNav from '@/components/layout/LayoutHeaderNav.vue'

</script>

<template>
  <q-header elevated height-hint="98">
    <q-toolbar>
      <q-toolbar-title><RouterLink to="/" class="home-link">{{ $t("header.title") }}</RouterLink></q-toolbar-title>
      <LayoutHeaderNav />
    </q-toolbar>
  </q-header>
</template>

<style scoped lang="sass">
.home-link
  color: white
  text-decoration: none
  font-size: 2em

</style>
