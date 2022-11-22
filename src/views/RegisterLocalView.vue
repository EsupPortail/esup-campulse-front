<script setup lang="ts">
import FormRegister from '@/components/form/FormRegister.vue'
</script>

<template>
  <h1>{{ $t("register.register") }}</h1>
  <QCard class="card">
    <QCardSection>
      <FormRegister />
    </QCardSection>
  </QCard>
</template>

<style scoped lang="sass">
.card
  margin-bottom: 30px
</style>
