<script setup lang="ts">
import { RouterView } from 'vue-router'
import HeaderLayout from '@/components/LayoutHeader.vue'
import FooterLayout from '@/components/LayoutFooter.vue'
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <HeaderLayout />
    <q-page-container>
      <RouterView />
    </q-page-container>
    <FooterLayout />
  </q-layout>
</template>

<style lang="sass">
/* @import "@/assets/base.css" */

#app
  font-family: "Unistra A", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif

.q-layout
  max-width: 1280px
  margin: 0 auto

h1
  text-align: center

</style>
