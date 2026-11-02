<script lang="ts" setup>
import FormRegister from '@/components/authentication/FormRegister.vue'
</script>

<template>
  <QCard class="card">
    <QCardSection>
      <FormRegister :is-cas="true"/>
    </QCardSection>
  </QCard>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms";
</style>