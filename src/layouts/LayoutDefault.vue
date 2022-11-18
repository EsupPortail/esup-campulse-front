<script setup lang="ts">
import LayoutHeader from '@/components/layout/LayoutHeader.vue'
import LayoutContent from '@/components/layout/LayoutContent.vue'
import LayoutFooter from '@/components/layout/LayoutFooter.vue'
</script>

<template>
  <QLayout view="hHh lpR fFf">
    <LayoutHeader />
    <LayoutContent />
    <LayoutFooter />
  </QLayout>
</template>

<style scoped lang="sass">
.q-layout
  max-width: 1280px
  margin: 0 auto
</style>
