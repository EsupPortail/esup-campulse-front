<script lang="ts" setup>
import LayoutHeader from '@/components/layout/LayoutHeader.vue'
import LayoutContent from '@/components/layout/LayoutContent.vue'
import LayoutFooter from '@/components/layout/LayoutFooter.vue'
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <LayoutHeader />
    <LayoutContent />
    <LayoutFooter />
  </q-layout>
</template>

<style scoped lang="sass">
.q-layout
  max-width: 1280px
  margin: 0 auto
</style>
